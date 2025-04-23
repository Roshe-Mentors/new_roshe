import { supabase } from '../lib/supabaseClient';

export type UserRole = 'mentor' | 'mentee';

export async function getUserRole(userId: string): Promise<UserRole | null> {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('mentors')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) return null;
  return data.role as UserRole;
}

export async function getUserProfile(userId: string) {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('mentors')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) return null;
  return data;
}