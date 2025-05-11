"use client"
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { AGORA_CLIENT_APP_ID } from '../../../config/agoraConfig';
import {
  FaShareSquare,
  FaStopCircle,
  FaRecordVinyl,
} from 'react-icons/fa';

export default function MeetingPage() {
  const params = useSearchParams();
  const channel = params.get('channel') || '';
  const [token, setToken] = useState<string>('');
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const [sharing, setSharing] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    // fetch token
    fetch('/api/video/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetingId: channel, userName: 'host' }),
    })
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(console.error);
  }, [channel]);

  useEffect(() => {
    if (!token) return;
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') user.videoTrack?.play(containerRef.current!);
      if (mediaType === 'audio') user.audioTrack?.play();
    });

    const start = async () => {
      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
      await client.join(AGORA_CLIENT_APP_ID, channel, token, null);
      await client.publish([mic, cam]);
      localTracksRef.current = [mic, cam];
      cam.play(containerRef.current!);
    };

    start().catch(console.error);

    return () => {
      client.leave();
      localTracksRef.current?.forEach(t => t.close());
      screenTrackRef.current?.close();
    };
  }, [token, channel]);

  const toggleScreen = async () => {
    const client = clientRef.current!;
    if (!sharing) {
      // createScreenVideoTrack may return a track or [track, audioTrack]
      const screenTrackRaw = await AgoraRTC.createScreenVideoTrack({});
      const screenVideoTrack: ILocalVideoTrack = Array.isArray(screenTrackRaw) ? screenTrackRaw[0] : screenTrackRaw;
      // publish and play the video track
      await client.publish(screenVideoTrack);
      screenVideoTrack.play(containerRef.current!);
      screenTrackRef.current = screenVideoTrack;
      setSharing(true);
    } else {
      const track = screenTrackRef.current!;
      await client.unpublish(track);
      track.close();
      setSharing(false);
    }
  };

  const startRecording = () => {
    if (!containerRef.current) return;
    // cast to any because HTMLDivElement doesn't have captureStream
    const stream = (containerRef.current as any).captureStream(30);
    const rec = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording_${channel}.webm`;
      a.click();
    };
    rec.start();
    recorderRef.current = rec;
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl">Channel: {channel}</h1>
        <button onClick={() => window.history.back()} className="bg-gray-700 px-3 py-1 rounded">Back</button>
      </header>
      <div className="flex-grow relative bg-black" ref={containerRef}></div>
      <footer className="bg-gray-800 text-white p-4 flex justify-center space-x-6">
        <button onClick={toggleScreen} className="flex items-center space-x-1">
          <FaShareSquare /> <span>{sharing ? 'Stop Share' : 'Share Screen'}</span>
        </button>
        {!recording ? (
          <button onClick={startRecording} className="flex items-center space-x-1">
            <FaRecordVinyl /> <span>Record</span>
          </button>
        ) : (
          <button onClick={stopRecording} className="flex items-center space-x-1">
            <FaStopCircle /> <span>Stop Record</span>
          </button>
        )}
        {/* Additional custom features can be added here */}
      </footer>
    </div>
  );
}
