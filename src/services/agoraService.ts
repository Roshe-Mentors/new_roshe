import dotenv from 'dotenv';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

dotenv.config();

const APP_ID = process.env.AGORA_APP_ID || '';
const APP_CERT = process.env.AGORA_APP_CERTIFICATE || '';

// For client-side use
export const AGORA_CLIENT_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || process.env.AGORA_APP_ID || '';

if (!APP_ID || !APP_CERT) {
  throw new Error('AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in .env.local');
}

/**
 * Generates an Agora channel name and a corresponding RTC token.
 * @param meetingId Unique identifier for the meeting (e.g., slot or booking ID).
 * @param uid Optional user ID for this token; default is 0 (anonymous).
 */
export function createAgoraMeeting(meetingId: string, uid: number = 0) {
  const channel = `roshe_${meetingId}`;
  const now = Math.floor(Date.now() / 1000);
  const expire = now + 60 * 60; // token valid for 1 hour

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERT,
    channel,
    uid,
    RtcRole.PUBLISHER,
    expire
  );

  return { channel, token, appId: APP_ID };
}
