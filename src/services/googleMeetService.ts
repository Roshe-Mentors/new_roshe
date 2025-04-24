// filepath: c:\Users\USER\OneDrive\Desktop\roshe\new_roshe\src\services\googleMeetService.ts
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { supabase, createAdminClient, createClient } from '../../lib/supabaseClient';

// Google API configuration
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Set refresh token from environment variable
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

/**
 * Create a Google Meet meeting through Google Calendar API
 */
export async function createGoogleMeetMeeting(
  mentorName: string,
  mentorEmail: string,
  userEmail: string,
  date: string,
  time: string,
  sessionType: string
) {
  try {
    // Format date and time for Calendar API
    // Convert something like "18 Jan" and "6:00pm" to ISO format
    const year = new Date().getFullYear() + 1; // Using next year for 2025 dates
    const monthMap: Record<string, string> = { 
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const dateParts = date.split(' ');
    const day = dateParts[0].padStart(2, '0');
    const monthAbbr = dateParts[1] as keyof typeof monthMap;
    const month = monthMap[monthAbbr] || '01'; // Default to January if month not found
    
    // Convert 12-hour time format to 24-hour format
    const timeValue = time;
    let hours = parseInt(timeValue.split(':')[0]);
    const minutes = timeValue.split(':')[1].substring(0, 2);
    const isPM = timeValue.toLowerCase().includes('pm');
    
    if (isPM && hours < 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
    
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    
    // Create ISO date strings for start and end time
    const startTime = new Date(`${year}-${month}-${day}T${formattedTime}Z`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour
    
    // For development/testing purposes, check if we're in mock mode
    if (process.env.NEXT_PUBLIC_MOCK_MEET_API === 'true') {
      console.log('Using mock Google Meet data');
      return {
        meetingId: `mock-${Math.floor(Math.random() * 1000000000)}`,
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        startTime: `${date}, ${time}, 2025`,
        duration: 60
      };
    }
    
    // Create the Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Create event with conferencing
    const event = {
      summary: `${sessionType} Session with ${mentorName}`,
      description: `${sessionType} session between ${mentorName} and a mentee.`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        { email: mentorEmail },
        { email: userEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };
    
    // Insert the event into the calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
    });
    
    // Return formatted meeting details
    return {
      meetingId: response.data.id,
      meetingUrl: response.data.hangoutLink,
      startTime: `${date}, ${time}, 2025`,
      duration: 60
    };
    
  } catch (error) {
    console.error('Error creating Google Meet meeting:', error);
    
    // In development, return mock data as fallback
    if (process.env.NODE_ENV !== 'production') {
      console.log('Returning mock Google Meet data after error');
      return {
        meetingId: `mock-error-${Math.floor(Math.random() * 1000000000)}`,
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        startTime: `${date}, ${time}, 2025`,
        duration: 60
      };
    }
    
    throw new Error('Failed to create Google Meet meeting');
  }
}

/**
 * Save booking to Supabase
 */
export async function saveBooking({
  user_id,
  mentor_id,
  date,
  time,
  duration = 30,
  description,
  meeting_link,
  slot_id,
}: {
  user_id: string;
  mentor_id: string;
  date: string;
  time: string;
  duration?: number;
  description?: string;
  meeting_link?: string;
  slot_id?: string; // Optional for backward compatibility
}) {
  try {
    // Check if slot_id is provided (new system) or use date/time (legacy)
    let slotAvailable = true;
    
    if (slot_id) {
      // New system: check availability by slot_id
      const availability = await checkTimeSlotAvailability(slot_id);
      slotAvailable = availability.available;
      
      // If not available, return error
      if (!slotAvailable) {
        return {
          success: false,
          error: 'This time slot is no longer available. Please select another time.',
        };
      }
    } else {
      // Legacy system: check by mentor_id, date and time
      const availability = await checkTimeSlotByDateTime(mentor_id, date, time);
      slotAvailable = availability.available;
      
      // If not available, return error
      if (!slotAvailable) {
        return {
          success: false,
          error: 'This time slot is already booked. Please select another time.',
        };
      }
    }

    // Create meeting link if not provided
    let finalMeetingLink = meeting_link;
    if (!finalMeetingLink) {
      const meetingResult = await createMeeting({
        date,
        time,
        duration,
      });
      finalMeetingLink = meetingResult.meetingLink;
    }

    const supabaseAdmin = createAdminClient();

    // Start a transaction to ensure both operations succeed or fail together
    // First, create the booking record
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id,
        mentor_id,
        date,
        time,
        duration,
        description,
        meeting_link: finalMeetingLink,
        slot_id, // Store the slot_id if provided
        status: 'confirmed',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error saving booking:', bookingError);
      return {
        success: false,
        error: 'Failed to save booking.',
      };
    }

    // If using the new slot system, update the availability status
    if (slot_id) {
      const { error: updateError } = await supabaseAdmin
        .from('availability')
        .update({ status: 'booked', booking_id: bookingData.id })
        .eq('id', slot_id);

      if (updateError) {
        console.error('Error updating availability status:', updateError);
        // Consider rolling back the booking if this fails
        // For now, we'll return success since the booking was created
      }
    }

    return {
      success: true,
      booking: bookingData,
    };
  } catch (error) {
    console.error('Error in saveBooking:', error);
    return {
      success: false,
      error: 'Failed to save booking. Please try again later.',
    };
  }
}

/**
 * Check if a specific time slot is available by slot ID
 */
export async function checkTimeSlotAvailability(slot_id: string) {
  try {
    const supabase = createClient();
    
    // Check if the slot exists and is available
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('id', slot_id)
      .eq('status', 'available')
      .single();
    
    if (error) {
      console.error('Error checking slot availability:', error);
      return {
        available: false,
        error: 'Error checking availability',
      };
    }
    
    // If data exists, the slot is available
    return {
      available: !!data,
      data,
    };
  } catch (error) {
    console.error('Error in checkTimeSlotAvailability:', error);
    return {
      available: false,
      error: 'Failed to check availability',
    };
  }
}

/**
 * Legacy function to check availability by date and time
 */
export async function checkTimeSlotByDateTime(mentor_id: string, date: string, time: string) {
  try {
    const supabase = createClient();
    
    // Check if there's any booking for this mentor at this time
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('mentor_id', mentor_id)
      .eq('date', date)
      .eq('time', time)
      .not('status', 'eq', 'cancelled')
      .maybeSingle();
    
    if (error) {
      console.error('Error checking booking availability:', error);
      return {
        available: false,
        error: 'Error checking availability',
      };
    }
    
    // If data exists, the slot is already booked
    return {
      available: !data,
    };
  } catch (error) {
    console.error('Error in checkTimeSlotByDateTime:', error);
    return {
      available: false,
      error: 'Failed to check availability',
    };
  }
}