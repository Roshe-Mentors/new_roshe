// app/dashboard/components/MentorDashboard.tsx
import React from 'react';
import { FiSearch, FiHome, FiCompass, FiUsers, FiCalendar, FiMessageCircle, FiAward } from 'react-icons/fi';
import { BsLightning, BsPersonFill } from 'react-icons/bs';

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
  const categories = [
    'All', 'Design', '3D Animation', '2D Animation', '3D Rigging', 
    'Concept Art', 'Storyboard & Animatics', 'Game Animation', 
    'Texturing and Lookdev', 'Lighting', 'Vfx', 'Cfx', 'Modeling', 'Film Making'
  ];

  return (
    <div className="flex min-h-screen bg-white pt-16">
      {/* Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center pt-8 pb-4">
        <div className="writing-vertical text-gray-500 font-medium tracking-wider">
          Group Mentorship
        </div>
        <div className="mt-auto writing-vertical text-gray-500 font-medium tracking-wider">
          Mentors
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Navigation */}
        <div className="flex items-center mb-8">
          <div className="flex space-x-2">
            <NavItem icon="home" label="Home" />
            <NavItem icon="compass" label="Explore" active />
            <NavItem icon="community" label="Community" />
            <NavItem icon="calendar" label="Bookings" />
            <NavItem icon="chat" label="Chat" />
            <NavItem icon="achievement" label="Achievements" />
          </div>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-3xl">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, role or company"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex ml-4 space-x-2">
            <button className="flex items-center bg-gray-800 text-white px-4 py-3 rounded-lg">
              <BsLightning className="mr-2" size={20} />
              <span>Available ASAP</span>
            </button>
            <button className="flex items-center bg-gray-800 text-white px-4 py-3 rounded-lg">
              <BsPersonFill className="mr-2" size={20} />
              <span>Coaching</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <CategoryButton 
              key={index} 
              label={category} 
              active={category === 'All'} 
            />
          ))}
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-components

interface NavItemProps {
  icon: 'home' | 'compass' | 'community' | 'calendar' | 'chat' | 'achievement';
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => {
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
    <div className={`flex items-center px-6 py-3 rounded-lg ${active ? 'bg-blue-100' : ''}`}>
      {getIcon()}
      <span className={`font-medium ${active ? 'text-gray-800' : 'text-gray-600'}`}>{label}</span>
    </div>
  );
};

interface CategoryButtonProps {
  label: string;
  active?: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ label, active }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
        active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
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
        <img 
          src={mentor.imageUrl} 
          alt={mentor.name} 
          className="w-full h-48 object-cover"
        />
        {/* Add any additional JSX or badges here */}
      </div>
      {/* Mentor Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{mentor.name}</h3>
        <p className="text-sm text-gray-600">{mentor.role} at {mentor.company}</p>
      </div>
    </div>
  );
};

export default MentorDashboard;