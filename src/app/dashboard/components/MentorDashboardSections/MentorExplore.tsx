"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';
import { BsLightning, BsPersonFill } from 'react-icons/bs';
import { Mentor } from '../common/types';

interface MentorExploreProps {
  mentors: Mentor[];
  onSelectMentor?: (mentorId: string) => void;
}

const MentorExplore: React.FC<MentorExploreProps> = ({ mentors, onSelectMentor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showOnlyAvailableASAP, setShowOnlyAvailableASAP] = useState(false);
  const [showOnlyCoaching, setShowOnlyCoaching] = useState(false);

  // Filter mentors based on search term, active category, and filter toggles
  const filteredMentors = mentors.filter(mentor => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        mentor.name.toLowerCase().includes(searchLower) || 
        mentor.role.toLowerCase().includes(searchLower) || 
        mentor.company.toLowerCase().includes(searchLower) ||
        mentor.location.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Filter by active category if one is selected
    if (activeCategory) {
      const matchesCategory = mentor.categories?.includes(activeCategory);
      if (!matchesCategory) return false;
    }

    // Filter by available ASAP toggle
    if (showOnlyAvailableASAP && !mentor.isAvailableASAP) {
      return false;
    }

    // Filter by coaching toggle
    if (showOnlyCoaching && !mentor.providesCoaching) {
      return false;
    }

    return true;
  });

  // Handle mentor selection
  const handleSelectMentor = (mentorId: string) => {
    if (onSelectMentor) {
      onSelectMentor(mentorId);
    }
  };

  return (
    <>
      {/* Search and Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-grow max-w-5xl w-full sm:w-auto">
          <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, role, company or location"
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
            onClick={() => setShowOnlyAvailableASAP(!showOnlyAvailableASAP)}
            style={{ background: showOnlyAvailableASAP 
              ? 'linear-gradient(90deg, #24242E 0%, #747494 100%)' 
              : 'white' 
            }}
            className={`flex items-center ${showOnlyAvailableASAP ? 'text-white' : 'text-gray-700 border border-gray-200'} px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-md whitespace-nowrap`}
          >
            <BsLightning className="mr-2" size={20} />
            <span>Available ASAP</span>
          </button>
          <button 
            onClick={() => setShowOnlyCoaching(!showOnlyCoaching)}
            style={{ background: showOnlyCoaching 
              ? 'linear-gradient(90deg, #F0EEB4 0%, #DBA508 100%)' 
              : 'white' 
            }}
            className={`flex items-center ${showOnlyCoaching ? 'text-gray-800' : 'text-gray-700 border border-gray-200'} px-4 py-3 rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-md whitespace-nowrap`}
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
            <div 
              key={mentor.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleSelectMentor(mentor.id)}
            >
              {/* Mentor Image with Badges */}
              <div className="relative">
                <Image
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  width={500}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                {mentor.isTopRated && (
                  <div className="absolute top-2 left-2 bg-white bg-opacity-85 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-800">
                    Top Rated
                  </div>
                )}
                {mentor.isAvailableASAP && (
                  <div 
                    className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded text-white"
                    style={{ background: 'linear-gradient(90deg, #24242E 0%, #747494 100%)' }}
                  >
                    Available ASAP
                  </div>
                )}
                {mentor.providesCoaching && (
                  <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#F0EEB4] to-[#DBA508] text-xs font-bold px-2 py-1 rounded text-gray-800">
                    Coaching
                  </div>
                )}
              </div>
              
              {/* Mentor Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{mentor.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{mentor.role} at {mentor.company}</p>
                <p className="text-xs text-gray-500 mb-3">{mentor.location}</p>
                
                {/* Mentor Stats */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <span className="font-medium text-gray-800 mr-1">{mentor.sessions}</span>
                    <span>Sessions</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <span className="font-medium text-gray-800 mr-1">{mentor.reviews}</span>
                    <span>Reviews</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <span className="font-medium text-gray-800 mr-1">{mentor.experience}</span>
                    <span>Years</span>
                  </div>
                </div>
                
                {/* Categories */}
                {mentor.categories && mentor.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mentor.categories.slice(0, 3).map((category, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                    {mentor.categories.length > 3 && (
                      <span className="text-xs text-gray-600">+{mentor.categories.length - 3} more</span>
                    )}
                  </div>
                )}
                
                {/* Action Button */}
                <button 
                  className="w-full text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition duration-200 text-sm mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMentor(mentor.id);
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No mentors found matching your search criteria.</p>
            {(searchTerm || activeCategory || showOnlyAvailableASAP || showOnlyCoaching) && (
              <button 
                className="mt-2 text-blue-500 hover:underline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory(null);
                  setShowOnlyAvailableASAP(false);
                  setShowOnlyCoaching(false);
                }}
                title="Clear all filters"
                aria-label="Clear all search filters"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MentorExplore;