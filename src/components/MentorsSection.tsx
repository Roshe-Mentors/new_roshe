// components/MentorsSection.tsx
import React from 'react';
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
    image: "/images/2.png",
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
    coaching: true,
    image: "/images/10.png",
  },
  {
    id: 4,
    name: 'Name Surname',
    location: 'London',
    role: 'Character Modeler at MPC',
    sessionsAndReviews: '100 sessions (30 reviews)',
    experience: '5 years',
    attendance: '98%',
    topRated: true,
    availableASAP: true,
    coaching: false,
    image: "/images/11.png",
  },
  {
    id: 5,
    name: 'Name Surname',
    location: 'Italy',
    role: 'Prop Modeler at Disney',
    sessionsAndReviews: '100 sessions (30 reviews)',
    experience: '10 years',
    attendance: '98%',
    topRated: false,
    availableASAP: false,
    coaching: true,
    image: "/images/12.png",
  },
];

const MentorsSection = () => {
  return (
    <section className="w-full bg-white py-16 flex flex-col items-center">
      {/* Section Heading */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-4xl font-bold text-gray-900">
          Discover the world&apos;s top mentors
        </h2>
        <p className="mt-4 text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Our mentors are the heart and soul of Roshe Mentorship. Veteran studio pro animators
          from powerhouses like Pixar, DreamWorks, and Industrial Light & Magic, teach you the
          ins and outs of production level animation.
        </p>
      </div>

      {/* Cards Container */}
      <div className="w-11/12 max-w-7xl flex flex-wrap justify-center gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="w-56 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
          >
            {/* Image Wrapper */}
            <div className="relative w-full h-56">
              <Image
                src={mentor.image}
                alt={mentor.name}
                fill
                quality={95}
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 224px"
              />

              {/* Badges with correct styling */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {mentor.topRated && (
                  <span className="bg-white text-gray-900 text-sm font-medium px-3 py-1 rounded-md shadow-sm">
                    Top rated
                  </span>
                )}
              </div>
              
              <div className="absolute bottom-4 left-4 flex gap-2">
                {mentor.availableASAP && (
                  <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-500 text-white text-sm font-medium px-3 py-1 rounded-md shadow-sm">
                    <span className="mr-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Available ASAP
                  </div>
                )}
                {mentor.coaching && (
                  <div className="flex items-center  bg-gradient-to-r from-[#F0EEB4] to-[#DBA508] bg-opacity-90 text-gray-900 text-sm font-medium px-3 py-1 rounded-md shadow-sm">
                    <span className="mr-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4  text-grey-500">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    </span>
                    Coaching
                  </div>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 text-gray-900">
              <div className="mb-3">
                <h3 className="text-lg font-bold flex items-baseline">
                  {mentor.name}{' '}
                  <span className="text-xs text-gray-500 ml-1">({mentor.location})</span>
                </h3>
              </div>
              
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2 text-gray-500">
                    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                  </svg>
                  <span className="text-sm">{mentor.role}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2 text-gray-500">
                    <path d="M4.913 2.658c.666-.287 1.44-.205 2.025.204l5.204 3.64c.43.305.65.705.651 1.124V18.5c0 1.381-1.4 2.372-2.69 1.896l-5.203-1.909a1.12 1.12 0 01-.764-1.067V3.725c0-.564.382-1.059.926-1.195z" />
                    <path d="M7.544 2.662c.494-.283 1.093-.283 1.587 0l12.568 7.215c.537.304.865.87.865 1.479v.12c0 1.037-.982 1.8-1.965 1.52l-12.57-3.583c-.228-.066-.425-.181-.565-.334a1.122 1.122 0 01-.324-.775V3.605c0-.546.367-1.027.904-1.171z" />
                  </svg>
                  <span className="text-sm">{mentor.sessionsAndReviews}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="font-medium">{mentor.experience}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg. Attendance</p>
                  <p className="font-medium">{mentor.attendance}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MentorsSection;