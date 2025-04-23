import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  const { name, email, password, linkedin, dob, role = 'mentee' } = await request.json();

  // Sign up user
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || 'Sign-up failed' }, { status: 400 });
  }

  // Parse DOB "DD/MM/YYYY" to ISO date string
  const [day, month, year] = dob.split('/');
  const isoDob = `${year}-${month}-${day}`;

  // Insert mentor profile data with role
  const { error: profileError } = await supabase
    .from('mentors')
    .insert({
      user_id: data.user.id,
      name,
      email,
      linkedin_url: linkedin,
      date_of_birth: isoDob,
      role // User role: 'mentor' or 'mentee' (default)
    });
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ user: data.user, session: data.session });
}