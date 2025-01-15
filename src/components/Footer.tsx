"use client";
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          {/* Left Section: Logo and Mission Statement */}
          <div className="md:w-1/3">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/images/roshementorship.png"
                alt="Roshe Mentorship Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-montserrat text-gray-800 font-bold">Roshe Mentorship</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              To inspire powerful conversation and collaborations among members
              worldwide so together we can change the world with creativity.
            </p>
          </div>

          {/* Right Section: Social Media Icons and Additional Links */}
          <div className="md:w-1/3 md:text-right">
            <div className="flex justify-center md:justify-end space-x-4 mb-4">
              <a
                href="https://www.linkedin.com/company/roshe-mentorship/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition"
                title="Visit Roshe Mentorship on LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a
                href="https://www.instagram.com/roshe_mentorship/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition"
                title="Follow Roshe Mentorship on Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://x.com/roshementorship?s=21&t=TN5-Nr3z-NoaUxp_TbMOVA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition"
                title="Follow Roshe Mentorship on Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/1BCqU9R9Pc/?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition"
                title="Follow Roshe Mentorship on Facebook"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.youtube.com/@RosheMentorship"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition"
                title="Subscribe to Roshe Mentorship on YouTube"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@roshementorship?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition"
                title="Follow Roshe Mentorship on TikTok"
              >
                <FaTiktok size={20} />
              </a>
            </div>
            <ul className="flex justify-center md:justify-end space-x-6 text-gray-600 text-sm">
              <li>
                <Link href="/join" className="hover:text-gray-800 transition">
                  join roshe mentorship
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-gray-800 transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-gray-800 transition">
                  partnerships
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="mt-8 text-center md:text-left md:flex md:justify-between">
          <ul className="flex flex-wrap justify-center md:justify-start space-x-6 text-gray-600 text-sm">
            <li>
              <Link href="/mentors" className="hover:text-gray-800 transition">
                find mentors
              </Link>
            </li>
            <li>
              <Link href="/become-a-mentor" className="hover:text-gray-800 transition">
                become a mentor
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-gray-800 transition">
                community
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-800 transition">
                blog
              </Link>
            </li>
          </ul>
          <div className="text-center md:text-right text-sm text-gray-500 mt-6 md:mt-0">
            © Roshe Mentorship, all rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
