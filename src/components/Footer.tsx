"use client";
import React from "react";
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
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <Link legacyBehavior href="/">
              <a className="flex items-center space-x-2 justify-center md:justify-start">
                <div className="w-10 h-10 bg-gray-300 rounded-full" /> {/* Logo Placeholder */}
                <span className="text-xl font-bold">Roshe Mentorship</span>
              </a>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              To inspire powerful conversation and collaborations among members
              worldwide so together we can change the world with creativity.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center md:text-left">
            <ul className="flex flex-wrap justify-center md:justify-start space-x-6 space-y-2 md:space-y-0">
              <li>
                <Link legacyBehavior href="/mentors">
                  <a className="hover:text-gray-800 transition text-gray-600">
                    find mentors
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/become-a-mentor">
                  <a className="hover:text-gray-800 transition text-gray-600">
                    become a mentor
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/community">
                  <a className="hover:text-gray-800 transition text-gray-600">
                    community
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/blog">
                  <a className="hover:text-gray-800 transition text-gray-600">
                    blog
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end space-x-4">
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
            <ul className="flex justify-center md:justify-end mt-4 space-x-6">
              <li>
                <Link href="/join">
                  <a className="hover:text-gray-800 transition text-gray-600">
                    join roshe mentorship
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/faqs">
                  <a className="hover:text-gray-800 transition text-gray-600">
                    FAQs
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/partnerships">
                  <a className="hover:text-gray-800 transition text-gray-600">
                    partnerships
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © Roshe Mentorship, all rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
