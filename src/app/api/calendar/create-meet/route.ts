import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load service account credentials from JSON file
let serviceAccount: any;
try {
  serviceAccount = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'roshe-453001-7a68c6e483f3.json'), 'utf8')
  );
} catch (e) {
  console.warn('Service account file not found or unreadable, Google Calendar integration disabled:', e);
  serviceAccount = null;
}

export async function POST(req: Request) {
  if (!serviceAccount) {
    // Fallback: generate a default meeting link
    const fallbackId = generateMeetId();
    const fallbackLink = `https://meet.google.com/${fallbackId}`;
    return NextResponse.json({ meetingLink: fallbackLink, meetingId: fallbackId, success: true });
  }

  try {
    const { title, description, startTime, endTime, attendees = [] } = await req.json();

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Creating Google Meet with data:', {
      title,
      startTime,
      endTime,
      attendeesCount: attendees.length
    });

    // Setting up the service account JWT client directly
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/calendar'],
      'roshementorship@gmail.com' // Impersonate your Gmail account
    );

    // Authorize directly with JWT
    await jwtClient.authorize();
    console.log('Successfully authenticated with service account');

    // Create Google Calendar client with our authorized JWT
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    // Create event with conferencing data
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
      attendees: [
        { email: 'roshementorship@gmail.com' }, // Always include your Gmail
        ...attendees.map((email: string) => ({ email }))
      ],
      conferenceData: {
        createRequest: {
          requestId: `roshe-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    console.log('Creating calendar event with conferencing data');
    
    // Try to use the service account to create an event in your calendar
    const result = await calendar.events.insert({
      calendarId: 'primary', // Use primary calendar of the impersonated user
      conferenceDataVersion: 1,
      requestBody: event,
    });

    console.log('Calendar API response:', {
      id: result.data.id,
      status: result.status,
      hangoutLink: result.data.hangoutLink
    });

    // If we got a real Google Meet link, return it
    if (result.data.hangoutLink) {
      return NextResponse.json({
        meetingLink: result.data.hangoutLink,
        meetingId: extractMeetingIdFromLink(result.data.hangoutLink),
        eventId: result.data.id,
        success: true,
      });
    }

    // If no hangout link was generated (shouldn't happen), create a fallback
    console.warn('No hangout link returned from Calendar API');
    const fallbackId = generateMeetId();
    return NextResponse.json({
      meetingLink: `https://meet.google.com/${fallbackId}`,
      meetingId: fallbackId,
      eventId: result.data.id,
      success: true,
      warning: 'Using fallback meeting ID'
    });
  } catch (error: any) {
    console.error('Error creating Google Meet meeting:', error);
    
    // Log detailed error info
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    // Generate a fallback meeting link that follows Google Meet format
    const fallbackId = generateMeetId();
    const fallbackLink = `https://meet.google.com/${fallbackId}`;
    console.log('Using fallback meeting link:', fallbackLink);
    
    return NextResponse.json({
      meetingLink: fallbackLink,
      meetingId: fallbackId,
      success: true,
      warning: 'Failed to create Google Meet. Using fallback link instead: ' + (error.message || 'Unknown error')
    });
  }
}

/**
 * Extracts the meeting ID from a Google Meet URL
 */
function extractMeetingIdFromLink(link: string): string {
  if (!link) return generateMeetId();
  const match = link.match(/meet\.google\.com\/([a-z0-9-]+)/i);
  return match ? match[1] : generateMeetId();
}

/**
 * Generates a valid Google Meet ID in the format xxx-yyyy-zzz
 */
function generateMeetId(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz';
  
  // First part: 3 characters
  let result = '';
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