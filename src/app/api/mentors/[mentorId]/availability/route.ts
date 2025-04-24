import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  const { mentorId } = params;
  
  // Get current time to filter out past slots
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('availability')
    .select('id, start_time, end_time')
    .eq('mentor_id', mentorId)
    .eq('status', 'available') // Changed from 'free' to 'available' to match our schema
    .gt('start_time', now) // Only return future slots
    .order('start_time', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}