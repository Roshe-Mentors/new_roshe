// components/ExplainerVideo.tsx
import React from 'react';

const ExplainerVideo = () => {
  return (
    <section className="w-full py-10 bg-white flex flex-col items-center">
      <header className="text-center mb-6">
        <h1 className="text-4xl text-black font-bold">Unlock your potential</h1>
        <p className="text-lg text-black mt-4">
          Become the best version of yourself by accessing the perspectives and industry<br/> experiences of others who&apos;ve been there, done that.
        </p>
      </header>
      <div className="w-full flex justify-center">
        <div className="w-full sm:w-2/3">
          <video 
            className="w-full rounded-lg shadow-lg"
            controls
            autoPlay
            muted
            loop
          >
            <source src="/images/RosheMentorship.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default ExplainerVideo;
