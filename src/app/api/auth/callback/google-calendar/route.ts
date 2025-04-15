// Callback route to receive the authorization code and exchange it for tokens
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Display the token information in a way you can copy
    return NextResponse.json({
      message: 'Authorization successful! Copy your refresh token below:',
      refreshToken: tokens.refresh_token,
      // Additional info to verify everything worked
      tokenInfo: {
        access_token: tokens.access_token ? "✓ Received" : "✗ Missing",
        id_token: tokens.id_token ? "✓ Received" : "✗ Missing",
        expiry_date: tokens.expiry_date
      }
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json({ 
      error: 'Failed to get tokens', 
      details: error.message 
    }, { status: 500 });
  }
}