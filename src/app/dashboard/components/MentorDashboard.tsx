// app/dashboard/components/MentorDashboard.tsx
"use client"
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../../lib/auth';
import { mentorsData } from '../data/mentors';
import { getUserRole, UserRole } from '../../../lib/user';

// Import shared components
import { NavItem } from './common/DashboardComponents';

// Import section components
import MentorHome from './MentorDashboardSections/MentorHome';
import MentorExplore from './MentorDashboardSections/MentorExplore';
import MentorCommunity from './MentorDashboardSections/MentorCommunity';
import MentorBookings from './MentorDashboardSections/MentorBookings';
import MentorChat from './MentorDashboardSections/MentorChat';
import MentorAchievements from './MentorDashboardSections/MentorAchievements';

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
const MentorDashboard: React.FC = () => {
  const { user } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeView, setActiveView] = useState<'mentors' | 'groupMentorship'>('mentors');
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'explore' | 'community' | 'calendar' | 'chat' | 'achievement'>('home');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Fetch user role when component mounts
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        const role = await getUserRole(user.id);
        setUserRole(role);
        console.log('User role:', role);
      }
    };
    
    fetchUserRole();
  }, [user]);

  // Make sure we have a selected mentor when viewing booking page
  useEffect(() => {
    if (activeNavItem === 'calendar' && !selectedMentorId && mentorsData.length > 0) {
      setSelectedMentorId(mentorsData[0].id);
    }
  }, [activeNavItem, selectedMentorId]);

  // Function to navigate between sections from the home screen
  };

  // Render the appropriate section based on active nav item
  const renderActiveSection = () => {
    // Create a default user object that satisfies Record<string, unknown>
    const userRecord: Record<string, unknown> = user ? 
      { ...(user as unknown as Record<string, unknown>) } : // Cast to unknown first, then to Record<string, unknown>
      { name: "User", image: "/images/mentor_pic.png" };
      
    switch (activeNavItem) {
      case 'home':
        return (
          <MentorHome 
            user={userRecord}
            mentors={mentorsData} 
            onNavigate={handleNavigate} 
          />
        );
      case 'explore':
        return <MentorExplore 
          mentors={mentorsData} 
          onSelectMentor={(mentorId) => {
            setSelectedMentorId(mentorId);
            setActiveNavItem('calendar'); // Navigate to bookings when a mentor is selected
          }}
        />;
      case 'community':
        return <MentorCommunity />;
      case 'calendar':
        return (
          <MentorBookings
            mentors={mentorsData}
            selectedMentorId={selectedMentorId}
            setSelectedMentorId={setSelectedMentorId}
            user={userRecord} // Use userRecord instead of user
          />
        );
      case 'chat':
        return <MentorChat />;
      case 'achievement':
        return (
          <MentorAchievements 
            user={userRecord} // Use userRecord instead of user
            selectedMentor={selectedMentorId ? mentorsData.find(m => m.id === selectedMentorId) : undefined}
          />
        );
      default:
        return (
          <MentorHome
            user={userRecord}
            mentors={mentorsData}
            onNavigate={handleNavigate}
          />
        );
    }
  };

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

            {/* Render the active section */}
            {renderActiveSection()}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Group Mentorship</h2>
            <p className="text-gray-600 mb-6 text-center max-w-2xl">
              Group mentorship is coming soon! Join interactive sessions with industry professionals and peers.
              Learn together, share experiences, and build connections in a collaborative environment.
            </p>
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => setActiveView('mentors')}
            >
              Back to Individual Mentorship
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;