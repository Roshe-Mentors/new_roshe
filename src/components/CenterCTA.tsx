"use client"
import React, { useState } from 'react';

const CenterCTA = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
      // Add your form submission logic here
      console.log('Email submitted:', email);
    }
  };

  return (
    <section className="w-full relative flex justify-center items-center py-16 px-4 overflow-hidden">
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)),
            url("/images/Community_image.jpg")
          `,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />

      <div className="w-full max-w-3xl text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Get Started for Free <span className="block md:inline">Under 1 Minute</span>
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
          Our goal is to help you craft an extraordinary career with the guidance of expert mentors.
Whether you&apos;re starting out or stepping into leadership, we&apos;re here to support you.
        </p>

        <form 
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-stretch justify-center gap-3 max-w-md mx-auto md:max-w-2xl"
          noValidate
        >
          <div className="relative flex-grow">
            <label htmlFor="email-input" className="sr-only">Email address</label>
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email"
              className={`w-full pl-10 pr-4 py-3 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-lg md:rounded-r-none outline-none focus:ring-2 ${
                error ? 'focus:ring-red-300' : 'focus:ring-indigo-300'
              } transition-all`}
              aria-invalid={!!error ? 'true' : 'false'}
              aria-describedby="error-message"
            />
          </div>

          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg md:rounded-l-none font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors"
          >
            Get Started Free
          </button>
        </form>

        {error && (
          <div 
            id="error-message"
            className="mt-3 flex items-center justify-center gap-2 text-red-600"
            role="alert"
            aria-live="polite"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CenterCTA;