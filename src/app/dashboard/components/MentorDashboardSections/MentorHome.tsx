"use client"
import React from 'react';
import Image from 'next/image';
import { FiArrowRight, FiCalendar, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { Mentor } from '../common/types';

interface MentorHomeProps {
  user: Record<string, unknown>; // Replacing 'any' with a more specific type
  mentors: Mentor[];
  onNavigate: (section: 'explore' | 'community' | 'calendar' | 'chat') => void;
}

const MentorHome: React.FC<MentorHomeProps> = ({ 
  user,
  mentors, 
  onNavigate
}) => {
  // Featured mentors (just take the first 3 for demo)
  const featuredMentors = mentors.slice(0, 3);
  
  // Recent activity data (static for demo)
  const recentActivity = [
    {
      type: 'session',
      title: 'Upcoming Session',
      description: 'Character Animation Fundamentals with Chris Lee',
      date: 'Tomorrow, 3:00 PM',
      icon: <FiCalendar className="text-blue-500" size={20} />
    },
    {
      type: 'community',
      title: 'New Replies',
      description: '3 new replies to your question about rigging techniques',
      date: '2 hours ago',
      icon: <FiUsers className="text-green-500" size={20} />
    },
    {
      type: 'message',
      title: 'New Message',
      description: 'Jane Smith sent you feedback on your portfolio',
      date: '5 hours ago',
      icon: <FiMessageCircle className="text-purple-500" size={20} />
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Image
            src={typeof user?.image === 'string' ? user.image : "/images/mentor_pic.png"}
            alt="User"
            width={64}
            height={64}
            className="rounded-full object-cover w-16 h-16"
          />
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {typeof user?.name === 'string' ? user.name : "User"}!</h2>
            <p className="text-gray-600">Continue where you left off</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800">Next Session</h3>
            <p className="text-sm text-gray-600">Tomorrow, 3:00 PM</p>
            <button 
              className="mt-2 text-blue-600 text-sm flex items-center hover:underline"
              onClick={() => onNavigate('calendar')}
            >
              View calendar <FiArrowRight className="ml-1" size={14} />
            </button>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800">Community Activity</h3>
            <p className="text-sm text-gray-600">3 new replies to your posts</p>
            <button 
              className="mt-2 text-green-600 text-sm flex items-center hover:underline"
              onClick={() => onNavigate('community')}
            >
              View discussions <FiArrowRight className="ml-1" size={14} />
            </button>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800">Messages</h3>
            <p className="text-sm text-gray-600">5 unread messages</p>
            <button 
              className="mt-2 text-purple-600 text-sm flex items-center hover:underline"
              onClick={() => onNavigate('chat')}
            >
              Check inbox <FiArrowRight className="ml-1" size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="p-2 bg-gray-50 rounded-lg mr-4">
                {activity.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 text-blue-600 text-sm flex items-center hover:underline">
          View all activity <FiArrowRight className="ml-1" size={14} />
        </button>
      </div>
      
      {/* Featured Mentors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Featured Mentors</h3>
          <button 
            className="text-blue-600 text-sm flex items-center hover:underline"
            onClick={() => onNavigate('explore')}
          >
            View all mentors <FiArrowRight className="ml-1" size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMentors.map((mentor, index) => (
            <div key={index} className="flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              <div className="relative h-40">
                <Image
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  width={300}
                  height={160}
                  className="w-full h-40 object-cover"
                />
                {mentor.isTopRated && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded text-gray-800">
                    Top Rated
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-800">{mentor.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{mentor.role} at {mentor.company}</p>
                <div className="flex space-x-2 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {mentor.sessions} Sessions
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {mentor.experience}+ Years
                  </span>
                </div>
                <button className="w-full py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorHome;