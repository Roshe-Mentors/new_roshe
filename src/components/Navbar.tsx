"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signIn");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/images/roshementorship.png"
              alt="Roshe Mentorship Logo"
              width={35}
              height={35}
              className="rounded-full"
            />
            <span className="text-xl font-bold font-montserrat text-gray-800">
              Roshe Mentorship
            </span>
          </Link>
        </motion.div>

        {/* Desktop Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex space-x-6"
        >
          {!loading && user ? (
            <>
              {/* Logout button removed from here */}
            </>
          ) : (
            <>
              <Link legacyBehavior href="/signIn">
                <motion.a
                  whileHover={{
                    y: [-4, 4, -4],
                    transition: { repeat: Infinity, duration: 0.5 },
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-gray-800 rounded hover:bg-gray-100 transition"
                  style={{
                    borderColor: "#9898FA", 
                    borderWidth: "2px",      
                    borderStyle: "solid",   
                  }}
                >
                  Log in
                </motion.a>
              </Link>
              <Link legacyBehavior href="/user">
                <motion.a
                  whileHover={{
                    y: [-4, 4, -4],
                    transition: { repeat: Infinity, duration: 0.5 },
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-[#9898FA] text-white hover:opacity-90 transition"
                >
                  Get Started
                </motion.a>
              </Link>
            </>
          )}
        </motion.div>

        {/* Hamburger Menu */}
        <button
          aria-label="Toggle navigation menu"
          className="md:hidden flex items-center px-3 py-2 border rounded text-black"
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
              d={
                isMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-md"
        >
          {!loading && user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-black px-4 py-3 text-center hover:bg-gray-100"
            >
              Log out
            </button>
          ) : (
            <>
              <Link legacyBehavior href="/signIn">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-black px-4 py-3 text-center border-b hover:bg-gray-100"
                >
                  Log in
                </a>
              </Link>
              <Link legacyBehavior href="/user">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-black px-4 py-3 text-center hover:bg-gray-100"
                >
                  Get Started
                </a>
              </Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;