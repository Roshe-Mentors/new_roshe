// filepath: src/app/api/video/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAgoraMeeting } from '../../../../services/agoraService';

export async function POST(request: NextRequest) {
  try {
    const { meetingId, userName } = await request.json();
    if (!meetingId || !userName) {
      return NextResponse.json({ error: 'Missing meetingId or userName' }, { status: 400 });
    }
    
    // With Agora, we'll use the existing meetingId as the channel name
    // and generate a new token for this user to join the channel
    const { token, appId, channel } = createAgoraMeeting(meetingId);
    
    return NextResponse.json({ token, appId, channel });
  } catch (err: any) {
    console.error('Error generating Agora token:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
