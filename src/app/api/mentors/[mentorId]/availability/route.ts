import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabaseClient';

export async function GET(
  request: Request,
  context: any
) {
  const { mentorId } = context.params;

  // Get current time to filter out past slots
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('availability')
    .select('id, start_time, end_time')
    .eq('mentor_id', mentorId)
    .eq('status', 'available')
    .gt('start_time', now)
    .order('start_time', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}