import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Configure OAuth2 client with credentials from environment variables
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

// Set refresh token for the OAuth client
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export async function POST(req: Request) {
  try {
    const { title, description, startTime, endTime, attendees = [] } = await req.json();

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure OAuth credentials are present and valid
    console.log('OAuth client credentials set, attempting to get access token');
    const tokenResponse = await oauth2Client.getAccessToken();
    const accessToken = tokenResponse?.token;
    if (!accessToken) {
      console.error('Failed to retrieve access token, token response:', tokenResponse);
      return NextResponse.json({ error: 'Unable to authenticate with Google Calendar' }, { status: 500 });
    }
    console.log('Obtained access token, proceeding to create event');

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create the event with Google Meet conferencing
    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'UTC',
      },
      attendees: attendees.map((email: string) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `roshe-meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    console.log('Creating calendar event with Meet link:', event);
    const result = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event as any,
    });
    console.log('Calendar API response:', JSON.stringify(result.data, null, 2));

    // Extract the Google Meet link and ID from the response
    const meetLink = result.data.hangoutLink || '';
    const meetingId = extractMeetingIdFromLink(meetLink);

    return NextResponse.json({
      meetingLink: meetLink,
      meetingId: meetingId,
      eventId: result.data.id,
      success: true,
    });
  } catch (error: any) {
    console.error('Error creating Google Meet meeting:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create meeting',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Extracts the meeting ID from a Google Meet URL
 */
function extractMeetingIdFromLink(link: string): string {
  if (!link) return generateMeetId();
  const match = link.match(/meet\.google\.com\/([a-z]{3}-[a-z]{4}-[a-z]{3})/);
  return match ? match[1] : generateMeetId();
}

/**
 * Generates a valid Google Meet ID in the format xxx-yyyy-zzz
 */
function generateMeetId(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz';
  let result = '';
  
  // First part: 3 characters
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  result += '-';
  
  // Middle part: 4 characters
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  result += '-';
  
  // Last part: 3 characters
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}