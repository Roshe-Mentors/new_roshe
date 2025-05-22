"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaArrowLeft } from 'react-icons/fa';
import { getUser } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

// Dynamically import AgoraMeeting with corrected path
const AgoraMeeting = dynamic(() => import('../../../components/AgoraMeeting'), { 
  ssr: false,
  // Force client-side only to ensure we get fresh environment variables on each page load
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 mt-3 text-lg">Loading Meeting Interface...</p>
    </div>
  )
});

const MeetingPageContent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const appIdParam = searchParams.get('appId');
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getUser();
        setUser(u);
      } catch (err) {
        console.error('Failed to fetch user', err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  // Derive channel from route param or query param fallback,
  // and ensure the string "undefined" is treated as an empty/invalid channel.
  let derivedChannelFromParams: string | null = params.channel as string;
  if (derivedChannelFromParams === "undefined") {
    derivedChannelFromParams = null; // Treat "undefined" string as not provided
  }

  let derivedChannelFromQuery = searchParams.get('channel');
  if (derivedChannelFromQuery === "undefined") {
    derivedChannelFromQuery = null;
  }

  let derivedMeetingIdFromQuery = searchParams.get('meetingId');
  if (derivedMeetingIdFromQuery === "undefined") {
    derivedMeetingIdFromQuery = null;
  }

  const urlChannel = derivedChannelFromParams || derivedChannelFromQuery || derivedMeetingIdFromQuery || '';
  const userName = user?.email || user?.id || 'Guest';
  // State for server-generated token and App ID
  const [meetingToken, setMeetingToken] = useState<string>('');
  const [meetingAppId, setMeetingAppId] = useState<string>('');
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [meetingChannel, setMeetingChannel] = useState<string>('');

  // Initialize meeting details from URL if present
  useEffect(() => {
    if (tokenParam && appIdParam && urlChannel) {
      setMeetingToken(tokenParam);
      setMeetingAppId(appIdParam);
      setMeetingChannel(urlChannel);
      setLoadingMeeting(false);
    }
  }, [tokenParam, appIdParam, urlChannel]);

  // Fetch token and appId from server when not provided via URL
  useEffect(() => {
    if ((tokenParam && appIdParam) || !urlChannel) return;
    (async () => {
      try {
        const res = await fetch('/api/video/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingId: urlChannel, userName }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to get Agora token');
        }
        setMeetingToken(data.token);
        setMeetingAppId(data.appId);
        if (data.channel) setMeetingChannel(data.channel);
      } catch (err: any) {
        console.error('Error fetching Agora token:', err);
        setMeetingError(err.message);
      } finally {
        setLoadingMeeting(false);
      }
    })();
  }, [urlChannel, userName, tokenParam, appIdParam]);

  if (loadingUser) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 mt-3 text-lg">Authenticating...</p>
    </div>
  );

  if (!urlChannel || meetingError || (!loadingMeeting && (!meetingAppId || !meetingToken || !meetingChannel))) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-400">Meeting Error</h1>
      <p className="mb-6 text-center text-gray-300">
        {meetingError || (!meetingAppId || !meetingToken ? 'Invalid meeting configuration.' : 'Missing channel configuration.')}
      </p>
      
     <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
       <FaArrowLeft className="mr-2" />Go to Dashboard
     </button>
   </div>
   );

  if (loadingMeeting) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 mt-3 text-lg">Setting up meeting...</p>
    </div>
  );

  return (
    <div className="relative pt-16 h-screen w-screen bg-gray-800">
      {/* Pass server-provided channel and App ID to AgoraMeeting */}
      <AgoraMeeting 
        channel={meetingChannel} 
        token={meetingToken} 
        appId={meetingAppId} 
        userName={userName} 
      />
      <button
        onClick={() => router.push('/dashboard')}
        title="Go to Dashboard"
        aria-label="Go to Dashboard"
        className="absolute top-5 left-5 p-3 bg-gray-700 text-white rounded-full"
      >
        <FaArrowLeft size={20} />
      </button>
    </div>
  );
};

const MeetingPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 mt-3 text-lg">Loading Meeting Page...</p>
      </div>
    }>
      <MeetingPageContent />
    </Suspense>
  );
};

export default MeetingPage;
