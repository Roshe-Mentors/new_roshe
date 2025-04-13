import { NextRequest, NextResponse } from 'next/server';
import { createZoomMeeting, saveBooking, checkTimeSlotAvailability } from '../../../services/zoomService';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['mentorId', 'userId', 'date', 'time', 'sessionType'];
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

    // Create Zoom meeting
    try {
      const meeting = await createZoomMeeting(
        bookingData.mentorName,
        bookingData.mentorEmail,
        bookingData.userEmail,
        bookingData.date,
        bookingData.time,
        bookingData.sessionType
      );

      // Prepare booking data for database
      const fullBookingData = {
        mentor_id: bookingData.mentorId,
        mentor_name: bookingData.mentorName,
        mentor_email: bookingData.mentorEmail,
        user_id: bookingData.userId,
        user_email: bookingData.userEmail, 
        date: bookingData.date,
        time: bookingData.time,
        session_type: bookingData.sessionType,
        meeting_id: meeting.meetingId,
        meeting_url: meeting.meetingUrl,
        password: meeting.password
      };

      // Save to database
      await saveBooking(fullBookingData);

      // Return success response with meeting details
      return NextResponse.json({
        success: true,
        message: 'Booking created successfully',
        meeting
      });
    } catch (error) {
      console.error('Error processing booking:', error);
      
      // For development/demo purposes, create a mock meeting if Zoom API fails
      if (process.env.NODE_ENV !== 'production') {
        const mockMeeting = {
          meetingId: 'mock-123456789',
          meetingUrl: 'https://zoom.us/j/123456789',
          password: 'password123',
          startTime: `${bookingData.date}, ${bookingData.time}, 2025`,
          duration: 60
        };
        
        // Return success with mock data
        return NextResponse.json({
          success: true,
          message: 'Mock booking created (Zoom API unavailable)',
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