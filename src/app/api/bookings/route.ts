import { NextRequest, NextResponse } from 'next/server';
import { createVideoSDKMeeting } from '../../../services/videoSDKService';
import { checkTimeSlotAvailability } from '../../../services/zoomService';
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

    // Check if time slot is available
    const { available } = await checkTimeSlotAvailability(
      bookingData.mentorId,
      bookingData.date,
      bookingData.time
    );

    if (!available) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    // Create Jitsi Meet meeting
    try {
      const meeting = await createVideoSDKMeeting({
        title: bookingData.sessionType,
        description: bookingData.sessionType,
        startTime: `${bookingData.date} ${bookingData.time}`,
        attendees: [bookingData.userEmail]
      });

      // Generate fallback values for required fields
    
      const defaultMeetingUrl = `https://meet.jit.si/default-${Date.now()}`;

      // Create mentoring session record
      const supabaseAdmin = createAdminClient();
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
        meeting_link: meeting.meetingLink || defaultMeetingUrl,
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

      // Return success response with meeting details
      return NextResponse.json({
        success: true,
        message: 'Session booked successfully',
        meeting
      });
    } catch (error) {
      console.error('Error processing booking:', error);
      
      // For development/demo purposes, create a mock meeting if Jitsi API fails
      if (process.env.NODE_ENV !== 'production') {
        const mockMeetingId = `mock-${Math.floor(Math.random() * 1000000000)}`;
        const mockMeetingUrl = 'https://meet.jit.si/abc-defg-hij';
        
        const mockMeeting = {
          meetingId: mockMeetingId,
          meetingUrl: mockMeetingUrl,
          startTime: `${bookingData.date}, ${bookingData.time}, 2025`,
          duration: 60
        };
        
        // Attempt to save the mock booking to database
        try {
          const supabaseAdmin = createAdminClient();
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
            meeting_link: mockMeetingUrl,
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
        } catch (dbError) {
          console.error('Failed to save mock booking to database:', dbError);
          // Continue even if database save fails
        }
        
        // Return success with mock data
        return NextResponse.json({
          success: true,
          message: 'Mock session booked (Jitsi Meet API unavailable)',
          meeting: mockMeeting
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling booking request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}