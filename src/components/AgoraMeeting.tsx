import React, { useEffect, useState, useRef } from "react";
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';
import { AGORA_CLIENT_APP_ID } from '../config/agoraConfig';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaImage, FaTools } from 'react-icons/fa';
import MediaTest from './MediaTest';
import VirtualBackground from './VirtualBackground';

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
  const localTracksRef = useRef<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const hasJoinedRef = useRef(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [fullScreenUser, setFullScreenUser] = useState<IAgoraRTCRemoteUser | null>(null);
  const [virtualBg, setVirtualBg] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (hasJoinedRef.current) return;
    hasJoinedRef.current = true;

    // Initialize Agora client
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    // Define event handlers
    const onUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') setRemoteUsers(prev => prev.find(u => u.uid === user.uid) ? prev : [...prev, user]);
      if (mediaType === 'audio') user.audioTrack?.play();
    };
    const onUserUnpublished = (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
      if (mediaType === 'video') setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      if (mediaType === 'audio') user.audioTrack?.stop();
    };
    const onUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    // Register listeners
    client.on('user-published', onUserPublished);
    client.on('user-unpublished', onUserUnpublished);
    client.on('user-left', onUserLeft);

    // Join the channel when component mounts
    const joinChannel = async () => {
      let microphoneTrack: IMicrophoneAudioTrack;
      let cameraTrack: ICameraVideoTrack;
      // Request media tracks first to trigger permissions prompt
      try {
        [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      } catch (trackError: any) {
        console.warn('Track creation canceled or failed before join:', trackError);
        return; // Abort if user cancels permissions
      }

      try {
        // Join the channel after obtaining tracks
        await client.join(appId, channel, token, null);
      } catch (joinError: any) {
        console.error('Error joining channel:', joinError);
        setError(joinError.message || 'Failed to join meeting');
        // Cleanup tracks
        microphoneTrack.close();
        cameraTrack.close();
        return;
      }

      try {
        // Publish local tracks
        await client.publish([microphoneTrack, cameraTrack]);
      } catch (publishError: any) {
        console.error('Error publishing tracks:', publishError);
        setError(publishError.message || 'Failed to publish tracks');
        return;
      }

      // Store tracks in ref and mark joined
      localTracksRef.current = [microphoneTrack, cameraTrack];
      setJoined(true);
    };
    joinChannel();

    // Listen to network state changes
    const onConnectionStateChange = (cur: string) => {
      if (cur === 'DISCONNECTED') setError('Connection lost. Reconnecting...');
      else if (cur === 'RECONNECTING') setError('Reconnecting...');
      else if (cur === 'CONNECTED') setError(null);
    };
    client.on('connection-state-change', onConnectionStateChange);

    // Clean up on unmount
    return () => {
      client.off('user-published', onUserPublished);
      client.off('user-unpublished', onUserUnpublished);
      client.off('user-left', onUserLeft);
      client.off('connection-state-change', onConnectionStateChange);
      const tracks = localTracksRef.current;
      if (tracks) {
        tracks[0].close();
        tracks[1].close();
      }
      client.leave();
    };
  }, [appId, channel, token]);

  const toggleAudio = () => {
    const tracks = localTracksRef.current;
    if (tracks) {
      tracks[0].setEnabled(!audioEnabled);
      setAudioEnabled(prev => !prev);
    }
  };

  const toggleVideo = () => {
    const tracks = localTracksRef.current;
    if (tracks) {
      tracks[1].setEnabled(!videoEnabled);
      setVideoEnabled(prev => !prev);
    }
  };

  const toggleVirtualBg = () => {
    setVirtualBg(prev => !prev);
    // TODO: load and apply BodyPix segmentation for true background replacement
  };

  const leaveCall = async () => {
    const client = clientRef.current;
    const tracks = localTracksRef.current;
    if (tracks) {
      tracks[0].close(); tracks[1].close();
    }
    await client?.leave();
    window.location.reload();
  };

  const openTest = () => setTesting(true);
  const closeTest = () => setTesting(false);

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

  if (fullScreenUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="relative w-full h-full max-w-4xl max-h-full">
          <button
            onClick={() => setFullScreenUser(null)}
            className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full"
            title="Close Fullscreen"
            aria-label="Close Fullscreen"
          >
            ✕
          </button>
          <div className="w-full h-full bg-black">
            <RemoteVideoView user={fullScreenUser} />
          </div>
        </div>
      </div>
    );
  }

  if (testing) {
    return <MediaTest onClose={closeTest} />;
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-900 text-white p-3 flex justify-between items-center transition-colors duration-200">
        <h3 className="font-medium">{channel}</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleVirtualBg}
            title={virtualBg ? 'Disable Virtual Background' : 'Enable Virtual Background'}
            className="text-white p-2 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <FaImage />
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors duration-200"
            onClick={() => window.location.reload()}
            title="Reload Meeting"
            aria-label="Reload Meeting"
          >
            {/* reload icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M4 3a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L20 6.161V5a2 2 0 00-2-2H4z" />
              <path d="M18 8.672v5.328a2 2 0 01-2 2H4a2 2 0 01-2-2V8.672l8.105 4.053a2.5 2.5 0 002.79 0L18 8.672z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Network/Error Banner */}
      {joined && error && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800 p-2 flex justify-center space-x-4">
        <button onClick={toggleAudio} title={audioEnabled ? 'Mute' : 'Unmute'} className="text-white p-2 rounded hover:bg-gray-700">
          {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button onClick={toggleVideo} title={videoEnabled ? 'Hide Video' : 'Show Video'} className="text-white p-2 rounded hover:bg-gray-700">
          {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button onClick={openTest} title="Test Camera & Mic" className="text-white p-2 rounded hover:bg-gray-700">
          <FaTools />
        </button>
        <button onClick={leaveCall} title="End Call" className="text-red-500 p-2 rounded hover:bg-red-700 bg-white">
          <FaPhoneSlash />
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 transition-all duration-300 ease-in-out">
        {/* Local video */}
        <div role="button" tabIndex={0}
             aria-label="Full screen local video"
             className={`relative rounded-lg overflow-hidden aspect-video bg-black cursor-pointer transform hover:scale-105 transition-transform duration-200 ${virtualBg ? 'filter-blur-sm' : ''}`}
             onClick={() => setFullScreenUser(localTracksRef.current ? { uid: 0 } as any : null)}>
          {localTracksRef.current && (() => {
            // only extract camera track for video playback
            const cam = localTracksRef.current[1];
             return (
               <>
                 {virtualBg ? (
                   <VirtualBackground
                     videoTrack={cam}
                     enabled={virtualBg}
                     backgroundImageUrl="/images/rosheBackground.jpg"
                   />
                 ) : (
                  <LocalVideoView videoTrack={cam} />
                 )}
                 <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                   {userName || 'You'}
                 </div>
               </>
             );
           })()}
        </div>

        {/* Remote videos */}
        {remoteUsers.map(user => (
          <div
            key={user.uid}
            role="button" tabIndex={0}
            aria-label={`Full screen video of user ${user.uid}`}
            className={`relative rounded-lg overflow-hidden aspect-video bg-black cursor-pointer transform hover:scale-105 transition-transform duration-200 ${virtualBg ? 'filter-blur-sm' : ''}`}
            onClick={() => setFullScreenUser(user)}
          >
            <RemoteVideoView user={user} />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {user.uid}
            </div>
          </div>
        ))}

        {/* Placeholder when no remote user */}
        {remoteUsers.length === 0 && (
          <div className="rounded-lg bg-gray-200 aspect-video flex items-center justify-center text-gray-500">
            <p>Waiting for others to join...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const RemoteVideoView = ({ user }: { user: IAgoraRTCRemoteUser }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = videoRef.current;
    if (el && user.videoTrack) {
      try {
        user.videoTrack.play(el);
      } catch (err) {
        console.error('Error playing remote track', err);
      }
    }
    
    return () => {
      user.videoTrack?.stop();
    };
  }, [user]);
  
  return <div ref={videoRef} className="h-full w-full"></div>;
};

const LocalVideoView = ({ videoTrack }: { videoTrack: ICameraVideoTrack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      try {
        videoTrack.play(el);
      } catch (err) {
        console.error('Error playing local track', err);
      }
    }
    return () => {
      try { videoTrack.stop(); } catch {};
    };
  }, [videoTrack]);
  return <div ref={containerRef} className="h-full w-full"></div>;
};

export default AgoraMeeting;
