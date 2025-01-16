"use client";

import React, { useState } from "react";

const ToggleSection: React.FC = () => {
  const [selectedView, setSelectedView] = useState<"mentor" | "mentee">("mentor");

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setSelectedView("mentee")}
            className={`text-lg font-semibold px-4 py-2 ${
              selectedView === "mentee"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            } transition`}
          >
            Mentee
          </button>
          <button
            onClick={() => setSelectedView("mentor")}
            className={`text-lg font-semibold px-4 py-2 ${
              selectedView === "mentor"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            } transition`}
          >
            Mentor
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          {/* Left Image Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 lg:mb-0 lg:mr-8">
            <img
              src="/profile1.jpg"
              alt="Profile 1"
              className="w-24 h-24 rounded-md object-cover"
            />
            <img
              src="/profile2.jpg"
              alt="Profile 2"
              className="w-24 h-24 rounded-md object-cover"
            />
            <img
              src="/profile3.jpg"
              alt="Profile 3"
              className="w-24 h-24 rounded-md object-cover"
            />
            <img
              src="/profile4.jpg"
              alt="Profile 4"
              className="w-24 h-24 rounded-md object-cover"
            />
          </div>

          {/* Middle Section: Dynamic Content */}
          <div className="text-center lg:mx-8 lg:flex-1 transition-all duration-300">
            {selectedView === "mentor" ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Change the world through mentorship
                </h2>
                <p className="text-gray-600 mb-6">
                  Enhance your leadership confidence, expand your connections,
                  and shape your lasting impact.
                </p>
                <button
                  onClick={() => (window.location.href = "/signup")}
                  className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-500 text-white rounded-md hover:opacity-90 transition"
                >
                  Become a Mentor
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Get mentored by industry professionals
                </h2>
                <p className="text-gray-600 mb-6">
                  Fast-track your career with personalized 1:1 guidance from
                  over 1000 expert mentors in our community.
                </p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="What skill do you want to improve?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                  />
                  <button className="absolute right-2 top-2">
                    <span className="material-icons">search</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Image Grid */}
          <div className="grid grid-cols-2 gap-4 lg:ml-8">
            <img
              src="/profile5.jpg"
              alt="Profile 5"
              className="w-24 h-24 rounded-md object-cover"
            />
            <img
              src="/profile6.jpg"
              alt="Profile 6"
              className="w-24 h-24 rounded-md object-cover"
            />
            <img
              src="/profile7.jpg"
              alt="Profile 7"
              className="w-24 h-24 rounded-md object-cover"
            />
            <img
              src="/profile8.jpg"
              alt="Profile 8"
              className="w-24 h-24 rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToggleSection;
