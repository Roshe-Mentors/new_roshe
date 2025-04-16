// Callback route to receive the authorization code and exchange it for tokens
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const REDIRECT_URI = process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google-calendar';

// Log environment variables for debugging
console.log('Callback Route - Environment Variables:');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('REDIRECT_URI:', REDIRECT_URI);

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  console.log('Callback received - Parameters:');
  console.log('Code present:', !!code);
  console.log('Error:', error);
  console.log('All params:', Object.fromEntries(searchParams.entries()));
  
  if (!code) {
    return NextResponse.json({ 
      error: 'No authorization code received from Google', 
      details: 'This usually happens if you denied permission or there was an issue with the OAuth request',
      receivedParams: Object.fromEntries(searchParams.entries()) 
    }, { status: 400 });
  }

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Directly display the tokens in a format that's easy to copy
    // This is for development only - in production, you'd save this securely
    return new NextResponse(
      `<html>
        <head>
          <title>Google Calendar Authorization Complete</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
            .success { color: green; }
            .copy-button { margin-top: 10px; padding: 8px 16px; background: #4285f4; color: white; 
                          border: none; border-radius: 4px; cursor: pointer; }
            .token-section { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Authorization Successful!</h1>
          <p>Here is your refresh token. <strong>Copy it now</strong> and add it to your .env.local file as GOOGLE_REFRESH_TOKEN:</p>
          
          <div class="token-section">
            <h3>Refresh Token:</h3>
            <pre id="refresh-token">${tokens.refresh_token || "No refresh token received. Try again with prompt=consent"}</pre>
            <button class="copy-button" onclick="copyToClipboard('refresh-token')">Copy Refresh Token</button>
          </div>
          
          <div class="token-section">
            <h3>Next Steps:</h3>
            <ol>
              <li>Copy the refresh token above</li>
              <li>Add it to your .env.local file as: <pre>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token || "your-token-here"}</pre></li>
              <li>Restart your Next.js server</li>
              <li>Your Google Calendar integration should now work!</li>
            </ol>
          </div>
          
          <script>
            function copyToClipboard(elementId) {
              const el = document.getElementById(elementId);
              const text = el.textContent;
              navigator.clipboard.writeText(text)
                .then(() => alert('Copied to clipboard!'))
                .catch(err => console.error('Error copying: ', err));
            }
          </script>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json({ 
      error: 'Failed to exchange code for tokens', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}