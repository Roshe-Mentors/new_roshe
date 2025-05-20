import React, { useEffect, useState, useRef } from "react";
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';
import { AGORA_CLIENT_APP_ID } from '../config/agoraConfig';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaImage, FaTools, FaSpinner, FaCommentDots, FaDesktop, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import type { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import MediaTest from './MediaTest';
import VirtualBackground from './VirtualBackground';
import ChatPanel from './ChatPanel';

interface AgoraMeetingProps {
  channel: string;
  token: string;
  appId?: string; // made optional to allow default from config
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
  const [showDeviceTest, setShowDeviceTest] = useState(false);
  const [chatStreamId, setChatStreamId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenShareError, setScreenShareError] = useState<string | null>(null);
  const screenTrackRef = useRef<any>(null);
  // Track connection state for UX
  const [connectionState, setConnectionState] = useState<'CONNECTED'|'RECONNECTING'|'DISCONNECTED'>('CONNECTED');
  // Volume and network quality indicators
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  // Volume levels for local user (UID 0)
  const localVolumeLevel = volumes['0'] || 0;
  // Compute dynamic glow radius based on raw volume level
  const glowRadius = Math.min(localVolumeLevel * 20 + 2, 24);

  useEffect(() => {
    // reduce SDK verbosity to warnings and above
    AgoraRTC.setLogLevel(2);
    let chatDataId: number | null = null;
    if (hasJoinedRef.current) return;
    hasJoinedRef.current = true;

    // Initialize Agora client
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    // suppress WS_ABORT traffic_stats errors
    client.on('error', (err: any) => {
      // Suppress WS_ABORT for internal stats/ping channels
      if (err.code === 'WS_ABORT' && (err.message.includes('traffic_stats') || err.message.includes('ping'))) {
        return;
      }
      console.error('AgoraRTC client error:', err);
      setError(err.message || String(err));
    });
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
      // DEBUG: inspect Agora credentials
      console.log('AgoraMeeting.joinChannel => appId:', appId, 'channel:', channel, 'token length:', token?.length);
      if (!appId) {
        setError('Missing Agora App ID (empty string).');
        return;
      }
      let microphoneTrack: IMicrophoneAudioTrack;
      let cameraTrack: ICameraVideoTrack;
      // Request media tracks first to trigger permissions prompt
      try {
        // Suppress permission-denied logging while requesting media
        const originalConsoleError = console.error;
        console.error = (...args: any[]) => {
          if (args[0]?.toString().includes('Permission denied')) return;
          originalConsoleError(...args);
        };
        [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        // Restore console.error
        console.error = originalConsoleError;
      } catch (trackError: any) {
        // Restore console.error if error occurred
        try { console.error = originalConsoleError; } catch {}
        console.warn('Track creation canceled or failed before join:', trackError);
        return; // Abort if user cancels permissions
      }

      try {
        // Join the channel with the UID matching the token (default 0)
        await client.join(appId, channel, token, 0);
      } catch (joinError: any) {
        console.error('Error joining channel with App ID', appId, 'UID 0', joinError);
        setError(joinError.message || 'Failed to join meeting. Check your Agora App ID and token UID.');
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

      // store tracks and mark joined
      localTracksRef.current = [microphoneTrack, cameraTrack];
      // setup chat data stream if supported
      if (typeof (client as any).createDataStream === 'function') {
        try {
          chatDataId = await (client as any).createDataStream({ ordered: true, reliable: true }) as number;
          setChatStreamId(chatDataId);
        } catch (e: any) { // typed as any
          console.error('Failed to create chat data stream', e);
        }
      } else {
        console.warn('createDataStream not available on AgoraRTCClient, chat disabled');
      }
      setJoined(true);
    };
    joinChannel();

    // Listen to network state changes
    const onConnectionStateChange = (cur: string) => {
      // Update connection state
      if (cur === 'DISCONNECTED') {
        setConnectionState('DISCONNECTED');
      } else if (cur === 'RECONNECTING') {
        setConnectionState('RECONNECTING');
      } else if (cur === 'CONNECTED') {
        setConnectionState('CONNECTED');
        setError(null);
      }
    };
    client.on('connection-state-change', onConnectionStateChange);
    
    // Enable audio volume indicator
    (client as any).enableAudioVolumeIndicator();
    const onVolumeIndicator = (volumesArray: any[]) => {
      volumesArray.forEach(({ uid, level }) => {
        setVolumes(prev => ({ ...prev, [uid]: level }));
      });
    };
    client.on('volume-indicator', onVolumeIndicator);

    // Network quality indicator removed (not supported in SDK NG typings)

    // Clean up on unmount
    return () => {
      client.off('user-published', onUserPublished);
      client.off('user-unpublished', onUserUnpublished);
      client.off('user-left', onUserLeft);
      client.off('connection-state-change', onConnectionStateChange);
      (client as any).off('volume-indicator', onVolumeIndicator);
      const tracks = localTracksRef.current;
      if (tracks) {
        tracks[0].close();
        tracks[1].close();
      }
      if (chatDataId !== null && typeof (client as any).destroyDataStream === 'function') {
        (client as any).destroyDataStream(chatDataId);
      }
      // cleanup screen share
      if (screenTrackRef.current) {
        client.unpublish(screenTrackRef.current);
        try { screenTrackRef.current.close(); } catch {};
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

  const toggleVideo = async () => {
    const client = clientRef.current;
    const tracks = localTracksRef.current;
    if (!client || !tracks) return;
    const [audioTrack, cameraTrack] = tracks;
    if (videoEnabled) {
      // Disable video: unpublish and stop camera track
      try {
        await client.unpublish(cameraTrack);
        cameraTrack.stop();
        cameraTrack.close();
      } catch (e) {
        console.warn('Error disabling video track', e);
      }
      setVideoEnabled(false);
    } else {
      // Enable video: recreate and publish camera track
      try {
        const newCameraTrack = await AgoraRTC.createCameraVideoTrack();
        localTracksRef.current = [audioTrack, newCameraTrack];
        await client.publish(newCameraTrack);
        setVideoEnabled(true);
      } catch (e: any) {
        console.error('Error enabling video track', e);
        setError(e.message || 'Failed to enable video');
      }
    }
  };

  const toggleVirtualBg = () => {
    setVirtualBg(prev => !prev);
    // TODO: load and apply BodyPix segmentation for true background replacement
  };

  const toggleScreenShare = async () => {
    const client = clientRef.current;
    if (!client) return;
    if (!screenSharing) {
      setScreenShareError(null);
      // Stop and close camera track before screen share
      const tracks = localTracksRef.current;
      if (tracks && tracks[1]) {
        try {
          await client.unpublish(tracks[1]);
          tracks[1].stop();
          tracks[1].close();
        } catch (e) {
          console.warn('Error closing camera for screen share', e);
        }
      }
      try {
        const screenTrack = await AgoraRTC.createScreenVideoTrack({ encoderConfig: '1080p_1' });
        screenTrackRef.current = screenTrack;
        await client.publish(screenTrack);
        setScreenSharing(true);
      } catch (err: any) {
        console.error('Screen share failed', err);
        if (err.name === 'NotAllowedError' || err.code === 'PERMISSION_DENIED') {
          setScreenShareError('Screen share permission denied. Please allow screen sharing.');
        } else {
          setScreenShareError('Screen share failed: ' + (err.message || 'Unknown error'));
        }
      }
    } else {
      // Stop screen share
      if (screenTrackRef.current) {
        try {
          await client.unpublish(screenTrackRef.current);
          screenTrackRef.current.stop();
          screenTrackRef.current.close();
        } catch (e: any) {
          console.warn('Error stopping screen share', e);
        }
        screenTrackRef.current = null;
      }
      // Recreate and publish camera track after screen share
      const audioTrack = localTracksRef.current ? localTracksRef.current[0] : null;
      try {
        const newCameraTrack = await AgoraRTC.createCameraVideoTrack();
        localTracksRef.current = audioTrack ? [audioTrack, newCameraTrack] : [null as any, newCameraTrack];
        await client.publish(newCameraTrack);
        setVideoEnabled(true);
      } catch (e: any) {
        console.error('Failed to reinitialize camera after screen share', e);
        setScreenShareError('Could not restore camera: ' + (e.message || e));
      }
      setScreenSharing(false);
    }
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

  const toggleDeviceTest = () => {
    setShowDeviceTest(prev => !prev);
  };

  const toggleParticipants = () => setShowParticipants(prev => !prev);

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

  return (
    <>
      {/* Top header bar */}
      <div className="fixed top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center px-4 py-2 z-40">
        <span className="text-lg font-semibold">{channel}</span>
        <div className="flex items-center space-x-4">
          <button onClick={toggleParticipants} title="Participants" className="flex items-center space-x-1 hover:text-gray-300">
            <FaUsers />
            <span>{remoteUsers.length + 1}</span>
          </button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} title="Copy Meeting Link" className="hover:text-gray-300">
            Copy Link
          </button>
        </div>
      </div>
      {/* Main meeting container with top padding for header */}
      <div className="pt-12 rounded-lg overflow-visible border border-gray-200 bg-gray-100">
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

        {/* Connection State Banner */}
        {joined && connectionState !== 'CONNECTED' && (
          <div className={
            connectionState === 'DISCONNECTED'
              ? 'bg-red-100 text-red-800 p-2 text-center'
              : 'bg-yellow-100 text-yellow-800 p-2 text-center'
          }>
            {connectionState === 'RECONNECTING' ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Reconnecting...
              </span>
            ) : (
              <span>
                Connection lost. <button onClick={() => window.location.reload()} className="underline">Reconnect</button>
              </span>
            )}
          </div>
        )}

        {/* Screen share error banner */}
        {screenShareError && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 p-2 rounded z-50">
            {screenShareError}
          </div>
        )}

        {/* Floating Controls */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-md p-4 rounded-full flex space-x-6 z-50 animate-fade-in">
          {/* Mic level indicator */}
          <motion.button
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute' : 'Unmute'}
            className="text-white p-2 rounded hover:bg-gray-700"
            style={{ boxShadow: audioEnabled ? `0 0 ${glowRadius}px rgba(74,222,128, 0.8)` : undefined }}
            disabled={connectionState !== 'CONNECTED'}
            whileTap={{ scale: 0.9 }}
          >
            {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </motion.button>
          <button onClick={toggleVideo} title={videoEnabled ? 'Hide Video' : 'Show Video'} className="text-white p-2 rounded hover:bg-gray-700" disabled={connectionState !== 'CONNECTED'}>
            {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button onClick={toggleDeviceTest} title="Test Camera & Mic" className="text-white p-2 rounded hover:bg-gray-700" disabled={connectionState !== 'CONNECTED'}>
            <FaTools />
          </button>
          <motion.button onClick={toggleScreenShare} title={screenSharing ? 'Stop Sharing' : 'Share Screen'} className="text-white p-2 rounded hover:bg-gray-700" disabled={connectionState !== 'CONNECTED'} whileTap={{ scale: 0.9 }}>
            <FaDesktop />
          </motion.button>
          <motion.button onClick={() => setShowChat(prev => !prev)} title="Toggle Chat" className="text-white p-2 rounded hover:bg-gray-700" disabled={connectionState !== 'CONNECTED'} whileTap={{ scale: 0.9 }}>
            <FaCommentDots />
          </motion.button>
          <motion.button onClick={toggleParticipants} title="Participants" className="text-white p-2 rounded hover:bg-gray-700" whileTap={{ scale: 0.9 }}>
            <FaUsers />
          </motion.button>
          <button onClick={leaveCall} title="End Call" className="text-red-500 p-2 rounded hover:bg-red-700 bg-white">
            <FaPhoneSlash />
          </button>
        </div>
        {showDeviceTest && <MediaTest onClose={toggleDeviceTest} />}

        {/* Video Grid */}
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
                   {/* Volume meter for local user */}
                   <motion.div
                     className="absolute top-2 left-2 w-16 h-2 bg-gray-700 rounded overflow-hidden"
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                   >
                     <div
                       className="h-full bg-green-400"
                       style={{ width: `${Math.min(localVolumeLevel * 100, 100)}%` }}
                     />
                   </motion.div>
                   {/* Network quality badge removed */}
                 </>
               );
             })()}
            </div>

            {/* Remote users video */}
            {remoteUsers.map(user => (
             <motion.div
               key={user.uid}
               role="button"
               tabIndex={0}
               aria-label={`Full screen video for user ${user.uid}`}
               className="relative rounded-lg overflow-hidden aspect-video bg-black cursor-pointer transform hover:scale-105 transition-transform duration-200"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               layout
               onClick={() => setFullScreenUser(user)}
             >
              <RemoteVideoView user={user} />
               <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                 {userName || `User ${user.uid}`}
               </div>
               {/* Volume meter */}
               <div className="absolute top-2 left-2 w-12 h-1 bg-gray-700 rounded overflow-hidden">
                 <div
                   className="h-full bg-green-400"
                   style={{ width: `${Math.min((volumes[user.uid?.toString()] || 0) * 100, 100)}%` }}
                 />
               </div>
               {/* Network quality badge removed */}
             </motion.div>
           ))}
          </motion.div>
        </AnimatePresence>

        {/* Chat Panel (hidden by default) */}
        {showChat && clientRef.current && (
          <ChatPanel
            client={clientRef.current}
            streamId={chatStreamId}
            userName={userName}
            channel={channel}
            participantsCount={remoteUsers.length + 1}
            onToggleParticipants={toggleParticipants}
            onClose={() => setShowChat(false)}
          />
        )}
        {/* Participants Panel */}
        {showParticipants && (
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Participants ({remoteUsers.length + 1})</h3>
              <button onClick={toggleParticipants} className="text-gray-600 hover:text-gray-800">✕</button>
            </div>
            <ul className="flex-1 overflow-auto">
              {/* Local user */}
              <li className="flex items-center mb-2">
                <FaMicrophoneSlash className="mr-2 text-green-500" />
                <span>You</span>
              </li>
              {/* Remote users */}
              {remoteUsers.map(user => (
                <li key={user.uid} className="flex items-center mb-2">
                  {volumes[user.uid]?.toString() && volumes[user.uid]! > 0 ? (
                    <FaMicrophone className="mr-2 text-green-500" />
                  ) : (
                    <FaMicrophoneSlash className="mr-2 text-red-400" />
                  )}
                  <span>User {user.uid}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
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
