"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../../lib/auth';
import { getUserRole, UserRole } from '../../../lib/user';
import { fetchAllMentors } from '../../../lib/mentors';
import { Mentor } from './common/types';
import BaseDashboard from './common/BaseDashboard';

// Import mentee section components
import MenteeHome from './MenteeDashboardSections/MenteeHome';
import MenteeExplore from './MenteeDashboardSections/MenteeExplore';
import MenteeCommunity from './MenteeDashboardSections/MenteeCommunity';
import MenteeBookings from './MenteeDashboardSections/MenteeBookings';
import MenteeChat from './MenteeDashboardSections/MenteeChat';
import MenteeAchievements from './MenteeDashboardSections/MenteeAchievements';

// Main Dashboard Component
const MenteeDashboard: React.FC = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeView, setActiveView] = useState<'mentors' | 'groupMentorship'>('mentors');
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'explore' | 'community' | 'calendar' | 'chat' | 'achievement'>('home');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDevelopmentMode = process.env.NODE_ENV === 'development';

  // Check for welcome message display
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
  }, [searchParams, router]);

  // Fetch mentors from Supabase
  useEffect(() => {
    const loadMentors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllMentors();
        console.log('Fetched mentors data:', data);
        setMentors(data.length > 0 ? data : []); 
      } catch (error) {
        console.error('Error loading mentors:', error);
        // In development mode, if there's an error or no data, create some mock data for testing
        if (isDevelopmentMode) {
          console.log('Using mock data for development');
          setMentors([
            {
              id: 'dev-1',
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
    };
    
    loadMentors();
  }, [isDevelopmentMode]);

  // Fetch user role when component mounts
  useEffect(() => {
    const fetchUserRole = async () => {
      // For development mode without a user, set a default role
      if (!user?.id && isDevelopmentMode) {
        console.log('Setting default user role for development');
        setUserRole('mentee');
        return;
      }

      if (user?.id) {
        try {
          const role = await getUserRole(user.id);
          setUserRole(role);
          console.log('User role:', role);
        } catch (error) {
          console.error('Error fetching user role:', error);
          if (isDevelopmentMode) {
            // Default fallback for development
            setUserRole('mentee');
          }
        }
      }
    };
    
    fetchUserRole();
  }, [user, isDevelopmentMode]);

  // Make sure we have a selected mentor when viewing booking page
  useEffect(() => {
    if (activeNavItem === 'calendar' && !selectedMentorId && mentors.length > 0) {
      setSelectedMentorId(mentors[0].id);
    }
  }, [activeNavItem, selectedMentorId, mentors]);

  // Function to navigate between sections from the home screen
  const handleNavigate = (section: 'explore' | 'community' | 'calendar' | 'chat') => {
    switch (section) {
      case 'explore':
        setActiveNavItem('explore');
        break;
      case 'community':
        setActiveNavItem('community');
        break;
      case 'calendar':
        setActiveNavItem('calendar');
        break;
      case 'chat':
        setActiveNavItem('chat');
        break;
    }
  };

  // Render the appropriate section based on active nav item
  const renderActiveSection = () => {
    // Create a default user object that satisfies Record<string, unknown>
    const userRecord: Record<string, unknown> = user ? 
      { ...(user as unknown as Record<string, unknown>), role: userRole } : 
      { 
        name: "Development User", 
        image: "/images/mentor_pic.png", 
        role: userRole,
        id: "dev-user-id",
        email: "dev@example.com"
      };
    // Use mentee data for sections
    switch (activeNavItem) {
      case 'home':
        return (
          <MenteeHome 
            user={userRecord}
            mentors={mentors}
            onNavigate={handleNavigate} 
            userRole={userRole}
          />
        );
      case 'explore':
        return <MenteeExplore 
          mentors={mentors} 
          onSelectMentor={(mentorId) => {
            setSelectedMentorId(mentorId);
            setActiveNavItem('calendar'); // Navigate to bookings when a mentor is selected
          }}
        />;
      case 'community':
        return <MenteeCommunity />;
      case 'calendar':
        return (
          <MenteeBookings
            mentors={mentors}
            selectedMentorId={selectedMentorId}
            setSelectedMentorId={setSelectedMentorId}
            user={userRecord}
          />
        );
      case 'chat':
        return <MenteeChat />;
      case 'achievement':
        return (
          <MenteeAchievements 
            user={userRecord}
            selectedMentor={selectedMentorId ? mentors.find(m => m.id === selectedMentorId) : undefined}
          />
        );
      default:
        return (
          <MenteeHome
            user={userRecord}
            mentors={mentors}
            onNavigate={handleNavigate}
            userRole={userRole}
          />
        );
    }
  };

  // Use the base dashboard component with our specific logic
  return (
    <BaseDashboard
      user={user ? ({ ...user } as unknown as Record<string, unknown>) : {
        name: "Development User", 
        image: "/images/mentor_pic.png", 
        role: userRole,
        id: "dev-user-id",
        email: "dev@example.com"
      }}
      userRole={userRole}
      showWelcome={showWelcome}
      setShowWelcome={setShowWelcome}
      activeView={activeView}
      setActiveView={setActiveView}
      activeNavItem={activeNavItem}
      setActiveNavItem={setActiveNavItem}
      renderActiveSection={renderActiveSection}
      isLoading={isLoading}
    />
  );
};

export default MenteeDashboard;