/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

// Helper function to retry operations
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000,
  retryOn?: (error: any) => boolean
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0 || (retryOn && !retryOn(error))) {
      throw error;
    }
    console.log(`Operation failed, retrying in ${delay}ms... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, delay * 1.5, retryOn);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, linkedin, dob, role = 'mentee' } = await request.json();
    
    console.log('Starting registration for:', email);

    // Check if user already exists in Supabase Auth
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
    let authUserId = null;
    let isNewAuthUser = false;
    if (existingUser && existingUser.user) {
      // User exists in Auth
      authUserId = existingUser.user.id;
    } else {
      // Register new user in Auth
      const { data, error } = await withRetry(
        () => supabase.auth.signUp({ email, password }),
        2,
        1000,
        (err) => err.code === 'UND_ERR_CONNECT_TIMEOUT'
      );
      if (error || !data.user) {
        console.error('Auth signup error:', error);
        return NextResponse.json({ 
          error: error?.message || 'Sign-up failed',
          details: error?.cause ? String(error.cause) : undefined
        }, { status: 400 });
      }
      authUserId = data.user.id;
      isNewAuthUser = true;
    }

    // Parse DOB to ISO date string (YYYY-MM-DD)
    let isoDob = '';
    if (dob.includes('-')) {
      isoDob = dob;
    } else if (dob.includes('/')) {
      const [day, month, year] = dob.split('/');
      isoDob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else {
      isoDob = null;
    }
    if (!isoDob || isNaN(Date.parse(isoDob))) {
      return NextResponse.json({ error: 'Invalid date of birth format.' }, { status: 400 });
    }

    // Check if profile exists in the correct table
    let profileExists = false;
    if (role === 'mentee') {
      const { data: menteeProfile } = await supabase.from('mentees').select('id').eq('user_id', authUserId).single();
      profileExists = !!menteeProfile;
    } else {
      const { data: mentorProfile } = await supabase.from('mentors').select('id').eq('user_id', authUserId).single();
      profileExists = !!mentorProfile;
    }
    if (profileExists) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in or reset your password.' }, { status: 400 });
    }

    // Enforce: user can only be in one table (mentee or mentor)
    if (role === 'mentee') {
      // Check if user is already a mentor
      const { data: mentorProfile } = await supabase.from('mentors').select('id').eq('user_id', authUserId).single();
      if (mentorProfile) {
        return NextResponse.json({ error: 'You already have a mentor account. You cannot register as a mentee.' }, { status: 400 });
      }
    } else if (role === 'mentor') {
      // Check if user is already a mentee
      const { data: menteeProfile } = await supabase.from('mentees').select('id').eq('user_id', authUserId).single();
      if (menteeProfile) {
        return NextResponse.json({ error: 'You already have a mentee account. You cannot register as a mentor.' }, { status: 400 });
      }
    }

    // Create profile data
    const mentorData = {
      user_id: authUserId,
      name,
      email,
      bio: `New user joined on ${new Date().toISOString().split('T')[0]}`,
      linkedin_url: linkedin,
      date_of_birth: isoDob,
      role
    };
    const menteeData = {
      user_id: authUserId,
      name,
      email,
      linkedin_url: linkedin,
      date_of_birth: isoDob,
      role
    };
    // Insert into correct table based on role
    if (role === 'mentee') {
      const menteeResult = await withRetry(
        () => supabase.from('mentees')
          .insert(menteeData) as unknown as Promise<{ data: any; error: any }>,
        2,
        1000
      );
      const menteeError = menteeResult.error;
      if (menteeError) {
        console.error('Mentee profile insert error:', menteeError);
        return NextResponse.json({ error: menteeError.message }, { status: 500 });
      }
    } else {
      const profileResult = await withRetry(
        () => supabase.from('mentors')
          .insert(mentorData) as unknown as Promise<{ data: any; error: any }>,
        2,
        1000
      );
      const profileError = profileResult.error;
      if (profileError) {
        console.error('Profile insert error:', profileError);
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }
    }
    
    console.log('Registration complete for:', email);
    return NextResponse.json({ user: { id: authUserId, email }, session: null, isNewAuthUser });
  } catch (err) {
    console.error('Unexpected registration error:', err);
    return NextResponse.json({ 
      error: 'Registration failed',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}