"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          
            <Image 
              src="/images/roshementorship.png"
              alt="Roshe Mentorship Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold font-montserrat text-gray-800">
              Roshe Mentorship
            </span>
        
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link legacyBehavior href="/login">
            <a className="px-3 py-2 border text-gray-800 border-gray-800 rounded hover:bg-gray-100 transition">
              Log in
            </a>
          </Link>
          <Link legacyBehavior href="/signup">
            <a
              className="px-4 py-2 rounded bg-gradient-to-r from-gray-800 to-gray-500 text-white hover:opacity-90 transition"
              style={{
                background:
                  "linear-gradient(90.15deg, #24242E 0.13%, #747494 99.87%)",
              }}
            >
              Get Started
            </a>
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button
          aria-label="Toggle navigation menu"
          className="md:hidden flex items-center px-3 py-2 border rounded text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link legacyBehavior href="/login">
            <a className="block px-4 py-2 border-b hover:bg-gray-100">Log in</a>
          </Link>
          <Link legacyBehavior href="/signup">
            <a className="block px-4 py-2 hover:bg-gray-100">Get Started</a>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
