// app/dashboard/components/MentorDashboard.tsx
"use client"
import Image from 'next/image';
import React, { useEffect, useState, Suspense } from 'react';
import { FiSearch, FiHome, FiCompass, FiUsers, FiCalendar, FiMessageCircle, FiAward, FiArrowLeft, FiArrowRight, FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { BsLightning, BsPersonFill, BsLinkedin, BsGlobe } from 'react-icons/bs';
import { useRouter, useSearchParams } from 'next/navigation';
import { mentorsData } from '../data/mentors';
import axios from 'axios';
import { useUser } from '../../../lib/auth';

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
  const { user } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeView, setActiveView] = useState<'mentors' | 'groupMentorship'>('mentors');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'explore' | 'community' | 'calendar' | 'chat' | 'achievement'>('explore');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  // New state for booking functionality
  const [selectedDate, setSelectedDate] = useState<string>('18 Jan');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'Mentorship' | 'Coaching'>('Mentorship');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [zoomMeetingInfo, setZoomMeetingInfo] = useState<{
    meetingId: string;
    meetingUrl: string;
    password: string;
    startTime: string;
  } | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Add new chat-related state variables
  const [chatSearch, setChatSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [conversations, setConversations] = useState<{
    [key: number]: {
      messages: {
        id: number;
        sender: string;
        text: string;
        timestamp: string;
        read: boolean;
      }[];
    };
  }>({});

  // Mock chat data
  const chatList = [
    {
      id: 1,
      name: 'Moses Omobolaji',
      lastMessage: "You: Good morning management. We are...",
      timestamp: '2w',
      imageUrl: "/images/bj.jpg",
      unread: 0
    },
    {
      id: 2,
      name: 'Faith Ogundare',
      lastMessage: "Faith: That sounds good! I can help you...",
      timestamp: '21w',
      imageUrl: "/images/7.jpeg",
      unread: 0
    },
    {
      id: 3,
      name: 'Chris Lee',
      lastMessage: "You: Thank you for the feedback on my...",
      timestamp: '11w',
      imageUrl: "/images/chris_lee_mentor.png",
      unread: 0
    },
    {
      id: 4,
      name: 'Jane Smith',
      lastMessage: "Jane: The animation principles we discussed...",
      timestamp: '1d',
      imageUrl: "/images/woman1.jpg",
      unread: 0
    },
    {
      id: 5,
      name: 'Michael Johnson',
      lastMessage: "You: I've been working on the character rig...",
      timestamp: '3h',
      imageUrl: "/images/man1.jpg",
      unread: 0
    },
    {
      id: 6,
      name: 'Sophie Williams',
      lastMessage: "Sophie: Here's my availability for next week...",
      timestamp: '1w',
      imageUrl: "/images/woman2.jpg",
      unread: 2
    },
    {
      id: 7,
      name: 'Robert Chen',
      lastMessage: "You: The render is almost complete, I'll share...",
      timestamp: '5d',
      imageUrl: "/images/man2.jpg",
      unread: 0
    },
    {
      id: 8,
      name: 'Anya Petrova',
      lastMessage: "Anya: Have you tried the new sculpting tool?",
      timestamp: '2d',
      imageUrl: "/images/woman3.jpg",
      unread: 0
    },
    {
      id: 9,
      name: 'Jamal Washington',
      lastMessage: "You: I'd appreciate your feedback on my portfolio...",
      timestamp: '6h',
      imageUrl: "/images/man3.jpg",
      unread: 0
    },
    {
      id: 10,
      name: 'Olivia Parker',
      lastMessage: "Olivia: The lighting in your scene looks amazing...",
      timestamp: '4w',
      imageUrl: "/images/woman4.jpg",
      unread: 5
    }
  ];

  // Define categoriesMap inside the component
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

  // Sample dates and time slots
  const availableDates = [
    { day: 'Mon', date: '18 Jan', slots: 12 },
    { day: 'Wed', date: '20 Jan', slots: 8 },
    { day: 'Fri', date: '22 Jan', slots: 10 },
    { day: 'Mon', date: '25 Jan', slots: 12 },
    { day: 'Wed', date: '27 Jan', slots: 6 },
  ];

  const timeSlots = ['6:00pm', '8:00pm', '9:00pm', '10:00pm'];

  // Function to handle booking a session
  const handleBookSession = async () => {
    if (!selectedMentor || !selectedTime || !user) {
      setBookingError('Please select a time slot or log in to book a session');
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      // Call the API to create a Zoom meeting and save the booking
      const response = await axios.post('/api/bookings', {
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        mentorEmail: `${selectedMentor.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Placeholder email
        userId: user.id,
        userEmail: user.email,
        date: selectedDate,
        time: selectedTime,
        sessionType: sessionType
      });

      // On success, set the meeting info
      setZoomMeetingInfo(response.data.meeting);
      setBookingSuccess(true);
    } catch (error: unknown) {
      console.error('Booking error:', error);
      const errorResponse = error as { response?: { data?: { error?: string } } };
      setBookingError(errorResponse.response?.data?.error || 'Failed to book session. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // Function to copy meeting link to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Function to reset booking form
  const resetBookingForm = () => {
    setSelectedTime(null);
    setBookingSuccess(false);
    setZoomMeetingInfo(null);
    setBookingError(null);
  };

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedChat) return;

    const newMessageId = Date.now();
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create a copy of the current conversations
    const updatedConversations = { ...conversations };
    
    // If this is a new conversation, initialize it
    if (!updatedConversations[selectedChat]) {
      updatedConversations[selectedChat] = { messages: [] };
    }
    
    // Add the new message
    updatedConversations[selectedChat].messages.push({
      id: newMessageId,
      sender: 'You',
      text: chatMessage,
      timestamp: formattedTime,
      read: true
    });
    
    // Update the state
    setConversations(updatedConversations);
    setChatMessage('');
  };

  // Function to mark messages as read when a chat is selected
  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    
    // If we don't have any conversation for this chat yet, initialize with mock data
    if (!conversations[chatId]) {
      const selectedChatData = chatList.find(chat => chat.id === chatId);
      const mockMessages = [];
      
      // Create mock conversation with 1-5 messages
      const messageCount = Math.floor(Math.random() * 5) + 1;
      const today = new Date();
      const baseTime = Date.now(); // Use as base timestamp
      
      for (let i = 0; i < messageCount; i++) {
        const timeAgo = Math.floor(Math.random() * 24 * 60); // Random minutes ago (up to 24 hours)
        const messageTime = new Date(today.getTime() - timeAgo * 60000);
        const formattedTime = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        mockMessages.push({
          id: baseTime - (i * 1000), // Ensure each ID is unique by offsetting by index
          sender: i % 2 === 0 ? selectedChatData?.name || 'User' : 'You',
          text: i % 2 === 0 
            ? `Hi there! I&apos;m ${selectedChatData?.name}. How can I help you with your project today?` 
            : "I&apos;ve been working on a new animation sequence and would love your feedback on it.",
          timestamp: formattedTime,
          read: true
        });
      }
      
      setConversations({
        ...conversations,
        [chatId]: { messages: mockMessages }
      });
    }
  };

  // Filter mentors based on search term and active category
  const filteredMentors = mentors.filter(mentor => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        mentor.name.toLowerCase().includes(searchLower) || 
        mentor.role.toLowerCase().includes(searchLower) || 
        mentor.company.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
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
                        width={1200}
                        height={400}
                        className="w-full h-48 object-cover object-center"
                        priority
                        quality={100}
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
                          <a 
                            href="#" 
                            className="text-blue-600 hover:text-blue-800"
                            title="LinkedIn Profile"
                            aria-label="View LinkedIn Profile"
                          >
                            <BsLinkedin size={24} />
                          </a>
                          <a 
                            href="#" 
                            className="text-gray-600 hover:text-gray-800"
                            title="Personal Website"
                            aria-label="Visit Personal Website"
                          >
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
                        className={`px-4 py-2 rounded-lg border ${
                          sessionType === 'Mentorship' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSessionType('Mentorship')}
                      >
                        Mentorship session
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border ${
                          sessionType === 'Coaching' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSessionType('Coaching')}
                        disabled={!selectedMentor?.providesCoaching}
                      >
                        Coaching session
                      </button>
                    </div>
                    
                    {/* Calendar Dates */}
                    <div className="relative mb-6">
                      <div className="flex items-center">
                        <button 
                          className="absolute left-0 bg-white p-2 rounded-full shadow-md z-10"
                          title="Previous dates"
                          aria-label="View previous dates"
                        >
                          <FiArrowLeft className="text-gray-600" />
                        </button>
                        <div className="flex-1 overflow-x-auto py-2 px-8">
                          <div className="flex space-x-4">
                            {availableDates.map((date, index) => (
                              <div
                                key={index}
                                className={`flex-shrink-0 text-center p-3 rounded-lg cursor-pointer ${
                                  selectedDate === date.date ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => setSelectedDate(date.date)}
                              >
                                <p className="text-gray-500 text-sm font-medium">{date.day}</p>
                                <p className="text-gray-800 font-semibold">{date.date}</p>
                                <p className="text-xs text-gray-500 mt-1">{date.slots} slots</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          className="absolute right-0 bg-white p-2 rounded-full shadow-md z-10"
                          title="Next dates"
                          aria-label="View next dates"
                        >
                          <FiArrowRight className="text-gray-600" />
                        </button>
                      </div>
                      <div className="text-right mt-2">
                        <a 
                          href="#" 
                          className="text-blue-600 text-sm flex items-center justify-end hover:underline"
                          title="View all available dates"
                          aria-label="View all available dates"
                        >
                          View all <FiArrowRight className="ml-1" size={14} />
                        </a>
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    <div className="mb-6">
                      <h4 className="text-gray-800 font-medium mb-4">Available time slots</h4>
                      <div className="flex flex-wrap gap-3">
                        {timeSlots.map((time, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 border rounded-lg ${
                              selectedTime === time ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Book Button */}
                    <button
                      className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                        selectedTime ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={handleBookSession}
                      disabled={!selectedTime || isBooking}
                    >
                      {isBooking ? 'Booking...' : `Book session for ${selectedDate}, 2025`}
                    </button>
                    
                    {/* Booking Error */}
                    {bookingError && (
                      <div className="mt-4 text-red-500 text-sm">{bookingError}</div>
                    )}

                    {/* Booking Success */}
                    {bookingSuccess && zoomMeetingInfo && (
                      <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md">
                        <h4 className="font-bold">Booking Confirmed!</h4>
                        <p>Your session has been successfully booked.</p>
                        <div className="mt-4">
                          <p className="text-sm">
                            <strong>Meeting ID:</strong> {zoomMeetingInfo.meetingId}
                          </p>
                          <p className="text-sm">
                            <strong>Start Time:</strong> {zoomMeetingInfo.startTime}
                          </p>
                          <p className="text-sm">
                            <strong>Password:</strong> {zoomMeetingInfo.password}
                          </p>
                          <div className="flex items-center mt-2">
                            <a
                              href={zoomMeetingInfo.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <FiExternalLink className="mr-1" />
                              Join Meeting
                            </a>
                            <button
                              className="ml-4 text-gray-600 hover:text-gray-800 flex items-center"
                              onClick={() => copyToClipboard(zoomMeetingInfo.meetingUrl)}
                            >
                              {linkCopied ? (
                                <>
                                  <FiCheck className="mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <FiCopy className="mr-1" />
                                  Copy Link
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          onClick={resetBookingForm}
                        >
                          Book another session
                        </button>
                      </div>
                    )}
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
            ) : activeNavItem === 'chat' ? (
              <div className="flex flex-col w-full max-w-6xl mx-auto">
                {/* Chat Interface - Split View */}
                <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Left side - Chat List */}
                  <div className="w-1/3 border-r border-gray-100">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search member"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                          value={chatSearch}
                          onChange={(e) => setChatSearch(e.target.value)}
                        />
                        {chatSearch && (
                          <button 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setChatSearch('')}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Member List - Scrollable Container */}
                    <div className="h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide">
                      <style jsx global>{`
                        /* Hide scrollbar for Chrome, Safari and Opera */
                        .scrollbar-hide::-webkit-scrollbar {
                          display: none;
                        }
                        
                        /* Hide scrollbar for IE, Edge and Firefox */
                        .scrollbar-hide {
                          -ms-overflow-style: none;  /* IE and Edge */
                          scrollbar-width: none;  /* Firefox */
                        }
                      `}</style>
                      
                      {/* Filter chat list based on search */}
                      {chatList
                        .filter(chat => 
                          !chatSearch || 
                          chat.name.toLowerCase().includes(chatSearch.toLowerCase())
                        )
                        .map((chat) => (
                        <div 
                          key={chat.id} 
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition duration-150 ${
                            selectedChat === chat.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleChatSelect(chat.id)}
                        >
                          <div className="flex items-center">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0 relative">
                              <Image
                                src={chat.imageUrl}
                                alt={chat.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-12 h-12"
                              />
                              {chat.unread > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                  {chat.unread}
                                </div>
                              )}
                            </div>
                            
                            {/* Text Content */}
                            <div className="ml-4 flex-grow overflow-hidden">
                              <h4 className={`text-gray-900 text-sm ${chat.unread > 0 ? 'font-bold' : 'font-medium'}`}>
                                {chat.name}
                              </h4>
                              <p className={`text-gray-600 text-xs truncate mt-0.5 ${chat.unread > 0 ? 'font-medium' : ''}`}>
                                {chat.lastMessage}
                              </p>
                            </div>
                            
                            {/* Timestamp */}
                            <div className="ml-2 text-gray-400 text-xs">
                              {chat.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right side - Chat Messages */}
                  <div className="w-2/3 flex flex-col">
                    {selectedChat && chatList.find(chat => chat.id === selectedChat) ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center">
                          <div className="flex-shrink-0">
                            <Image
                              src={chatList.find(chat => chat.id === selectedChat)?.imageUrl || "/images/mentor_pic.png"}
                              alt={chatList.find(chat => chat.id === selectedChat)?.name || "Chat"}
                              width={40}
                              height={40}
                              className="rounded-full object-cover w-10 h-10"
                            />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-900">
                              {chatList.find(chat => chat.id === selectedChat)?.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {(chatList.find(chat => chat.id === selectedChat)?.unread || 0) > 0 ? 'Online' : 'Last active 2h ago'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Messages Container */}
                        <div className="flex-grow p-4 overflow-y-auto scrollbar-hide">
                          {conversations[selectedChat]?.messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}>
                              {message.sender !== 'You' && (
                                <div className="flex-shrink-0 mr-2">
                                  <Image
                                    src={chatList.find(chat => chat.id === selectedChat)?.imageUrl || "/images/mentor_pic.png"}
                                    alt={message.sender}
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover w-8 h-8"
                                  />
                                </div>
                              )}
                              <div className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'You' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</p>
                              </div>
                              {message.sender === 'You' && (
                                <div className="flex-shrink-0 ml-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                    You
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-100">
                          <div className="flex items-center">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              className="flex-grow px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              onClick={handleSendMessage}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-grow flex items-center justify-center">
                        <div className="text-center p-8">
                          <FiMessageCircle className="mx-auto text-gray-300" size={48} />
                          <h3 className="mt-4 text-lg font-medium text-gray-900">Your messages</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Select a conversation or start a new chat with a mentor or mentee
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeNavItem === 'achievement' ? (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Main Achievement Content - Left Column */}
                <div className="flex-1">
                  {/* Profile Header */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="relative h-48">
                      {/* Banner Image */}
                      <Image
                        src="/images/banner.png"
                        alt="Mentor Banner"
                        width={1200}
                        height={400}
                        className="w-full h-48 object-cover object-center"
                        priority
                        quality={100}
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
                          <a 
                            href="#" 
                            className="text-blue-600 hover:text-blue-800"
                            title="LinkedIn Profile"
                            aria-label="View LinkedIn Profile"
                          >
                            <BsLinkedin size={24} />
                          </a>
                          <a 
                            href="#" 
                            className="text-gray-600 hover:text-gray-800"
                            title="Personal Website"
                            aria-label="Visit Personal Website"
                          >
                            <BsGlobe size={24} />
                          </a>
                        </div>
                      </div>
                      
                      {/* Tabs */}
                      <div className="flex border-b border-gray-200 mt-6">
                        <button
                          className="pb-2 px-4 -mb-px border-b-2 border-blue-500 text-blue-600"
                        >
                          Achievements
                        </button>
                        <button
                          className="pb-2 px-4 -mb-px text-gray-600 hover:text-gray-800"
                        >
                          Reviews
                        </button>
                        <button
                          className="pb-2 px-4 -mb-px text-gray-600 hover:text-gray-800"
                        >
                          Group Achievements
                        </button>
                      </div>
                      
                      {/* Tab Content */}
                      <div className="py-4">
                        <p className="text-gray-700">
                          {selectedMentor?.name || "The mentor"} has earned multiple achievements through consistent mentoring and positive feedback. 
                          Explore their journey and book a session to learn from their expertise.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievement Calendar */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Sessions</h3>
                    <p className="text-gray-600 mb-6">Book a session to contribute to this mentor&apos;s achievements and your growth</p>
                    
                    {/* Session Type Toggle */}
                    <div className="flex space-x-4 mb-6">
                      <button
                        className={`px-4 py-2 rounded-lg border ${
                          sessionType === 'Mentorship' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSessionType('Mentorship')}
                      >
                        Mentorship session (1-on-1)
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border ${
                          sessionType === 'Coaching' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSessionType('Coaching')}
                      >
                        Coaching session (up to 20 mentees)
                      </button>
                    </div>
                    
                    {/* Calendar Dates */}
                    <div className="relative mb-6">
                      <div className="flex items-center">
                        <button 
                          className="absolute left-0 bg-white p-2 rounded-full shadow-md z-10"
                          title="Previous dates"
                          aria-label="View previous dates"
                        >
                          <FiArrowLeft className="text-gray-600" />
                        </button>
                        <div className="flex-1 overflow-x-auto py-2 px-8">
                          <div className="flex space-x-4">
                            {availableDates.map((date, index) => (
                              <div
                                key={index}
                                className={`flex-shrink-0 text-center p-3 rounded-lg cursor-pointer ${
                                  selectedDate === date.date ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => setSelectedDate(date.date)}
                              >
                                <p className="text-gray-500 text-sm font-medium">{date.day}</p>
                                <p className="text-gray-800 font-semibold">{date.date}</p>
                                <p className="text-xs text-gray-500 mt-1">{sessionType === 'Coaching' ? Math.ceil(date.slots * 1.5) : date.slots} slots</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          className="absolute right-0 bg-white p-2 rounded-full shadow-md z-10"
                          title="Next dates"
                          aria-label="View next dates"
                        >
                          <FiArrowRight className="text-gray-600" />
                        </button>
                      </div>
                      <div className="text-right mt-2">
                        <a 
                          href="#" 
                          className="text-blue-600 text-sm flex items-center justify-end hover:underline"
                          title="View all available dates"
                          aria-label="View all available dates"
                        >
                          View all <FiArrowRight className="ml-1" size={14} />
                        </a>
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    <div className="mb-6">
                      <h4 className="text-gray-800 font-medium mb-4">Available time slots</h4>
                      <div className="flex flex-wrap gap-3">
                        {timeSlots.map((time, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 border rounded-lg ${
                              selectedTime === time ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {sessionType === 'Coaching' && (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">About Coaching Sessions</h4>
                        <p className="text-sm text-gray-600">
                          Coaching sessions allow one mentor to teach up to 20 mentees in a group setting.
                          The mentor will share their knowledge and expertise with the entire group, followed by a Q&A session.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Price:</strong> Coaching sessions are often more cost-effective than 1-on-1 mentorship.
                        </p>
                      </div>
                    )}
                    
                    {/* Book Button */}
                    <button
                      className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                        selectedTime ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={handleBookSession}
                      disabled={!selectedTime || isBooking}
                    >
                      {isBooking ? 'Booking...' : `Book ${sessionType.toLowerCase()} for ${selectedDate}, 2025`}
                    </button>
                    
                    {/* Booking Error */}
                    {bookingError && (
                      <div className="mt-4 text-red-500 text-sm">{bookingError}</div>
                    )}

                    {/* Booking Success */}
                    {bookingSuccess && zoomMeetingInfo && (
                      <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md">
                        <h4 className="font-bold">Booking Confirmed!</h4>
                        <p>Your {sessionType.toLowerCase()} session has been successfully booked.</p>
                        <div className="mt-4">
                          <p className="text-sm">
                            <strong>Meeting ID:</strong> {zoomMeetingInfo.meetingId}
                          </p>
                          <p className="text-sm">
                            <strong>Start Time:</strong> {zoomMeetingInfo.startTime}
                          </p>
                          <p className="text-sm">
                            <strong>Password:</strong> {zoomMeetingInfo.password}
                          </p>
                          <div className="flex items-center mt-2">
                            <a
                              href={zoomMeetingInfo.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <FiExternalLink className="mr-1" />
                              Join Meeting
                            </a>
                            <button
                              className="ml-4 text-gray-600 hover:text-gray-800 flex items-center"
                              onClick={() => copyToClipboard(zoomMeetingInfo.meetingUrl)}
                            >
                              {linkCopied ? (
                                <>
                                  <FiCheck className="mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <FiCopy className="mr-1" />
                                  Copy Link
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          onClick={resetBookingForm}
                        >
                          Book another session
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                  {/* Mentor Achievements */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievement Statistics</h3>
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
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mentees helped</span>
                        <span className="font-medium">{Math.floor(selectedMentor?.sessions * 1.2) || 0}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-md font-medium text-gray-800 mt-6 mb-3">Notable achievements</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <h5 className="font-medium text-gray-800 flex items-center">
                          <FiAward className="text-blue-600 mr-2" size={16} />
                          Expert Mentor
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">Awarded for consistent high-quality mentoring</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <h5 className="font-medium text-gray-800 flex items-center">
                          <FiAward className="text-yellow-600 mr-2" size={16} />
                          Community Leader
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">Recognized for exceptional contributions to the community</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievements List */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievement Milestones</h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-blue-500 pl-3">
                        <h4 className="font-medium text-gray-800">{selectedMentor?.sessions || 0}+ hours of mentoring</h4>
                        <p className="text-sm text-gray-600">Dedicated over {selectedMentor?.sessions || 0} hours to helping others grow</p>
                      </div>
                      <div className="border-l-2 border-green-500 pl-3">
                        <h4 className="font-medium text-gray-800">{selectedMentor?.reviews || 0}+ satisfied mentees</h4>
                        <p className="text-sm text-gray-600">Consistently high ratings from mentees</p>
                      </div>
                      <div className="border-l-2 border-purple-500 pl-3">
                        <h4 className="font-medium text-gray-800">{Math.floor(selectedMentor?.sessions / 10) || 0} coaching groups</h4>
                        <p className="text-sm text-gray-600">Led multiple group coaching sessions</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* More Mentors */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Other accomplished mentors</h3>
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