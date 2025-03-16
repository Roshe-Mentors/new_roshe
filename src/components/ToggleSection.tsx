"use client";
import Link from 'next/link';
import React, { useState } from "react";
import Image from 'next/image';

const ToggleSection: React.FC = () => {
  const [selectedView, setSelectedView] = useState<"mentor" | "mentee">("mentor");

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-0">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-12 space-x-4">
          <button
            onClick={() => setSelectedView("mentee")}
            className={`text-base md:text-lg font-semibold px-3 md:px-4 py-2 ${
              selectedView === "mentee"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            } transition`}
          >
            Mentee
          </button>
          <button
            onClick={() => setSelectedView("mentor")}
            className={`text-base md:text-lg font-semibold px-3 md:px-4 py-2 ${
              selectedView === "mentor"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            } transition`}
          >
            Mentor
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0">
          {/* Left Image Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto mb-8 lg:mb-0 lg:mr-8">
            <Image
              src="/images/1.png"
              alt="Profile 1"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/2.png"
              alt="Profile 2"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/3.png"
              alt="Profile 3"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/4.png"
              alt="Profile 4"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/5.png"
              alt="Profile 5"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/6.png"
              alt="Profile 6"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
          </div>

          {/* Middle Section: Dynamic Content */}
          <div className="text-center lg:mx-12 lg:flex-1 transition-all duration-300 mb-12 lg:mb-0">
            {selectedView === "mentor" ? (
              <>
                <h2 className="text-6xl md:text-5xl text-black font-extrabold mb-6 mt-12 md:mb-8">
                  Change the world through mentorship
                </h2>
                <p className="text-gray-800 mb-8 md:mb-10 text-lg md:text-xl px-4 md:px-0">
                  Enhance your leadership confidence, expand your <br/>connections,
                  and shape your lasting impact.
                </p>
                <button className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-gray-800 to-gray-500 text-white rounded-md hover:opacity-90 transition text-lg mb-8 md:mb-0">
                  <Link href="/signup/mentor" legacyBehavior>
                    <a>Become a Mentor</a>
                  </Link>
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl text-black font-bold mb-6 md:mb-8">
                  Get mentored by industry professionals
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-lg md:text-xl px-4 md:px-0">
                  Fast-track your career with personalized 1:1 guidance from
                  over 1000 expert mentors in our community.
                </p>
                <div className="relative px-4 md:px-0">
                  <input
                    type="text"
                    placeholder="What skill do you want to improve?"
                    className="w-full px-4 md:px-6 py-3 md:py-4 border border-gray-300 rounded-md shadow-sm text-base md:text-lg"
                  />
                </div>
              </>
            )}
          </div>

          {/* Right Image Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto">
            <Image
              src="/images/7.png"
              alt="Profile 5"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/8.png"
              alt="Profile 6"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/9.png"
              alt="Profile 7"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/10.png"
              alt="Profile 8"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/11.png"
              alt="Profile 9"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/12.png"
              alt="Profile 10"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/logo4.jpg"
              alt="Logo 4"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToggleSection;
