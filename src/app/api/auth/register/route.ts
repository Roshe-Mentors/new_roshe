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

    // Sign up user with retry logic for network issues
    const { data, error } = await withRetry(
      () => supabase.auth.signUp({ email, password }),
      2,
      1000,
      (err) => err.code === 'UND_ERR_CONNECT_TIMEOUT' // Only retry on timeout errors
    );

    if (error || !data.user) {
      console.error('Auth signup error:', error);
      return NextResponse.json({ 
        error: error?.message || 'Sign-up failed',
        details: error?.cause ? String(error.cause) : undefined
      }, { status: 400 });
    }

    console.log('User created successfully:', data.user.id);

    // Parse DOB "DD/MM/YYYY" to ISO date string
    const [day, month, year] = dob.split('/');
    const isoDob = `${year}-${month}-${day}`;

    // Create profile data
    const mentorData = {
      user_id: data.user.id,
      name,
      email,
      bio: `New user joined on ${new Date().toISOString().split('T')[0]}`,
      linkedin_url: linkedin,
      date_of_birth: isoDob,
      role
    };
    const menteeData = {
      user_id: data.user.id,
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
    return NextResponse.json({ user: data.user, session: data.session });
  } catch (err) {
    console.error('Unexpected registration error:', err);
    return NextResponse.json({ 
      error: 'Registration failed',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}