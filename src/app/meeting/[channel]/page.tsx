"use client";

import React, { Suspense, useEffect, useState } from 'react'; // Added useEffect and useState
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaArrowLeft } from 'react-icons/fa';
import { getUser } from '../../../../lib/auth'; // fix import path to include .ts extension
import type { User } from '@supabase/supabase-js'; // Import User type

// Dynamically import AgoraMeeting with corrected path
const AgoraMeeting = dynamic(() => import('../../../components/AgoraMeeting'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 mt-3 text-lg">Loading Meeting Interface...</p>
    </div>
  )
});

const MeetingPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const [user, setUser] = useState<User | null | undefined>(undefined); // State for user
  const [userLoading, setUserLoading] = useState(true); // State for user loading

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (e) {
        console.error("Failed to fetch user", e);
        setUser(null); // Set to null or handle error as appropriate
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  const channelFromRoute = params.channel as string;
  const token = searchParams.get('token');
  const appId = searchParams.get('appId');

  const channel = channelFromRoute || searchParams.get('channel');
  const userName = user?.email || user?.id || 'Guest';

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 mt-3 text-lg">Authenticating...</p>
      </div>
    );
  }

  if (!channel || !token || !appId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-400">Meeting Configuration Error</h1>
        <p className="mb-6 text-center text-gray-300">
          Could not load meeting details. Required parameters (channel, token, or appId) are missing.
          Please ensure you have a valid meeting link or try again.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out"
        >
          <FaArrowLeft className="mr-2" />
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-gray-800">
      <AgoraMeeting
        channel={channel}
        token={token}
        userName={userName}
        // Removed onLeave prop as it's not supported by AgoraMeeting
      />
      <button
        onClick={() => router.push('/dashboard')}
        title="Go to Dashboard"
        aria-label="Go to Dashboard"
        className="absolute top-5 left-5 z-[100] p-3 bg-gray-700 bg-opacity-60 hover:bg-opacity-90 text-white rounded-full shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
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
