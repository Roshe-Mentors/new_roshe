import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json(
    { error: 'Google Meet integration removed. Use Jitsi Meet.' },
    { status: 410 }
  );
}