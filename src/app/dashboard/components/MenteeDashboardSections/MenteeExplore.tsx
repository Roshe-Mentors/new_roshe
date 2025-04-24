"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { Mentor } from '../common/types';

interface MenteeExploreProps {
  mentors: Mentor[];
  onSelectMentor?: (mentorId: string) => void;
}

// Define filter categories
const CATEGORIES = [
  "3D Animation", "2D Animation", "3D Rigging", "Concept Art", 
  "Storyboard", "Game Animation", "Texturing", "Modeling", "VFX", 
  "CFX", "Film Making", "Design", "Architecture"
];

const EXPERIENCE_LEVELS = [
  { value: "any", label: "Any Experience" },
  { value: "1-3", label: "1-3 years" },
  { value: "4-7", label: "4-7 years" },
  { value: "8+", label: "8+ years" }
];

const MenteeExplore: React.FC<MenteeExploreProps> = ({ mentors, onSelectMentor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("any");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleMentorCount, setVisibleMentorCount] = useState(4); // Initially show 4 mentors

  // Filter mentors based on search term and filters
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

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      const hasCategory = selectedCategories.some(category => 
        mentor.categories?.includes(category)
      );
      if (!hasCategory) return false;
    }

    // Filter by experience level
    if (experienceLevel !== "any") {
      if (experienceLevel === "1-3" && (mentor.experience < 1 || mentor.experience > 3)) {
        return false;
      } else if (experienceLevel === "4-7" && (mentor.experience < 4 || mentor.experience > 7)) {
        return false;
      } else if (experienceLevel === "8+" && mentor.experience < 8) {
        return false;
      }
    }

    return true;
  });

  // Handle mentor selection
  const handleSelectMentor = (mentorId: string) => {
    if (onSelectMentor) {
      onSelectMentor(mentorId);
    }
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Function to show more mentors
  const handleViewMore = () => {
    setVisibleMentorCount(prev => prev + 4); // Show 4 more mentors each time
  };

  // Get the mentors to display based on current visibility setting
  const visibleMentors = filteredMentors.slice(0, visibleMentorCount);
  const hasMoreMentors = filteredMentors.length > visibleMentorCount;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Mentor</h2>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, company, or location"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter className="text-gray-500" />
          <span>Filters</span>
          {(selectedCategories.length > 0 || experienceLevel !== "any") && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
              {selectedCategories.length + (experienceLevel !== "any" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="mb-4">
            <h3 className="text-gray-700 font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category)
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Experience Level</h3>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level.value}
                  className={`px-3 py-1 rounded-full text-sm ${
                    experienceLevel === level.value
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setExperienceLevel(level.value)}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
          
          {(selectedCategories.length > 0 || experienceLevel !== "any") && (
            <button
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => {
                setSelectedCategories([]);
                setExperienceLevel("any");
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-gray-600 mb-4">
        Showing {visibleMentors.length} of {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
      </div>

      {/* Mentor Grid */}
      {filteredMentors.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleMentors.map((mentor, index) => (
              <div 
                key={`mentor-${mentor.id}-${index}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectMentor(mentor.id)}
              >
                {/* Mentor Image */}
                <div className="relative h-48">
                  <Image
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {/* Badges */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    {mentor.isTopRated && (
                      <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                        Top Rated
                      </span>
                    )}
                    {mentor.isAvailableASAP && (
                      <span className="inline-block bg-green-400 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
                        Available Now
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Mentor Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-800">{mentor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{mentor.role} at {mentor.company}</p>
                  <p className="text-xs text-gray-500 mb-3">{mentor.location}</p>
                  
                  {/* Stats */}
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>{mentor.experience} years exp.</span>
                    <span>{mentor.sessions} sessions</span>
                    <span>{mentor.reviews} reviews</span>
                  </div>
                  
                  {/* Categories */}
                  {mentor.categories && mentor.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {mentor.categories.slice(0, 2).map((category, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {category}
                        </span>
                      ))}
                      {mentor.categories.length > 2 && (
                        <span className="text-xs text-gray-500">+{mentor.categories.length - 2}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMentor(mentor.id);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* View More Button */}
          {hasMoreMentors && (
            <div className="text-center mt-6">
              <button 
                onClick={handleViewMore}
                className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                View More Mentors
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-block p-4 rounded-full mb-4">
            <FiSearch className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No mentors found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
          <button
            className="text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategories([]);
              setExperienceLevel("any");
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MenteeExplore;