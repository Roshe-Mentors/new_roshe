"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { FiAward, FiCalendar, FiUsers, FiClock, FiCheck } from 'react-icons/fi';
import { Mentor } from '../common/types';

interface MentorAchievementsProps {
  user: any; // Using any for now
  selectedMentor?: Mentor;
}

const MentorAchievements: React.FC<MentorAchievementsProps> = ({ 
  user,
  selectedMentor
}) => {
  // Mock achievement data
  const achievements = [
    {
      id: 1,
      title: 'First Session',
      description: 'Completed your first mentoring session',
      icon: <FiCalendar className="text-blue-500" size={24} />,
      achieved: true,
      date: '12 Jan, 2025'
    },
    {
      id: 2,
      title: '5 Sessions',
      description: 'Completed 5 mentoring sessions',
      icon: <FiUsers className="text-blue-500" size={24} />,
      achieved: true,
      date: '20 Feb, 2025'
    },
    {
      id: 3,
      title: '10 Hours',
      description: 'Spent 10 hours mentoring others',
      icon: <FiClock className="text-blue-500" size={24} />,
      achieved: false,
      progress: 7
    },
    {
      id: 4,
      title: 'Consistent Mentor',
      description: 'Maintained 100% attendance for 3 months',
      icon: <FiCheck className="text-blue-500" size={24} />,
      achieved: false,
      progress: 67
    },
    {
      id: 5,
      title: 'Top Rated',
      description: 'Received 5 five-star reviews',
      icon: <FiAward className="text-blue-500" size={24} />,
      achieved: false,
      progress: 40
    },
  ];

  // Mock statistics
  const stats = [
    { label: 'Sessions Completed', value: '12' },
    { label: 'Hours Mentored', value: '7' },
    { label: 'Mentees Helped', value: '8' },
    { label: 'Average Rating', value: '4.7' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Achievement Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-48">
          {/* Banner Image */}
          <Image
            src="/images/banner.png"
            alt="Achievement Banner"
            width={1200}
            height={400}
            className="w-full h-48 object-cover object-center"
            priority
            quality={100}
          />
          
          {/* User Profile Picture */}
          <div className="absolute -bottom-12 left-6 border-4 border-white rounded-full shadow-md">
            <Image
              src={user?.image || selectedMentor?.imageUrl || "/images/mentor_pic.png"}
              alt="Profile"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        </div>
        <div className="p-6 pt-16">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {user?.name || selectedMentor?.name || "User"}
              </h2>
              <p className="text-gray-600">Achievements & Stats</p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Achievements</h3>
        
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg mr-4">
                {achievement.icon}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.achieved ? (
                    <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Achieved
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      In progress
                    </div>
                  )}
                </div>
                
                {achievement.achieved ? (
                  <p className="text-xs text-gray-500 mt-2">Achieved on {achievement.date}</p>
                ) : (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Upcoming Achievement Goals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended Goals</h3>
        <p className="text-gray-600 mb-6">Complete these goals to level up your profile and increase visibility</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Complete your profile</h4>
            <p className="text-sm text-gray-600 mb-3">Add your skills, experience, and portfolio to attract more mentees</p>
            <button className="text-sm text-blue-600 hover:underline">Update profile</button>
          </div>
          
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Schedule weekly availability</h4>
            <p className="text-sm text-gray-600 mb-3">Set consistent hours to improve your mentor rating</p>
            <button className="text-sm text-blue-600 hover:underline">Set schedule</button>
          </div>
          
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Join the mentor community</h4>
            <p className="text-sm text-gray-600 mb-3">Answer questions and engage with others in your field</p>
            <button className="text-sm text-blue-600 hover:underline">Explore community</button>
          </div>
          
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Create a learning path</h4>
            <p className="text-sm text-gray-600 mb-3">Develop a structured series of sessions for mentees</p>
            <button className="text-sm text-blue-600 hover:underline">Create path</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAchievements;