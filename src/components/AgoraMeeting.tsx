import React, { useEffect, useState, useRef } from "react";
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';
import { AGORA_CLIENT_APP_ID } from '../config/agoraConfig';

interface AgoraMeetingProps {
  channel: string;
  token: string;
  appId: string;
  userName: string;
}

const AgoraMeeting: React.FC<AgoraMeetingProps> = ({ 
  channel, 
  token, 
  appId = AGORA_CLIENT_APP_ID, 
  userName 
}) => {
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Initialize Agora client
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    // Event listeners for remote users
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers => {
          // Only add user if they don't already exist in the list
          return prevUsers.find(u => u.uid === user.uid) 
            ? prevUsers 
            : [...prevUsers, user];
        });
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      }
      if (mediaType === 'audio') {
        user.audioTrack?.stop();
      }
    });

    client.on('user-left', (user) => {
      setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
    });// Join the channel when component mounts
    const joinChannel = async () => {
      try {
        // Join the channel
        await client.join(appId, channel, token, null);
        
        // Create local audio and video tracks
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        
        // Publish local tracks
        await client.publish([microphoneTrack, cameraTrack]);
        
        setLocalTracks([microphoneTrack, cameraTrack]);
        setJoined(true);
      } catch (err: any) {
        console.error("Error joining channel:", err);
        setError(err.message || "Failed to join meeting");
      }
    };

    joinChannel();    // Clean up on unmount
    return () => {
      if (localTracks) {
        localTracks[0].close();
        localTracks[1].close();
      }
      client.leave();
    };
  }, [appId, channel, token, userName, localTracks]);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-medium">Error connecting to meeting</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Joining meeting...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">      <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
        <h3 className="font-medium">{channel}</h3>
        <div className="flex space-x-2">          <button 
            className="bg-red-600 hover:bg-red-700 rounded-full p-2"
            onClick={() => window.location.reload()}
            title="Reload Meeting"
            aria-label="Reload Meeting"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M4 3a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L20 6.161V5a2 2 0 00-2-2H4z" />
              <path d="M18 8.672v5.328a2 2 0 01-2 2H4a2 2 0 01-2-2V8.672l8.105 4.053a2.5 2.5 0 002.79 0L18 8.672z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100">
        {/* Local video */}
        <div className="relative rounded-lg overflow-hidden aspect-video bg-black">
          {localTracks && (
            <div className="absolute inset-0">
              <LocalVideoView videoTrack={localTracks[1]} />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                You (Local)
              </div>
            </div>
          )}
        </div>
        
        {/* Remote videos */}
        {remoteUsers.map(user => (
          <div key={user.uid} className="relative rounded-lg overflow-hidden aspect-video bg-black">
            <RemoteVideoView user={user} />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {user.uid.toString()}
            </div>
          </div>
        ))}

        {/* Placeholders for empty slots */}
        {remoteUsers.length === 0 && (
          <div className="rounded-lg bg-gray-200 aspect-video flex items-center justify-center text-gray-500">
            <p>Waiting for others to join...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LocalVideoView = ({ videoTrack }: { videoTrack: ICameraVideoTrack }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoTrack.play(videoRef.current);
    }
    
    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);
  
  return <div ref={videoRef} className="h-full w-full"></div>;
};

const RemoteVideoView = ({ user }: { user: IAgoraRTCRemoteUser }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (videoRef.current && user.videoTrack) {
      user.videoTrack.play(videoRef.current);
    }
    
    return () => {
      user.videoTrack?.stop();
    };
  }, [user]);
  
  return <div ref={videoRef} className="h-full w-full"></div>;
};

export default AgoraMeeting;
