import { NextResponse } from 'next/server';
import { createZoomMeeting, saveBooking, checkTimeSlotAvailability } from '@/services/zoomService';

export async function POST(request: Request) {
  try {
    const { 
      mentorId, 
      mentorName, 
      mentorEmail, 
      userId, 
      userEmail, 
      date, 
      time, 
      sessionType 
    } = await request.json();

    // Validate required fields
    if (!mentorId || !mentorName || !userId || !date || !time || !sessionType) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Check if time slot is available
    const { available } = await checkTimeSlotAvailability(mentorId, date, time);
    if (!available) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Create Zoom meeting
    const zoomMeeting = await createZoomMeeting(
      mentorName,
      mentorEmail || 'mentor@example.com', // Fallback in case email is not provided
      userEmail || 'user@example.com', // Fallback in case email is not provided
      date,
      time,
      sessionType
    );

    // Save booking to database
    const bookingData = {
      mentor_id: mentorId,
      user_id: userId,
      booking_date: date,
      booking_time: time,
      session_type: sessionType,
      meeting_id: zoomMeeting.meetingId,
      meeting_url: zoomMeeting.meetingUrl,
      meeting_password: zoomMeeting.password,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    await saveBooking(bookingData);

    return NextResponse.json({
      success: true,
      meeting: zoomMeeting,
      booking: bookingData
    });
    
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}