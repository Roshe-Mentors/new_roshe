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

export async function POST(request: Request, context: any) {
  const { mentorId } = context.params;
  const body = await request.json();
  const { start_time, end_time } = body;

  if (!start_time || !end_time) {
    return NextResponse.json({ error: 'Missing start_time or end_time' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('availability')
    .insert([
      {
        mentor_id: mentorId,
        start_time,
        end_time,
        status: 'available',
      },
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}