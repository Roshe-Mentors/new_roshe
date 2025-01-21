// components/ExplainerVideo.tsx
import React from 'react';

const ExplainerVideo = () => {
  return (
    <section className="w-full py-10 bg-white flex flex-col items-center">
      <header className="text-center mb-6">
        <h1 className="text-4xl text-black font-bold">Unlock your potential</h1>
        <p className="text-lg text-black mt-4">
          Become the best version of yourself by accessing the perspectives and industry experiences of others who've been there, done that.
        </p>
      </header>
      <div className="w-full flex justify-center">
        <div className="w-full sm:w-1/3">
          <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center text-xl text-gray-700 rounded-lg shadow-lg">
            {/* Placeholder for Explainer Video */}
            <span>Explainer Video</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainerVideo;
