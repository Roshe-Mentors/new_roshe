export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
//import { createVideoSDKMeeting } from '../../../services/videoSDKService';
import { createAgoraMeeting } from '../../../services/agoraService';
import { createAdminClient } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['mentorId', 'userId', 'date', 'time', 'sessionType', 'slotId'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if time slot is still available in database (case-insensitive)
    const supabaseAdmin = createAdminClient();
    const { data: slot, error: slotError } = await supabaseAdmin
      .from('availability')
      .select('status')
      .eq('id', bookingData.slotId)
      .maybeSingle();
    if (slotError) {
      console.error('Error checking availability slot:', slotError);
    }
    const status = slot?.status?.trim().toLowerCase();
    // Only treat 'booked' status as unavailable
    if (status === 'booked') {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    // Create Agora meeting server-side
    try {
      const { channel, token, appId } = createAgoraMeeting(bookingData.slotId);

      // Create mentoring session record
      const startISO = new Date(`${bookingData.date}T${bookingData.time}`).toISOString();
      const endDate = new Date(startISO);
      endDate.setMinutes(endDate.getMinutes() + 30);
      const endISO = endDate.toISOString();
      await supabaseAdmin.from('mentoring_sessions').insert([{ 
        mentor_id: bookingData.mentorId,
        mentee_id: bookingData.userId,
        status: 'upcoming',
        start_time: startISO,
        end_time: endISO,
        title: bookingData.sessionType,
        meeting_link: channel,
        description: bookingData.sessionType
      }]);

      // Mark the availability slot as booked
      try {
        const supabaseAdminSlot = (await import('../../../lib/supabaseClient')).createAdminClient();
        await supabaseAdminSlot
          .from('availability')
          .update({ status: 'booked' })
          .eq('id', bookingData.slotId);
      } catch (slotError) {
        console.error('Failed to mark slot as booked:', slotError);
      }

      // Return success response with Agora meeting credentials
      return NextResponse.json({
        success: true,
        message: 'Session booked successfully',
        meeting: { channel, token, appId, start_time: startISO, end_time: endISO }
      });
    } catch (error: any) {
      console.error('Error processing booking:', error.message, error.stack, error);
      return NextResponse.json(
        { error: `Failed to create booking: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error handling booking request:', error.message, error.stack, error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}