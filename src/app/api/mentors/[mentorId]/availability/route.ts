import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '../../../../../../lib/supabaseClient';

// Use shared admin client helper that picks up the service-role key
const supabaseAdmin = createAdminClient();

export async function GET(
  request: NextRequest,
  { params }
) {
  const mentorId = params.mentorId;
  console.log('API: Fetching availability for mentor ID:', mentorId);

  // Get current time to filter out past slots
  const now = new Date().toISOString();
  console.log('API: Current time for filtering:', now);

  try {
    // First get ALL availability records for this mentor (for debugging)
    const { data: allData, error: allError } = await supabaseAdmin
      .from('availability')
      .select('id, start_time, end_time, status, mentor_id')
      .eq('mentor_id', mentorId);
    
    if (allError) {
      console.error('API: Error fetching all availability records:', allError);
      // Return empty list to avoid 500 when API key is invalid
      return NextResponse.json([], { status: 200 });
    }

    console.log('API: ALL availability records for this mentor:', allData);
    console.log('API: Status values found:', [...new Set(allData?.map(item => item.status) || [])]);
    console.log('API: Date ranges:', {
      earliest: allData?.length ? new Date(Math.min(...allData.map(i => new Date(i.start_time).getTime()))).toISOString() : 'none',
      latest: allData?.length ? new Date(Math.max(...allData.map(i => new Date(i.start_time).getTime()))).toISOString() : 'none',
    });

    // Modified: Use a more flexible approach for status - now we check for status that contains 'available'
    // rather than being exactly 'available'
    console.log('API: Filtering with mentor_id =', mentorId, ', status LIKE available, start_time >', now);
    
    // Using ILIKE for case-insensitive matching with wildcards
    const { data, error } = await supabaseAdmin
      .from('availability')
      .select('id, start_time, end_time, status, mentor_id')
      .eq('mentor_id', mentorId)
      .ilike('status', '%available%')
      .gt('start_time', now)
      .order('start_time', { ascending: true });

    console.log('API: Filtered availability results:', data);

    if (error) {
      console.error('API: Error filtering availability records:', error);
      // Return empty list instead of error
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('API: Unexpected error in availability endpoint:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }
) {
  const mentorId = params.mentorId;
  const body = await request.json();
  const { start_time, end_time } = body;

  if (!start_time || !end_time) {
    return NextResponse.json({ error: 'Missing start_time or end_time' }, { status: 400 });
  }

  try {
    // Use admin client for inserting availability
    const { data, error } = await supabaseAdmin
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
      console.error('API: Error creating availability:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API: Unexpected error creating availability:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}