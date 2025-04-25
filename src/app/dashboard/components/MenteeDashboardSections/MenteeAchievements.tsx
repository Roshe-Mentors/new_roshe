"use client"
import React from 'react';
import { Mentor } from '../common/types';

interface MenteeAchievementsProps {
  user: Record<string, unknown>;
  selectedMentor?: Mentor;
}

const MenteeAchievements: React.FC<MenteeAchievementsProps> = ({ 
  // Disable eslint for unused props that might be used in the future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedMentor 
}) => {
  // Sample achievements data
  const achievements = [
    {
      id: 1,
      title: "First Mentoring Session",
      description: "Completed your first mentoring session",
      icon: "🏆",
      date: "Apr 10, 2025",
      completed: true
    },
    {
      id: 2,
      title: "Portfolio Submission",
      description: "Submitted your portfolio for review",
      icon: "📁",
      date: "Apr 15, 2025",
      completed: true
    },
    {
      id: 3,
      title: "Feedback Implementation",
      description: "Successfully implemented mentor feedback",
      icon: "✅",
      date: "Apr 18, 2025",
      completed: true
    },
    {
      id: 4,
      title: "First Project Milestone",
      description: "Reached the first milestone of your project",
      icon: "🎯",
      date: "Apr 22, 2025",
      completed: false
    },
    {
      id: 5,
      title: "Five Completed Sessions",
      description: "Completed five mentoring sessions",
      icon: "🔄",
      date: "Pending",
      completed: false
    }
  ];
  
  // Sample skills data 
  const skills = [
    { name: "Character Design", progress: 65 },
    { name: "3D Modeling", progress: 80 },
    { name: "Animation Principles", progress: 50 },
    { name: "Rigging", progress: 35 },
    { name: "Texturing", progress: 60 },
    { name: "Rendering", progress: 45 }
  ];
  
  // Sample mentor feedback data
  const mentorFeedback = [
    {
      id: 1,
      date: "Apr 12, 2025",
      mentor: "Chris Lee",
      text: "Great progress on your character design. The silhouette is distinctive and appealing. Focus on refining the facial expressions in our next session.",
      rating: 4
    },
    {
      id: 2,
      date: "Apr 19, 2025",
      mentor: "Sarah Johnson",
      text: "Your rigging has improved significantly. The shoulder deformation is much smoother now. Let's work on weight painting for the facial rig in our next meeting.",
      rating: 5
    }
  ];

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Your Progress & Achievements
        </h1>
        <p className="mt-2 text-gray-600">
          Track your growth, skills development, and milestone accomplishments.
        </p>
      </div>
      
      {/* Achievements */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Achievements</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`flex items-start border rounded-lg p-4 ${achievement.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
              >
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center text-2xl mr-4">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{achievement.title}</h3>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      achievement.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {achievement.completed ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {achievement.completed ? `Achieved on ${achievement.date}` : achievement.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Skills Progress */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Skills Development</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-900">{skill.name}</h3>
                  <span className="text-sm text-gray-500">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mentor Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Mentor Feedback</h2>
        </div>
        <div className="p-6">
          {mentorFeedback.length > 0 ? (
            <div className="space-y-4">
              {mentorFeedback.map(feedback => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Feedback from {feedback.mentor}</h3>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">"{feedback.text}"</p>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{feedback.rating}/5 rating</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No feedback received yet</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Goal Setting Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Your Learning Goals</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Set a new goal</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your learning goal..."
                className="flex-1 py-2 px-4 block rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Add Goal
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <input 
                type="checkbox" 
                id="goal-1" 
                className="h-4 w-4 text-indigo-600 rounded" 
                aria-label="Master character facial rigging"
              />
              <label htmlFor="goal-1" className="ml-3 text-sm text-gray-700">Master character facial rigging</label>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <input 
                type="checkbox" 
                id="goal-2" 
                className="h-4 w-4 text-indigo-600 rounded" 
                aria-label="Complete a short animation demo"
              />
              <label htmlFor="goal-2" className="ml-3 text-sm text-gray-700">Complete a short animation demo</label>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <input 
                type="checkbox" 
                id="goal-3" 
                className="h-4 w-4 text-indigo-600 rounded" 
                checked 
                aria-label="Learn basic texture painting"
              />
              <label htmlFor="goal-3" className="ml-3 text-sm text-gray-700 line-through">Learn basic texture painting</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeAchievements;