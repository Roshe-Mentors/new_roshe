// app/dashboard/components/MentorDashboard.tsx
"use client"
import Image from 'next/image';
import React, { useEffect, useState, Suspense } from 'react';
import { FiSearch, FiHome, FiCompass, FiUsers, FiCalendar, FiMessageCircle, FiAward, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { BsLightning, BsPersonFill, BsLinkedin, BsGlobe } from 'react-icons/bs';
import { useRouter, useSearchParams } from 'next/navigation';
import { mentorsData } from '../data/mentors';

// Types
interface Mentor {
  id: string;
  name: string;
  location: string;
  role: string;
  company: string;
  sessions: number;
  reviews: number;
  experience: number;
  attendance: number;
  isAvailableASAP: boolean;
  providesCoaching: boolean;
  imageUrl: string;
  isTopRated: boolean;
}

interface MentorDashboardProps {
  mentors: Mentor[];
}

// Main Dashboard Component
const MentorDashboard: React.FC<MentorDashboardProps> = ({ mentors }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeView, setActiveView] = useState<'mentors' | 'groupMentorship'>('mentors');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'explore' | 'community' | 'calendar' | 'chat' | 'achievement'>('explore');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  // Use this to get the selected mentor from mentorsData
  const selectedMentor = selectedMentorId
    ? mentorsData.find(mentor => mentor.id === selectedMentorId) || mentorsData[0]
    : mentorsData[0];

  // Make sure we have a selected mentor when viewing booking page
  useEffect(() => {
    if (activeNavItem === 'calendar' && !selectedMentorId && mentorsData.length > 0) {
      setSelectedMentorId(mentorsData[0].id);
    }
  }, [activeNavItem, selectedMentorId]);

  const categoriesMap: { [key: string]: string[] } = {
    "Design": [
      "Graphic Design",
      "Motion Design",
      "3D Design",
      "Product Design",
      "Multimedia",
      "Interaction Design",
      "Game Design"
    ],
    "3D Character Animation": [],
    "2D Character Animation": [],
    "3D Rigging": [],
    "Concept Art": [
      "Character Design",
      "Environment Design",
      "Prop Design",
      "Digital Matte Painting",
      "Background Painting",
      "Color Script",
      "Painting"
    ],
    "Storyboard & Animatics": [],
    "Game Animation": [],
    "Texturing and Lookdev": [],
    "Lighting": [],
    "Visual Effect (Vfx)": [],
    "Character Effect (Cfx)": ["Cloth Simulation", "Hair Simulation", "Crowd Simulation"],
    "Modeling & Sculpting": ["Character Modeling", "Environment Modeling", "Prop Modeling", "Sculpting"],
    "Film Making": [
      "Acting",
      "Film Directing",
      "Film Distribution",
      "Cinematography",
      "Photography",
      "Production Design",
      "Hair & Makeup",
      "Film Editing"
    ],
    "Architecture": []
  };

  // Filter mentors based on search term and active category
  const filteredMentors = mentors.filter(mentor => {
    // Search filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        mentor.name.toLowerCase().includes(searchLower) || 
        mentor.role.toLowerCase().includes(searchLower) || 
        mentor.company.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Category filtering could be implemented here later
    
    return true;
  });

  return (
    <div className="flex min-h-screen bg-white pt-16 overflow-x-hidden">
      {/* Welcome Message */}
      <Suspense fallback={<div>Loading...</div>}>
        <WelcomeMessage setShowWelcome={setShowWelcome} showWelcome={showWelcome} />
      </Suspense>

      {/* Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center pt-8 pb-4">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveView('groupMentorship')}
            className={`rotate-180 writing-mode-vertical-rl transform origin-center cursor-pointer px-4 py-2 rounded transition-colors ${
              activeView === 'groupMentorship'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-gray-500 hover:text-gray-700 font-medium hover:bg-gray-100'
            }`}
            style={{ writingMode: 'vertical-rl' }}
          >
            Group Mentorship
          </button>
          <button
            onClick={() => setActiveView('mentors')}
            className={`rotate-180 writing-mode-vertical-rl transform origin-center cursor-pointer px-4 py-2 rounded transition-colors ${
              activeView === 'mentors'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-gray-500 hover:text-gray-700 font-medium hover:bg-gray-100'
            }`}
            style={{ writingMode: 'vertical-rl' }}
          >
            Mentors
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-x-hidden">
        {activeView === 'mentors' ? (
          <>
            {/* Navigation */}
            <div className="flex items-center mb-8 overflow-x-auto">
              <div className="flex flex-wrap space-x-2">
                <NavItem 
                  icon="home" 
                  label="Home" 
                  active={activeNavItem === 'home'} 
                  onClick={() => setActiveNavItem('home')}
                />
                <NavItem 
                  icon="compass" 
                  label="Explore" 
                  active={activeNavItem === 'explore'} 
                  onClick={() => setActiveNavItem('explore')}
                />
                <NavItem 
                  icon="community" 
                  label="Community" 
                  active={activeNavItem === 'community'} 
                  onClick={() => setActiveNavItem('community')}
                />
                <NavItem 
                  icon="calendar" 
                  label="Bookings" 
                  active={activeNavItem === 'calendar'} 
                  onClick={() => setActiveNavItem('calendar')}
                />
                <NavItem 
                  icon="chat" 
                  label="Chat" 
                  active={activeNavItem === 'chat'} 
                  onClick={() => setActiveNavItem('chat')}
                />
                <NavItem 
                  icon="achievement" 
                  label="Achievements" 
                  active={activeNavItem === 'achievement'} 
                  onClick={() => setActiveNavItem('achievement')}
                />
              </div>
            </div>

            {activeNavItem === 'explore' ? (
              <>
                {/* Search and Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="relative flex-grow max-w-4xl w-full sm:w-auto">
                    <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name, role or company"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm('')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      style={{ background: 'linear-gradient(90deg, #24242E 0%, #747494 100%)' }}
                      className="flex items-center text-white px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-md whitespace-nowrap"
                    >
                      <BsLightning className="mr-2" size={20} />
                      <span>Available ASAP</span>
                    </button>
                    <button 
                      style={{ background: 'linear-gradient(90deg, #F0EEB4 0%, #DBA508 100%)' }}
                      className="flex items-center text-white px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-md whitespace-nowrap"
                    >
                      <BsPersonFill className="mr-2" size={20} />
                      <span>Coaching</span>
                    </button>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="mb-8">
                  <div className="flex flex-nowrap gap-1 overflow-x-auto pb-2 whitespace-nowrap">
                    {Object.keys(categoriesMap).map((category, index) => (
                      <CategoryButton
                        key={index}
                        label={category}
                        active={activeCategory === category}
                        textSize="text-[10px]" // Reduced text size further
                        padding="px-1.5 py-0.5" // Reduced padding
                        onClick={() => {
                          // If same category is clicked, toggle it off
                          if (activeCategory === category) {
                            setActiveCategory(null);
                          } else {
                            // Set new active category
                            setActiveCategory(category);
                          }
                        }}
                      />
                    ))}
                  </div>
                  {/* Render child categories with border if available */}
                  {activeCategory && categoriesMap[activeCategory].length > 0 && (
                    <div className="mt-2 flex flex-nowrap gap-1 overflow-x-auto pb-1 whitespace-nowrap">
                      {categoriesMap[activeCategory].map((childCategory, idx) => (
                        <div key={idx} className="border border-gray-200 rounded">
                          <CategoryButton 
                            label={childCategory} 
                            textSize="text-[9px]" 
                            padding="px-1 py-0.5" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mentor Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {filteredMentors.length > 0 ? (
                    filteredMentors.map((mentor) => (
                      <MentorCard key={mentor.id} mentor={mentor} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-500 text-lg">No mentors found matching your search criteria.</p>
                      {searchTerm && (
                        <button 
                          className="mt-2 text-blue-500 hover:underline"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : activeNavItem === 'calendar' ? (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Main Booking Content - Left Column */}
                <div className="flex-1">
                  {/* Profile Header */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="relative h-48">
                      {/* Banner Image */}
                      <Image
                        src="/images/banner.png"
                        alt="Mentor Banner"
                        width={800}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Mentor Profile Picture */}
                      <div className="absolute -bottom-12 left-6 border-4 border-white rounded-full shadow-md">
                        <Image
                          src={selectedMentor?.imageUrl || "/images/mentor_pic.png"}
                          alt={selectedMentor?.name || "Mentor Profile"}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-6 pt-16">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-800">{selectedMentor?.name || "Mentor Name"}</h2>
                          <p className="text-gray-600">{selectedMentor?.role || "Role"} at {selectedMentor?.company || "Company"}</p>
                        </div>
                        <div className="flex space-x-3">
                          <a href="#" className="text-blue-600 hover:text-blue-800">
                            <BsLinkedin size={24} />
                          </a>
                          <a href="#" className="text-gray-600 hover:text-gray-800">
                            <BsGlobe size={24} />
                          </a>
                        </div>
                      </div>
                      
                      {/* Tabs */}
                      <div className="flex border-b border-gray-200 mt-6">
                        <button
                          className="pb-2 px-4 -mb-px border-b-2 border-blue-500 text-blue-600"
                        >
                          Overview
                        </button>
                        <button
                          className="pb-2 px-4 -mb-px text-gray-600 hover:text-gray-800"
                        >
                          Reviews
                        </button>
                        <button
                          className="pb-2 px-4 -mb-px text-gray-600 hover:text-gray-800"
                        >
                          Group Mentorship
                        </button>
                      </div>
                      
                      {/* Tab Content */}
                      <div className="py-4">
                        <p className="text-gray-700">
                          {selectedMentor?.name || "The mentor"} is a highly experienced {selectedMentor?.role || "professional"} with {selectedMentor?.experience || "several"}+ years of experience at {selectedMentor?.company || "their company"}. 
                          They specialize in their field and provide valuable insights to mentees.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Calendar */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Sessions</h3>
                    <p className="text-gray-600 mb-6">Book 1:1 sessions from the options based on your needs</p>
                    
                    {/* Session Type Toggle */}
                    <div className="flex space-x-4 mb-6">
                      <button
                        className="px-4 py-2 rounded-lg border bg-blue-50 border-blue-500 text-blue-700"
                      >
                        Mentorship session
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border ${
                          selectedMentor?.providesCoaching
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!selectedMentor?.providesCoaching}
                      >
                        Coaching session
                      </button>
                    </div>
                    
                    {/* Calendar Dates */}
                    <div className="relative mb-6">
                      <div className="flex items-center">
                        <button className="absolute left-0 bg-white p-2 rounded-full shadow-md z-10">
                          <FiArrowLeft className="text-gray-600" />
                        </button>
                        <div className="flex-1 overflow-x-auto py-2 px-8">
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0 text-center p-3 rounded-lg cursor-pointer bg-blue-50 border border-blue-200">
                              <p className="text-gray-500 text-sm font-medium">Mon</p>
                              <p className="text-gray-800 font-semibold">18 Jan</p>
                              <p className="text-xs text-gray-500 mt-1">12 slots</p>
                            </div>
                            <div className="flex-shrink-0 text-center p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                              <p className="text-gray-500 text-sm font-medium">Wed</p>
                              <p className="text-gray-800 font-semibold">20 Jan</p>
                              <p className="text-xs text-gray-500 mt-1">8 slots</p>
                            </div>
                            <div className="flex-shrink-0 text-center p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                              <p className="text-gray-500 text-sm font-medium">Fri</p>
                              <p className="text-gray-800 font-semibold">22 Jan</p>
                              <p className="text-xs text-gray-500 mt-1">10 slots</p>
                            </div>
                            <div className="flex-shrink-0 text-center p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                              <p className="text-gray-500 text-sm font-medium">Mon</p>
                              <p className="text-gray-800 font-semibold">25 Jan</p>
                              <p className="text-xs text-gray-500 mt-1">12 slots</p>
                            </div>
                            <div className="flex-shrink-0 text-center p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                              <p className="text-gray-500 text-sm font-medium">Wed</p>
                              <p className="text-gray-800 font-semibold">27 Jan</p>
                              <p className="text-xs text-gray-500 mt-1">6 slots</p>
                            </div>
                          </div>
                        </div>
                        <button className="absolute right-0 bg-white p-2 rounded-full shadow-md z-10">
                          <FiArrowRight className="text-gray-600" />
                        </button>
                      </div>
                      <div className="text-right mt-2">
                        <a href="#" className="text-blue-600 text-sm flex items-center justify-end hover:underline">
                          View all <FiArrowRight className="ml-1" size={14} />
                        </a>
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    <div className="mb-6">
                      <h4 className="text-gray-800 font-medium mb-4">Available time slots</h4>
                      <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                          6:00pm
                        </button>
                        <button className="px-4 py-2 border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                          8:00pm
                        </button>
                        <button className="px-4 py-2 border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                          9:00pm
                        </button>
                        <button className="px-4 py-2 border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                          10:00pm
                        </button>
                      </div>
                    </div>
                    
                    {/* Book Button */}
                    <button
                      className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-gray-400 cursor-not-allowed"
                      disabled={true}
                    >
                      Book session for 18th Jan, 2025
                    </button>
                    
                    {/* Languages */}
                    <div className="mt-6">
                      <p className="text-gray-700 font-medium mb-2">Fluent in</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          English
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          Spanish
                        </span>
                        {selectedMentor?.location === 'Brazil' && (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            Portuguese
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                  {/* Mentor Stats */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Mentor Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mentoring time</span>
                        <span className="font-medium">{selectedMentor?.sessions || 0}+ hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attendance</span>
                        <span className="font-medium">{selectedMentor?.attendance || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessions completed</span>
                        <span className="font-medium">{selectedMentor?.sessions || 0}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-md font-medium text-gray-800 mt-6 mb-3">Top areas of impact</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {selectedMentor?.role || "Professional Skills"}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        Career Development
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        Portfolio Review
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        Industry Insights
                      </span>
                    </div>
                  </div>
                  
                  {/* Achievements */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-blue-500 pl-3">
                        <h4 className="font-medium text-gray-800">{selectedMentor?.sessions || 0}+ hours of mentoring</h4>
                        <p className="text-sm text-gray-600">Dedicated over {selectedMentor?.sessions || 0} hours to helping others grow</p>
                      </div>
                      <div className="border-l-2 border-blue-500 pl-3">
                        <h4 className="font-medium text-gray-800">{selectedMentor?.reviews || 0}+ satisfied mentees</h4>
                        <p className="text-sm text-gray-600">Consistently high ratings from mentees</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* More Mentors */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">More mentors for you</h3>
                    <div className="space-y-4">
                      {mentorsData.filter(m => m.id !== selectedMentor?.id).map((mentor, index) => (
                        <div 
                          key={index} 
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedMentorId(mentor.id)}
                        >
                          <Image
                            src={mentor.imageUrl}
                            alt={mentor.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">{mentor.name}</h4>
                            <p className="text-xs text-gray-600">{mentor.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{
                    activeNavItem === 'home' ? 'Home' :
                    activeNavItem === 'community' ? 'Community' :
                    activeNavItem === 'chat' ? 'Chat' :
                    activeNavItem === 'achievement' ? 'Achievements' : ''
                  }</h2>
                  <p className="text-gray-600">This feature is coming soon. Stay tuned!</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Group Mentorship</h2>
              <p className="text-gray-600">This feature is coming soon. Stay tuned!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Extract the welcome message to a separate component that uses useSearchParams
const WelcomeMessage: React.FC<{
  showWelcome: boolean;
  setShowWelcome: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showWelcome, setShowWelcome }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if user is coming from signup
    const fromSignup = searchParams.get('fromSignup');
    if (fromSignup === 'true') {
      setShowWelcome(true);
      // Remove the query parameter after processing
      const url = new URL(window.location.href);
      url.searchParams.delete('fromSignup');
      router.replace(url.pathname);

      // Auto-hide welcome message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router, setShowWelcome]);

  if (!showWelcome) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md z-50 animate-fade-in">
      <span className="font-bold">Welcome to your dashboard!</span>
      <p>Your account has been successfully created.</p>
    </div>
  );
};

// Sub-components

interface NavItemProps {
  icon: 'home' | 'compass' | 'community' | 'calendar' | 'chat' | 'achievement';
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  const getIcon = () => {
    switch (icon) {
      case 'home': return <FiHome className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} size={20} />;
      case 'compass': return <FiCompass className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} size={20} />;
      case 'community': return <FiUsers className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} size={20} />;
      case 'calendar': return <FiCalendar className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} size={20} />;
      case 'chat': return <FiMessageCircle className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} size={20} />;
      case 'achievement': return <FiAward className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} size={20} />;
      default: return <FiHome className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-600'}`} size={20} />;
    }
  };

  return (
    <div 
      className={`flex items-center px-6 py-3 rounded-lg cursor-pointer ${active ? 'bg-blue-100' : ''}`}
      onClick={onClick}
    >
      {getIcon()}
      <span className={`font-medium ${active ? 'text-gray-800' : 'text-gray-600'}`}>{label}</span>
    </div>
  );
};

interface CategoryButtonProps {
  label: string;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  textSize?: string;
  padding?: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ label, active, onClick, textSize, padding }) => {
  return (
    <button
      onClick={onClick}
      className={`${padding || 'px-2 py-1'} rounded-md ${textSize ? textSize : 'text-xs'} font-normal whitespace-nowrap ${
        active ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
};

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      {/* Mentor Image with Badges */}
      <div className="relative">
        <Image
          src={mentor.imageUrl}
          alt={mentor.name}
          width={500}
          height={192}
          className="w-full h-48 object-cover"
        />
        {mentor.isTopRated && (
          <div 
            style={{ background: 'linear-gradient(90deg, #F0EEB4 0%, #DBA508 100%)' }}
            className="absolute top-2 right-2 text-xs text-black px-2 py-1 rounded-md font-medium flex items-center"
          >
            <BsPersonFill className="mr-1" size={12} />
            Top Rated
          </div>
        )}
        {mentor.isAvailableASAP && (
          <div 
            style={{ background: 'linear-gradient(90deg, #24242E 0%, #747494 100%)' }}
            className="absolute bottom-2 left-2 text-xs text-white px-2 py-1 rounded-md font-medium flex items-center"
          >
            <BsLightning className="mr-1" size={12} />
            Available ASAP
          </div>
        )}
      </div>
      {/* Mentor Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-black">{mentor.name}</h3>
        <p className="text-sm text-gray-600">{mentor.role} at {mentor.company}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {mentor.sessions} sessions
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {mentor.reviews} reviews
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {mentor.experience}+ years exp
          </span>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;