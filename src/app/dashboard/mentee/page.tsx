"use client"

import { Tab } from '@headlessui/react';
import { useEffect, useState } from "react";
import { useUser } from "../../../lib/auth";
import { fetchAllMentors } from "../../../lib/mentors";

// Define types
interface Mentor {
  id: string;
  name: string;
  // Add other mentor properties as needed
}

// Create placeholder components until the actual components are created
const MenteeStats = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Mentee Stats</h3>
    <p>Stats will be displayed here</p>
  </div>
);

const RecommendedMentors = ({ mentors }: { mentors: Mentor[] }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Recommended Mentors</h3>
    {mentors.length > 0 ? (
      <ul>
        {mentors.map(mentor => (
          <li key={mentor.id}>{mentor.name}</li>
        ))}
      </ul>
    ) : (
      <p>No recommended mentors yet</p>
    )}
  </div>
);

const MenteeBookings = ({ 
  mentors, 
  selectedMentorId,
  setSelectedMentorId,
  user
}: { 
  mentors: Mentor[],
  selectedMentorId: string | null,
  setSelectedMentorId: React.Dispatch<React.SetStateAction<string | null>>,
  user: Record<string, unknown>
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Book a Mentor</h3>
    {mentors.length > 0 && (
      <div>
        <p>Select a mentor: {selectedMentorId || 'None selected'}</p>
        <button onClick={() => setSelectedMentorId(mentors[0].id)}>
          Select first mentor
        </button>
        <p>User ID: {String(user.id || 'Unknown')}</p>
      </div>
    )}
  </div>
);

const UpcomingSessions = ({ userRole }: { userRole: string }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Upcoming Sessions ({userRole})</h3>
    <p>Your upcoming sessions will be displayed here</p>
  </div>
);

// Note: GoogleCalendarConnect component implementation will be added in future tasks

export default function MenteeDashboard() {
  const { user, loading } = useUser();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      // Fetch all mentors
      const loadMentors = async () => {
        const allMentors = await fetchAllMentors();
        setMentors(allMentors);
      };
      loadMentors();
    }
  }, [user, loading]);

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <div>Please log in to view your dashboard</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mentee Dashboard</h1>
      
      {/* Dashboard Tabs */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          <Tab 
            className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            Overview
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            Find a Mentor
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            My Sessions
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }
          >
            Settings
          </Tab>
        </Tab.List>
        
        <Tab.Panel>
          {/* Overview Tab */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <MenteeStats />
              
              {/* Recently added upcoming sessions section */}
              <div className="mt-8">
                <UpcomingSessions userRole="mentee" />
              </div>
            </div>
            
            <div className="space-y-8">
              <RecommendedMentors mentors={mentors} />
            </div>
          </div>
        </Tab.Panel>
        
        <Tab.Panel>
          {/* Find a Mentor Tab */}
          <MenteeBookings 
            mentors={mentors} 
            selectedMentorId={selectedMentorId} 
            setSelectedMentorId={setSelectedMentorId} 
            user={user as unknown as Record<string, unknown>}
          />
        </Tab.Panel>
        
        <Tab.Panel>
          {/* My Sessions Tab */}
          <div className="space-y-8">
            <UpcomingSessions userRole="mentee" />
          </div>
        </Tab.Panel>
        
        <Tab.Panel>
          {/* Settings Tab */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <p className="mt-2">Configure your mentee account settings here.</p>
            </div>
          </div>
        </Tab.Panel>
      </Tab.Group>
    </main>
  );
}