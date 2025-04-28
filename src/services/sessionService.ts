import { supabase } from '../lib/supabaseClient';

// Types
interface SessionData {
  mentor_id: string;
  mentee_id: string;
  title: string;
  description?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  start_time: string;
  end_time: string;
  meeting_link?: string;
}

// Create a new session
export async function createSession(data: SessionData) {
  const { data: session, error } = await supabase
    .from('mentoring_sessions')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw error;
  }

  return session;
}

// Get sessions for a mentee
export async function getMenteeSessions(menteeId: string) {
  const { data, error } = await supabase
    .from('mentoring_sessions')
    .select(`
      *,
      mentors:mentor_id(id, name, role, company, profile_image_url)
    `)
    .eq('mentee_id', menteeId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching mentee sessions:', error);
    throw error;
  }

  return data || [];
}

// Get sessions for a mentor
export async function getMentorSessions(mentorId: string) {
  const { data, error } = await supabase
    .from('mentoring_sessions')
    .select(`
      *,
      mentees:mentee_id(id, name, profile_image_url)
    `)
    .eq('mentor_id', mentorId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching mentor sessions:', error);
    throw error;
  }

  return data || [];
}

// Get a specific session by ID
export async function getSessionById(sessionId: string) {
  const { data, error } = await supabase
    .from('mentoring_sessions')
    .select(`
      *,
      mentors:mentor_id(id, name, role, company, profile_image_url),
      mentees:mentee_id(id, name, profile_image_url)
    `)
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    throw error;
  }

  return data;
}

// Start a session (change status to active)
export async function startSession(sessionId: string) {
  const { data, error } = await supabase
    .from('mentoring_sessions')
    .update({ status: 'active' })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error starting session:', error);
    throw error;
  }

  return data;
}

// Complete a session
export async function completeSession(sessionId: string) {
  const { data, error } = await supabase
    .from('mentoring_sessions')
    .update({ status: 'completed' })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error completing session:', error);
    throw error;
  }

  return data;
}

// Cancel a session
export async function cancelSession(sessionId: string, reason?: string) {
  const { data, error } = await supabase
    .from('mentoring_sessions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason || null
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error cancelling session:', error);
    throw error;
  }

  return data;
}

// Update a session
export async function updateSession(sessionId: string, updates: Partial<SessionData>) {
  const { data, error } = await supabase
    .from('mentoring_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating session:', error);
    throw error;
  }

  return data;
}

// Get upcoming sessions count for a mentor
export async function getUpcomingSessionsCount(mentorId: string) {
  const { count, error } = await supabase
    .from('mentoring_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('mentor_id', mentorId)
    .eq('status', 'upcoming');

  if (error) {
    console.error('Error counting upcoming sessions:', error);
    throw error;
  }

  return count || 0;
}

// Get completed sessions count for a mentor
export async function getCompletedSessionsCount(mentorId: string) {
  const { count, error } = await supabase
    .from('mentoring_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('mentor_id', mentorId)
    .eq('status', 'completed');

  if (error) {
    console.error('Error counting completed sessions:', error);
    throw error;
  }

  return count || 0;
}