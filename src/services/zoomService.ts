import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

// Zoom API configuration
const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';

// These would be stored in environment variables in production
const ZOOM_ACCOUNT_ID = process.env.NEXT_PUBLIC_ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET;

// Get Zoom access token (Server-to-Server OAuth)
async function getZoomAccessToken() {
  try {
    const tokenResponse = await axios.post(
      'https://zoom.us/oauth/token',
      {},
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`
        },
        params: {
          grant_type: 'account_credentials',
          account_id: ZOOM_ACCOUNT_ID
        }
      }
    );
    
    return tokenResponse.data.access_token;
  } catch (error) {
    console.error('Error getting Zoom access token:', error);
    throw new Error('Failed to authenticate with Zoom');
  }
}

// Create a Zoom meeting
export async function createZoomMeeting(mentorName, mentorEmail, userEmail, date, time, sessionType) {
  try {
    const token = await getZoomAccessToken();
    
    // Format date and time for Zoom API
    // Convert something like "18 Jan" and "6:00pm" to ISO format
    const year = new Date().getFullYear();
    const monthMap = { 
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const dateParts = date.split(' ');
    const day = dateParts[0].padStart(2, '0');
    const month = monthMap[dateParts[1]];
    
    // Convert 12-hour time format to 24-hour format
    let timeValue = time;
    let hours = parseInt(timeValue.split(':')[0]);
    const isPM = timeValue.toLowerCase().includes('pm');
    
    if (isPM && hours < 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
    
    const formattedTime = `${hours.toString().padStart(2, '0')}:00:00`;
    const startTime = `${year}-${month}-${day}T${formattedTime}Z`;
    
    // Create the Zoom meeting
    const response = await axios.post(
      `${ZOOM_API_BASE_URL}/users/me/meetings`,
      {
        topic: `${sessionType} Session with ${mentorName}`,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: 60, // 60 minutes
        timezone: 'UTC',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: false,
          waiting_room: true,
          alternative_hosts: mentorEmail
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      meetingId: response.data.id,
      meetingUrl: response.data.join_url,
      password: response.data.password,
      startTime: response.data.start_time,
      duration: response.data.duration
    };
    
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw new Error('Failed to create Zoom meeting');
  }
}

// Save booking to Supabase
export async function saveBooking(bookingData) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData]);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving booking to database:', error);
    throw new Error('Failed to save booking information');
  }
}

// Check if time slot is available
export async function checkTimeSlotAvailability(mentorId, date, time) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('booking_date', date)
      .eq('booking_time', time);
      
    if (error) throw error;
    
    // If no bookings found for this slot, it's available
    return { available: data.length === 0 };
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    throw new Error('Failed to check time slot availability');
  }
}