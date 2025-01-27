// components/MentorsSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Mentor {
  id: number;
  name: string;
  location: string;
  role: string;
  sessionsAndReviews: string;
  experience: string;
  attendance: string;
  topRated: boolean;
  availableASAP: boolean;
  coaching: boolean;
  image: string;
}


const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Name Surname',
    location: 'Brazil',
    role: 'Character Animator at Meta',
    sessionsAndReviews: '100 sessions (30 reviews)',
    experience: '7 years',
    attendance: '98%',
    topRated: true,
    availableASAP: true,
    coaching: false,
    image: "/images/1.png", 
  },
  {
    id: 2,
    name: 'Name Surname',
    location: 'California',
    role: 'Character Animator at Pixar Animation Studios',
    sessionsAndReviews: '100 sessions (30 reviews)',
    experience: '7 years',
    attendance: '98%',
    topRated: false,
    availableASAP: false,
    coaching: true,
    image: "/images/1.png",
  },
  {
    id: 3,
    name: 'Name Surname',
    location: 'Portugal',
    role: 'Matte Painter at DNEG',
    sessionsAndReviews: '100 sessions (30 reviews)',
    experience: '7 years',
    attendance: '98%',
    topRated: true,
    availableASAP: false,
    coaching: false,
    image: "/images/1.png",
  },
  {
    id: 4,
    name: 'Name Surname',
    location: 'London',
    role: 'Character Modeler at MPC',
    sessionsAndReviews: '100 sessions (30 reviews)',
    experience: '5 years',
    attendance: '98%',
    topRated: false,
    availableASAP: true,
    coaching: false,
    image: "/images/1.png",
  },
  {
    id: 5,
    name: 'Name Surname',
    location: 'Italy',
    role: 'Prop Modeler at Disney',
    sessionsAndReviews: '100 sessions (20 reviews)',
    experience: '10 years',
    attendance: '98%',
    topRated: false,
    availableASAP: false,
    coaching: true,
    image: "/images/1.png",
  },
];

const MentorsSection = () => {
  return (
    <section className="w-full bg-white py-10 flex flex-col items-center">
      {/* Section Heading */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          Discover the world&apos;s top mentors
        </h2>
        <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Our mentors are the heart and soul of Roshe Mentorship. Veteran studio pro animators
          from powerhouses like Pixar, DreamWorks, and Industrial Light & Magic, teach you the
          ins and outs of production level animation.
        </p>
      </div>

      {/* Cards Container */}
      <div className="w-11/12 md:w-2/3 flex flex-wrap justify-center md:justify-between gap-6">
        {mentors.map((mentor) => (
          <Link
            key={mentor.id}
            href={`/mentors/${mentor.id}`}
            className="group relative w-full sm:w-[220px] bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Image Wrapper */}
            <div className="relative w-full h-[280px]">
              <Image
                src={mentor.image}
                alt={mentor.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 220px"
              />

              {/* Conditionally rendered badges */}
              {mentor.topRated && (
                <span className="absolute top-2 left-2 bg-gray-100 text-black text-sm font-medium px-2 py-1 rounded">
                  Top rated
                </span>
              )}
              {mentor.coaching && (
                <span className="absolute top-2 right-2 bg-gray-800 text-white text-sm font-medium px-2 py-1 rounded">
                  Coaching
                </span>
              )}
              {mentor.availableASAP && (
                <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-sm font-medium px-2 py-1 rounded">
                  Available ASAP
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="p-4 text-black">
              <h3 className="text-md font-semibold leading-tight">
                {mentor.name}{' '}
                <span className="text-sm text-gray-500">({mentor.location})</span>
              </h3>
              <p className="text-sm mt-1">{mentor.role}</p>
              <p className="text-sm mt-1">{mentor.sessionsAndReviews}</p>

              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <span>Experience: {mentor.experience}</span>
                <span>Avg. Attendance: {mentor.attendance}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MentorsSection;
