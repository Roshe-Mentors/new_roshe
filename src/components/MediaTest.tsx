import React, { useRef, useEffect } from 'react';
import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

interface MediaTestProps {
  onClose: () => void;
}

const MediaTest: React.FC<MediaTestProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const audioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // start camera and mic tracks
    let audioContext: AudioContext;
    (async () => {
      const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      videoTrackRef.current = camTrack;
      audioTrackRef.current = micTrack;

      // play video preview
      camTrack.play(videoRef.current!);

      // setup audio meter
      const stream = micTrack.getMediaStreamTrack();
      audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(new MediaStream([stream]));
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const draw = () => {
        analyser.getByteFrequencyData(data);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const height = canvas.height;
            const width = canvas.width;
            ctx.clearRect(0, 0, width, height);
            const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
            const bar = (avg / 255) * height;
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(0, height - bar, width, bar);
          }
        }
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    })();

    return () => {
      // cleanup
      videoTrackRef.current?.stop();
      audioTrackRef.current?.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      analyserRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-4 z-50">
      <h2 className="text-white mb-2">Device Test</h2>
      <div className="bg-gray-800 p-2 rounded mb-4 w-full max-w-md">
        <div className="bg-black h-48 mb-2" ref={videoRef}></div>
        <canvas ref={canvasRef} width={300} height={50} className="w-full bg-gray-700"></canvas>
      </div>
      <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Close Test</button>
    </div>
  );
};

export default MediaTest;
