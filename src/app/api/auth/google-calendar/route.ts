// Create a route to initiate Google Calendar OAuth flow
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',        // This is crucial for getting a refresh token
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    prompt: 'consent'              // Forces the consent screen for refresh token
  });

  return NextResponse.redirect(url);
}