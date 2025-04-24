"use client"
import React from 'react';
import { Mentor } from '../common/types';

interface MenteeHomeProps {
  user: Record<string, unknown>;
  mentors: Mentor[];
  onNavigate: (section: 'explore' | 'community' | 'bookings' | 'chat') => void;
}

const MenteeHome: React.FC<MenteeHomeProps> = ({ user, mentors, onNavigate }) => {
  // Use these stats in UI
  const stats = {
    totalSessions: 0,
    hoursLearned: 0,
    upcomingSessions: 0,
    skillsBadges: []
  };

  return (
    <>
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {String(user?.name) || 'there'}!</h2>
            <p className="opacity-90">Ready to continue your learning journey today?</p>
          </div>
          <button 
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-sm"
            onClick={() => onNavigate('explore')}
          >
            Find a Mentor
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Learning Progress</h3>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold text-indigo-600">{stats.totalSessions}</p>
            <p className="text-gray-600">Sessions Completed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Total Hours</h3>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold text-indigo-600">{stats.hoursLearned}</p>
            <p className="text-gray-600">Hours of Learning</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Coming Up</h3>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold text-indigo-600">{stats.upcomingSessions}</p>
            <p className="text-gray-600">Upcoming Sessions</p>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Learning Journey</h2>
        </div>
        
        {stats.totalSessions > 0 ? (
          <div className="space-y-6">
            <p>Show learning progress here</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Start Your Learning Journey</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Book your first mentorship session to begin your personalized learning journey.
            </p>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => onNavigate('explore')}
            >
              Find a Mentor
            </button>
          </div>
        )}
      </section>

      {/* Upcoming Sessions */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Sessions</h2>
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => onNavigate('bookings')}
          >
            View All
          </button>
        </div>
        
        {stats.upcomingSessions > 0 ? (
          <div className="space-y-4">
            <p>Show upcoming sessions here</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">
              You don&apos;t have any upcoming sessions scheduled.
            </p>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => onNavigate('explore')}
            >
              Book a Session
            </button>
          </div>
        )}
      </section>

      {/* Recommended Mentors */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recommended Mentors</h2>
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => onNavigate('explore')}
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.slice(0, 3).map((mentor, index) => (
            <div 
              key={`recommended-${mentor.id}-${index}`}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                // Set selected mentor and navigate to booking
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <img 
                  src={mentor.imageUrl} 
                  alt={mentor.name} 
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{mentor.name}</h3>
                  <p className="text-xs text-gray-500">{mentor.role} at {mentor.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.categories?.slice(0, 2).map((category, i) => (
                  <span 
                    key={i}
                    className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                <span>{mentor.experience} years experience</span>
                <span>{mentor.reviews} reviews</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default MenteeHome;