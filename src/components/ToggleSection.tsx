"use client";
import Link from 'next/link';
import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';

type MenuItems = {
  [key: string]: string[];
};

const menuItems: MenuItems = {
  "Design": ["Graphic Design", "Motion Design", "3D Design", "Product Design", "Multimedia", "Interaction Design", "Game Design"],
  "3D Character Animation": [],
  "2D Character Animation": [],
  "3D Rigging": [],
  "Concept Art": ["Character Design", "Environment Design", "Prop Design", "Digital Matte Painting", "Background Painting", "Color Script", "Painting"],
  "Storyboard & Animatics": [],
  "Game Animation": [],
  "Texturing and Lookdev": [],
  "Lighting": [],
  "Visual Effect (Vfx)": [],
  "Character Effect (Cfx)": ["Cloth Simulation", "Hair Simulation", "Crowd Simulation"],
  "Modeling & Sculpting": ["Character Modeling", "Environment Modeling", "Prop Modeling", "Sculpting"],
  "Film Making": ["Acting", "Film Directing", "Film Distribution", "Cinematography", "Photography", "Production Design", "Hair & Makeup", "Film Editing"]
};

const ToggleSection: React.FC = () => {
  const [selectedView, setSelectedView] = useState<"mentor" | "mentee">("mentor");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSkillSelect = (skill: string, subskill?: string) => {
    setSelectedSkill(subskill || skill);
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const handleParentClick = (skill: string, subskills: string[]) => {
    // If there are no subskills, immediately select
    if (subskills.length === 0) {
      handleSkillSelect(skill);
    } else if (isMobile) {
      // Toggle sub-menu only on mobile devices
      setActiveSubmenu(activeSubmenu === skill ? null : skill);
    }
  };

  const handleMenuHover = (skill: string, subskills: string[]) => {
    // Only change submenu on hover if not on mobile and if there are subskills
    if (!isMobile && subskills.length > 0) {
      setActiveSubmenu(skill);
    }
  };

  const handleMenuLeave = () => {
    // On non-mobile, clear active submenu when mouse leaves
    if (!isMobile) {
      setActiveSubmenu(null);
    }
  };

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
          <div className="hidden lg:grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto mb-8 lg:mb-0 lg:mr-8">
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
                <div className="relative px-4 md:px-0" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 md:px-6 py-3 md:py-4 border text-black border-gray-300 rounded-md shadow-sm text-base md:text-lg text-left bg-white"
                  >
                    {selectedSkill || "What skill do you want to improve?"}
                  </button>
                  
                  {isOpen && (
                    <div
                      className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg mt-1 overflow-hidden"
                      style={{ width: '100%', maxWidth: '500px' }}
                      onMouseLeave={handleMenuLeave}
                    >
                      <div className="flex h-96">
                        {/* Main menu column - Always visible */}
                        <div className={`${activeSubmenu ? 'w-1/2' : 'w-full'} border-r border-gray-300 overflow-y-auto transition-all duration-200 scrollbar-hide`}>
                          {Object.entries(menuItems).map(([skill, subskills]) => (
                            <div
                              key={skill}
                              className="relative"
                              onMouseEnter={() => handleMenuHover(skill, subskills)}
                            >
                              <button
                                className={`w-full px-4 py-3 text-left hover:bg-gray-100 flex justify-between items-center text-black ${
                                  activeSubmenu === skill ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => handleParentClick(skill, subskills)}
                              >
                                <span>{skill}</span>
                                {subskills.length > 0 && (
                                  <span className="ml-2 text-gray-500">›</span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Submenu column - Only visible when a submenu is active */}
                        {activeSubmenu && (
                          <div className="w-1/2 overflow-y-auto bg-gray-50 transition-all duration-200 scrollbar-hide">
                            {menuItems[activeSubmenu]?.length > 0 ? (
                              menuItems[activeSubmenu].map((subskill) => (
                                <button
                                  key={subskill}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-100 text-black"
                                  onClick={() => handleSkillSelect(activeSubmenu, subskill)}
                                >
                                  {subskill}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500">
                                No subskills available
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Image Grid */}
          <div className="hidden lg:grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto">
            <Image
              src="/images/7.png"
              alt="Profile 7"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/8.png"
              alt="Profile 8"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/9.png"
              alt="Profile 9"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/10.png"
              alt="Profile 10"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/11.png"
              alt="Profile 11"
              width={120}
              height={150}
              className="rounded-md object-cover w-32 h-[200px]"
            />
            <Image
              src="/images/12.png"
              alt="Profile 12"
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