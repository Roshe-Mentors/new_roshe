"use client"
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { BsLightning, BsPersonFill } from 'react-icons/bs';
import { Mentor } from '../common/types';
import { MentorCard } from '../common/MentorCard';

interface MentorExploreProps {
  mentors: Mentor[];
}

const MentorExplore: React.FC<MentorExploreProps> = ({ mentors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
    // Filter by active category if one is selected
    if (activeCategory) {
      const matchesCategory = mentor.categories?.includes(activeCategory);
      if (!matchesCategory) return false;
    }
    return true;
  });

  return (
    <>
      {/* Search and Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-grow max-w-5xl w-full sm:w-auto">
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
              title="Clear search"
              aria-label="Clear search input"
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
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button 
            className={`px-4 py-2 ${activeCategory === "Career" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"} rounded-lg font-medium`}
            onClick={() => setActiveCategory(activeCategory === "Career" ? null : "Career")}
          >
            Career
          </button>
          <button 
            className={`px-4 py-2 ${activeCategory === "Mental Health" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"} rounded-lg font-medium`}
            onClick={() => setActiveCategory(activeCategory === "Mental Health" ? null : "Mental Health")}
          >
            Mental Health
          </button>
          <button 
            className={`px-4 py-2 ${activeCategory === "Leadership" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"} rounded-lg font-medium`}
            onClick={() => setActiveCategory(activeCategory === "Leadership" ? null : "Leadership")}
          >
            Leadership
          </button>
          <button 
            className={`px-4 py-2 ${activeCategory === "Animation" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"} rounded-lg font-medium`}
            onClick={() => setActiveCategory(activeCategory === "Animation" ? null : "Animation")}
          >
            Animation
          </button>
          <button 
            className={`px-4 py-2 ${activeCategory === "3D Design" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"} rounded-lg font-medium`}
            onClick={() => setActiveCategory(activeCategory === "3D Design" ? null : "3D Design")}
          >
            3D Design
          </button>
          <button 
            className={`px-4 py-2 ${activeCategory === "Industry Insights" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"} rounded-lg font-medium`}
            onClick={() => setActiveCategory(activeCategory === "Industry Insights" ? null : "Industry Insights")}
          >
            Industry Insights
          </button>
          {activeCategory && (
            <button 
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
              onClick={() => setActiveCategory(null)}
            >
              Clear Filter
            </button>
          )}
        </div>
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
                title="Clear search criteria"
                aria-label="Clear search criteria"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MentorExplore;