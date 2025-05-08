// components/ExplainerVideo.tsx
import React from 'react';

const ExplainerVideo = () => {
  return (
    <section className="w-full py-16 bg-white flex flex-col items-center animate-fade-slide">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl text-black font-bold animate-zoom-in">
          Unlock your potential
        </h1>
        <p className="text-lg text-black mt-4 animate-fade-in">
          Become the best version of yourself by accessing the perspectives and industry<br />
          experiences of others who&apos;ve been there, done that.
        </p>
      </header>

      {/* Video */}
      <div className="w-full flex justify-center">
        <div className="w-full sm:w-3/4 lg:w-2/3 relative group rounded-xl overflow-hidden">
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-xl p-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-spin z-0"></div>

          {/* Video inside the border */}
          <div className="relative rounded-xl overflow-hidden z-10 bg-white">
            <video
              className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 ease-in-out"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/images/RosheMentorship.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainerVideo;