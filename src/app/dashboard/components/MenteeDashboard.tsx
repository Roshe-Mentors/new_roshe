"use client"
import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../../lib/auth';
import { fetchAllMentors, fetchBookedSessionsByUser } from '../../../lib/mentors';
import { Mentor } from './common/types';

// Import mentee dashboard sections
import MenteeHome from './MenteeDashboardSections/MenteeHome';
import MenteeExplore from './MenteeDashboardSections/MenteeExplore';

// Welcome message component
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

// Main Dashboard Component
const MenteeDashboard: React.FC = () => {
  const { user } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'explore' | 'community' | 'bookings' | 'chat' | 'profile'>('home');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDevelopmentMode = process.env.NODE_ENV === 'development';
  const [visibleMentorCount, setVisibleMentorCount] = useState(3); // Initially show 3 mentors in My Sessions
  // Track booked sessions separately from all mentors
  const [bookedSessions, setBookedSessions] = useState<Mentor[]>([]);

  // Function to show more mentors in the My Sessions view
  const handleViewMore = () => {
    setVisibleMentorCount(prev => prev + 3); // Show 3 more mentors each time
  };
  
  // Function to fetch user's booked sessions - memoized to avoid dependency warnings
  const fetchUserBookedSessions = React.useCallback(async () => {
    if (isDevelopmentMode && mentors.length > 0) {
      // Simulate the user having booked sessions with only 1-2 mentors max
      const bookedMentorsData = mentors.slice(0, Math.min(2, mentors.length));
      setBookedSessions(bookedMentorsData);
    } else if (user && user.id) {
      try {
        // Fetch real booked sessions from Supabase
        const sessions = await fetchBookedSessionsByUser(user.id);
        setBookedSessions(sessions);
      } catch (error) {
        console.error('Error loading booked sessions:', error);
        setBookedSessions([]);
      }
    } else {
      setBookedSessions([]);
    }
  }, [isDevelopmentMode, mentors, user]);

  const fetchMentorsWithUniqueIds = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllMentors();
      console.log('Fetched mentors data:', data);
      
      // Ensure each mentor has a unique ID by adding an index suffix if needed
      const uniqueMentors = data.length > 0 ? 
        data.map((mentor, index) => ({
          ...mentor,
          uniqueId: `${mentor.id}-${index}`
        })) : [];
      
      setMentors(uniqueMentors); 
    } catch (error) {
      console.error('Error loading mentors:', error);
      // In development mode, if there's an error or no data, create some mock data for testing
      if (isDevelopmentMode) {
        console.log('Using mock data for development');
        setMentors([
          {
            id: 'dev-1',
            uniqueId: 'dev-1-0',
            name: 'Development Mentor 1',
            location: 'Test Location',
            role: 'Test Role',
            company: 'Test Company',
            sessions: 10,
            reviews: 5,
            experience: 3,
            attendance: 95,
            isAvailableASAP: true,
            providesCoaching: true,
            imageUrl: '/images/mentor_pic.png',
            isTopRated: true,
            categories: ['3D', 'Animation']
          },
          {
            id: 'dev-2',
            uniqueId: 'dev-2-0',
            name: 'Development Mentor 2',
            location: 'Test Location 2',
            role: 'Test Role 2',
            company: 'Test Company 2',
            sessions: 20,
            reviews: 15,
            experience: 5,
            attendance: 98,
            isAvailableASAP: false,
            providesCoaching: true,
            imageUrl: '/images/bj.jpg',
            isTopRated: false,
            categories: ['Modeling', 'Rigging']
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopmentMode]);
  
  // Fetch mentors from Supabase
  useEffect(() => {
    fetchMentorsWithUniqueIds();
  }, [isDevelopmentMode, fetchMentorsWithUniqueIds]);

  // Fetch user's booked sessions
  useEffect(() => {
    if (!isLoading && mentors.length > 0) {
      fetchUserBookedSessions();
    }
  }, [mentors, isLoading, fetchUserBookedSessions]);

  // Function to navigate between sections from the home screen
  const handleNavigate = (section: 'explore' | 'community' | 'bookings' | 'chat') => {
    setActiveNavItem(section);
  };

  // Render content based on active nav item
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Create user record for components that need it
    const userRecord: Record<string, unknown> = user ? 
      { ...(user as unknown as Record<string, unknown>), role: 'mentee' } : 
      { 
        name: "Development Mentee", 
        image: "/images/mentor_pic.png", 
        role: 'mentee',
        id: "dev-user-id",
        email: "dev@example.com"
      };

    switch (activeNavItem) {
      case 'home':
        return (
          <MenteeHome
            user={userRecord}
            mentors={mentors}
            onNavigate={handleNavigate}
          />
        );
      case 'explore':
        return (
          <MenteeExplore
            mentors={mentors}
          />
        );
      case 'community':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Community</h2>
            <p className="text-gray-600 mb-6">
              Connect with other mentees and industry professionals.
            </p>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We&apos;re working on building a vibrant community platform. Check back soon for forums, events, and more!
              </p>
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Bookings</h2>
            <p className="text-gray-600 mb-6">
              Manage your mentor sessions and bookings.
            </p>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-800">Upcoming Sessions</h3>
                </div>
                <div className="p-6">
                  {bookedSessions.length > 0 ? (
                    bookedSessions.slice(0, visibleMentorCount).map(mentor => (
                      <div key={mentor.uniqueId || `mentor-${mentor.id}`} className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <Image src={mentor.imageUrl} alt={mentor.name} width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{mentor.name}</h4>
                          <p className="text-sm text-gray-500">{mentor.role} at {mentor.company}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven&apos;t booked any sessions yet.</p>
                      <button onClick={() => handleNavigate('explore')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Find a Mentor</button>
                    </div>
                  )}
                  {bookedSessions.length > visibleMentorCount && (
                    <div className="text-center mt-4">
                      <button onClick={handleViewMore} className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">View More Sessions</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-800">Past Sessions</h3>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-600">You haven&apos;t completed any mentor sessions yet.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
            <p className="text-gray-600 mb-6">
              Chat with your mentors and manage your conversations.
            </p>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                When you book a session with a mentor, you&apos;ll be able to chat with them here.
              </p>
              <button 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => setActiveNavItem('explore')}
              >
                Find a Mentor
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Manage your account settings and personal information.
            </p>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gray-200 w-20 h-20 rounded-full overflow-hidden">
                    <Image 
                      src={userRecord.image as string || "/images/mentor_pic.png"} 
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {userRecord.name as string || "Your Name"}
                    </h3>
                    <p className="text-gray-500">{userRecord.email as string || "your.email@example.com"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">ACCOUNT INFORMATION</h4>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Edit profile information
                    </button>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">PREFERENCES</h4>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Manage notification settings
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">ACCOUNT ACTIONS</h4>
                    <button className="text-red-500 hover:text-red-700 text-sm">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Welcome Message */}
      <Suspense fallback={<div>Loading...</div>}>
        <WelcomeMessage setShowWelcome={setShowWelcome} showWelcome={showWelcome} />
      </Suspense>

      {/* Sidebar Navigation - z-index lower than footer */}
      <div className="w-64 bg-white border-r border-gray-200 fixed top-0 h-screen pt-8 pb-4 hidden md:block z-10 overflow-y-auto">
        <div className="px-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Roshe Mentorship</h1>
          <p className="text-sm text-gray-500">Mentee Portal</p>
        </div>
        
        <nav className="space-y-1 px-2">
          <button 
            onClick={() => setActiveNavItem('home')}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeNavItem === 'home' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </button>
          
          <button 
            onClick={() => setActiveNavItem('explore')}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeNavItem === 'explore' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <span>Find Mentors</span>
          </button>
          
          <button 
            onClick={() => handleNavigate('bookings')}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeNavItem === 'bookings' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>My Sessions</span>
          </button>
          
          <button 
            onClick={() => setActiveNavItem('community')}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeNavItem === 'community' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
            </svg>
            <span>Community</span>
          </button>
          
          <button 
            onClick={() => setActiveNavItem('chat')}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeNavItem === 'chat' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>Messages</span>
          </button>
          
          <button 
            onClick={() => setActiveNavItem('profile')}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeNavItem === 'profile' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Profile</span>
          </button>
        </nav>
      </div>

      {/* Mobile Navigation - z-index higher than footer for accessibility */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 md:hidden z-30">
        <button 
          onClick={() => setActiveNavItem('home')}
          className={`flex flex-col items-center justify-center p-2 ${activeNavItem === 'home' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs">Home</span>
        </button>
        
        <button 
          onClick={() => setActiveNavItem('explore')}
          className={`flex flex-col items-center justify-center p-2 ${activeNavItem === 'explore' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Find</span>
        </button>
        
        <button 
          onClick={() => handleNavigate('bookings')}
          className={`flex flex-col items-center justify-center p-2 ${activeNavItem === 'bookings' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Sessions</span>
        </button>
        
        <button 
          onClick={() => setActiveNavItem('chat')}
          className={`flex flex-col items-center justify-center p-2 ${activeNavItem === 'chat' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Chat</span>
        </button>
        
        <button 
          onClick={() => setActiveNavItem('profile')}
          className={`flex flex-col items-center justify-center p-2 ${activeNavItem === 'profile' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* Main Content - Increased pt-8 to pt-16 for more top padding */}
      <div className="flex-1 md:ml-64 p-6 pt-16 pb-40">
        {renderContent()}
      </div>
    </div>
  );
};

export default MenteeDashboard;