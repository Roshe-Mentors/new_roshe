import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  const { mentorId } = params;
  const { data, error } = await supabase
    .from('availability')
    .select('id, start_time, end_time')
    .eq('mentor_id', mentorId)
    .eq('status', 'free')
    .order('start_time', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}