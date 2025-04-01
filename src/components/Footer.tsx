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
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-6">
        {/* Top Section: Logo, Mission Statement, and Links */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
          {/* Left Section: Logo and Mission Statement */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:w-2/3">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/roshementorship.png"
                alt="Roshe Mentorship Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-montserrat text-black font-bold">Roshe Mentorship</span>
            </Link>
            <p className="text-center md:text-left text-sm text-black">
              To inspire powerful conversation and collaborations among members <br />worldwide so together we can change the world with creativity.
            </p>
          </div>

          {/* Right Section: Social Media Icons */}
          <div className="flex flex-col items-center md:items-end space-y-4 md:space-y-6">
            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-end space-x-6">
              <a
                href="https://www.linkedin.com/company/roshe-mentorship/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black transition font-bold"
                title="Visit Roshe Mentorship on LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a
                href="https://www.instagram.com/roshe_mentorship/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black transition font-bold"
                title="Follow Roshe Mentorship on Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://x.com/roshementorship?s=21&t=TN5-Nr3z-NoaUxp_TbMOVA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black transition font-bold"
                title="Follow Roshe Mentorship on Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/1BCqU9R9Pc/?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black transition font-bold"
                title="Follow Roshe Mentorship on Facebook"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.youtube.com/@RosheMentorship"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black transition font-bold"
                title="Subscribe to Roshe Mentorship on YouTube"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@roshementorship?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black transition font-bold"
                title="Follow Roshe Mentorship on TikTok"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Navigation Links - Split into two groups */}
        <div className="mt-8 flex flex-col md:flex-row justify-between">
          {/* Left Side Navigation Links */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <ul className="flex flex-wrap justify-center md:justify-start space-x-6 text-black text-sm">
              <li>
                <Link href="/mentors" className="hover:text-black transition font-bold">
                  find mentors
                </Link>
              </li>
              <li>
                <Link href="/become-a-mentor" className="hover:text-black transition font-bold">
                  become a mentor
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-black transition font-bold">
                  community
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-black transition font-bold">
                  blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Side Navigation Links */}
          <div className="text-center md:text-right">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-6 text-black text-sm">
              <li>
                <Link href="/join" className="hover:text-black transition font-bold">
                  join roshe mentorship
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-black transition font-bold">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-black transition font-bold">
                  partnerships
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="text-sm text-black mt-6 text-center md:text-left">
          © Roshe Mentorship, all rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
