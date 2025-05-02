import { NextRequest, NextResponse } from 'next/server';
import { createJitsiMeetMeeting } from '../../../services/jitsiMeetService';
import { saveBooking, checkTimeSlotAvailability } from '../../../services/zoomService';

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
      const meeting = await createJitsiMeetMeeting({
        title: bookingData.sessionType,
        startTime: `${bookingData.date} ${bookingData.time}`,
        endTime: `${bookingData.date} ${bookingData.time}`,
        description: bookingData.sessionType,
        attendees: [bookingData.userEmail]
      });

      // Generate fallback values for required fields
      const defaultMeetingId = `default-${Date.now()}`;
      const defaultMeetingUrl = `https://meet.jit.si/default-${Date.now()}`;

      // Prepare booking data for database
      const fullBookingData = {
        slot_id: bookingData.slotId,
        mentor_id: bookingData.mentorId,
        mentor_name: bookingData.mentorName,
        mentor_email: bookingData.mentorEmail,
        user_id: bookingData.userId,
        user_email: bookingData.userEmail, 
        date: bookingData.date,
        time: bookingData.time,
        session_type: bookingData.sessionType,
        meeting_id: meeting.meetingId || defaultMeetingId,
        meeting_url: meeting.meetingLink || defaultMeetingUrl,
        // No password for Jitsi Meet
      };

      // Save to database and then update slot status
      const bookingResult = await saveBooking(fullBookingData);
      // Mark the availability slot as booked
      try {
        const supabaseAdmin = (await import('../../../lib/supabaseClient')).createAdminClient();
        await supabaseAdmin
          .from('availability')
          .update({ status: 'booked' })
          .eq('id', bookingData.slotId);
      } catch (slotError) {
        console.error('Failed to mark slot as booked:', slotError);
      }

      // Return success response with meeting details
      return NextResponse.json({
        success: true,
        message: 'Booking created successfully',
        meeting,
        booking: bookingResult
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
          const fullBookingData = {
            slot_id: bookingData.slotId,
            mentor_id: bookingData.mentorId,
            mentor_name: bookingData.mentorName || 'Mock Mentor',
            mentor_email: bookingData.mentorEmail || 'mentor@example.com',
            user_id: bookingData.userId,
            user_email: bookingData.userEmail || 'user@example.com', 
            date: bookingData.date,
            time: bookingData.time,
            session_type: bookingData.sessionType,
            meeting_id: mockMeetingId,  // Using the already defined string value
            meeting_url: mockMeetingUrl  // Using the already defined string value
          };
          
          await saveBooking(fullBookingData);
          // Mark the availability slot as booked
          try {
            const supabaseAdmin = (await import('../../../lib/supabaseClient')).createAdminClient();
            await supabaseAdmin
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
          message: 'Mock booking created (Jitsi Meet API unavailable)',
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