import { supabase } from '../lib/supabaseClient';

// Mentor table row
interface MentorRecord {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  bio?: string;
  profile_image_url?: string;
  created_at?: string;
}

// Availability slot row
interface AvailabilityRecord {
  id: string;
  mentor_id: string;
  start_time: string;
  end_time: string;
  recurrence: unknown;
  created_at: string;
}

// Social link row
interface SocialLinkRecord {
  id: string;
  mentor_id: string;
  platform: string;
  url: string;
  created_at: string;
}

// Calendar OAuth row
export interface CalendarOAuthRecord {
  id: string;
  mentor_id: string;
  provider: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
}

// Expertise Tags
export async function getExpertiseTags() {
  const { data, error } = await supabase
    .from('expertise_tags')
    .select('*');
  if (error) throw error;
  return data;
}

// Mentor Expertise
export async function getMentorExpertise(mentorId: string) {
  const { data, error } = await supabase
    .from('mentor_expertise')
    .select('tag_id')
    .eq('mentor_id', mentorId);
  if (error) throw error;
  return data?.map((r) => r.tag_id);
}

export async function addMentorExpertise(mentorId: string, tagId: string) {
  const { error } = await supabase
    .from('mentor_expertise')
    .insert({ mentor_id: mentorId, tag_id: tagId });
  if (error) throw error;
}

export async function removeMentorExpertise(mentorId: string, tagId: string) {
  const { error } = await supabase
    .from('mentor_expertise')
    .delete()
    .match({ mentor_id: mentorId, tag_id: tagId });
  if (error) throw error;
}

// Availability
export async function getAvailability(mentorId: string) {
  const { data, error } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', mentorId);
  if (error) throw error;
  return data;
}

export async function createAvailability(slot: Omit<AvailabilityRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('mentor_availability')
    .insert(slot)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAvailability(id: string, updates: Partial<AvailabilityRecord>) {
  const { data, error } = await supabase
    .from('mentor_availability')
    .update(updates)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAvailability(id: string) {
  const { error } = await supabase
    .from('mentor_availability')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Social Links
export async function getSocialLinks(mentorId: string) {
  const { data, error } = await supabase
    .from('mentor_social_links')
    .select('*')
    .eq('mentor_id', mentorId);
  if (error) throw error;
  return data;
}

export async function createSocialLink(link: Omit<SocialLinkRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('mentor_social_links')
    .insert(link)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSocialLink(id: string, updates: Partial<SocialLinkRecord>) {
  const { data, error } = await supabase
    .from('mentor_social_links')
    .update(updates)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase
    .from('mentor_social_links')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Calendar OAuth
export async function getCalendarOAuth(mentorId: string) {
  const { data, error } = await supabase
    .from('mentor_calendar_oauth')
    .select('*')
    .eq('mentor_id', mentorId);
  if (error) throw error;
  return data?.[0] || null;
}

export async function saveCalendarOAuth(record: Omit<CalendarOAuthRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('mentor_calendar_oauth')
    .upsert(record)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCalendarOAuth(id: string) {
  const { error } = await supabase
    .from('mentor_calendar_oauth')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Core Mentor Profile
export async function getMentorProfileByUser(userId: string) {
  const { data, error } = await supabase
    .from('mentors')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    console.warn('No mentor profile found, creating new one for user:', userId, error);
    // Create a new mentor record with minimal fields
    const insertRes = await supabase
      .from('mentors')
      .insert({ user_id: userId, name: '' })
      .single();
    if (insertRes.error) throw insertRes.error;
    return insertRes.data;
  }
  return data;
}

export async function updateMentorProfile(userId: string, updates: Partial<MentorRecord>) {
  // Update profile by user_id instead of direct mentor id
  const { data, error } = await supabase
    .from('mentors')
    .update(updates)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}
