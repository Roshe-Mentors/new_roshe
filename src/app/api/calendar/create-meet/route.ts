import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Set up Google Calendar API with service account credentials
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Google service account authentication
function getServiceAccountAuth() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
    
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES
    });
    
    return auth;
  } catch (error) {
    console.error('Error setting up service account auth:', error);
    throw new Error('Failed to initialize Google service account');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, startTime, endTime, attendees = [] } = await request.json();
    
    // Validate required fields
    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Parse start and end times
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start or end time' },
        { status: 400 }
      );
    }
    
    // Authenticate with service account
    const auth = getServiceAccountAuth();
    
    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Generate a unique requestId for this conference
    const requestId = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    // Create the calendar event with Google Meet conferencing
    const event = {
      summary: title,
      description: description || 'Mentoring session',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC'
      },
      attendees: attendees.map((email: string) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      }
    };
    
    // Insert the event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event
    });
    
    if (!response.data) {
      throw new Error('No data returned from Google Calendar API');
    }
    
    // Extract the Google Meet link
    const meetLink = response.data.hangoutLink || '';
    const meetingId = extractMeetingIdFromLink(meetLink);
    
    return NextResponse.json({
      eventId: response.data.id,
      meetingLink: meetLink,
      meetingId,
      startTime: response.data.start?.dateTime,
      endTime: response.data.end?.dateTime
    });
  } catch (error: any) {
    console.error('Error creating Google Meet:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create meeting' },
      { status: 500 }
    );
  }
}

/**
 * Extracts the meeting ID from a Google Meet link
 */
function extractMeetingIdFromLink(link: string): string | null {
  if (!link) return null;
  const match = link.match(/meet\.google\.com\/([a-z-]+)/);
  return match ? match[1] : null;
}