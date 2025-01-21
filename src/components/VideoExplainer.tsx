import React from 'react';

const VideoExplainer = () => {
  return (
    <div className="video-explainer-container bg-gray-200 mx-auto my-8 p-4 relative">
      <h1 className="text-3xl font-bold text-center mb-4">
        Unlock your potential
      </h1>
      <p className="text-xl text-center mb-8">
        Become the best version of yourself by accessing the perspectives and industry experiences of others who&apos;ve been there, done that.
      </p>
      <div className="video-responsive relative">
        <iframe
          width="800" // Adjusted width
          height="450" // Adjusted height
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID?modestbranding=1&autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=YOUR_VIDEO_ID" // Replace 'YOUR_VIDEO_ID' with the actual YouTube video ID
          title="Explainer Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-2xl font-bold">
          Explainer Video
        </div>
      </div>
    </div>
  );
};

export default VideoExplainer;
