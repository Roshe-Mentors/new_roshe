import { supabase } from '../lib/supabaseClient';
import { Database } from '../utils/api'; // assuming Database type

type MentorRecord = Database['public']['Tables']['mentors']['Row'];
type TagRecord = Database['public']['Tables']['expertise_tags']['Row'];
type ExpertiseRecord = Database['public']['Tables']['mentor_expertise']['Row'];
type AvailabilityRecord = Database['public']['Tables']['mentor_availability']['Row'];
type SocialLinkRecord = Database['public']['Tables']['mentor_social_links']['Row'];
export type CalendarOAuthRecord = Database['public']['Tables']['mentor_calendar_oauth']['Row'];

// Expertise Tags
export async function getExpertiseTags() {
  const { data, error } = await supabase
    .from<TagRecord>('expertise_tags')
    .select('*');
  if (error) throw error;
  return data;
}

// Mentor Expertise
export async function getMentorExpertise(mentorId: string) {
  const { data, error } = await supabase
    .from<ExpertiseRecord>('mentor_expertise')
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
    .from<AvailabilityRecord>('mentor_availability')
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
    .from<SocialLinkRecord>('mentor_social_links')
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
    .from<CalendarOAuthRecord>('mentor_calendar_oauth')
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
  // Try to fetch existing profile
  let { data, error } = await supabase
    .from<MentorRecord>('mentors')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    console.warn('No mentor profile found, creating new one for user:', userId, error);
    // Create a new mentor record with minimal fields
    const insertRes = await supabase
      .from<MentorRecord>('mentors')
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
    .from<MentorRecord>('mentors')
    .update(updates)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}
