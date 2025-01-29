// components/CenterCTA.tsx
import React, { useState } from 'react';

const CenterCTA = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Minimal email validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
      // You can handle form submission here if needed
    }
  };

  return (
    <section
      className="w-full flex justify-center items-center py-10 px-4"
      style={{
        // The JPEG with all circular portraits
        // repeated vertically, covering full width
        backgroundImage: "url('/images/bg-portraits.jpg')",
        backgroundRepeat: 'repeat-y',
        backgroundPosition: 'center',
        // If you want to ensure the image doesn't stretch:
        // backgroundSize: 'auto',
      }}
    >
      {/* The container for heading, subtext, and form */}
      <div className="w-full max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Get started for free <br className="md:hidden" />
          under 1 minute
        </h2>
        <p className="text-gray-700 mb-6">
          Our goal is to help you craft an extraordinary career with the guidance of expert mentors.
          Whether you’re starting out or stepping into leadership, we’re here to support you.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-stretch justify-center gap-2 md:gap-0"
        >
          {/* Email Input (with icon) */}
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              {/* Envelope Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 
                     8H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 
                     2v8a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md md:rounded-r-none outline-none 
                         focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md md:rounded-l-none 
                       border border-black hover:cursor-pointer"
          >
            Join now for free
          </button>
        </form>

        {/* Error Text (if any) */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </section>
  );
};

export default CenterCTA;
