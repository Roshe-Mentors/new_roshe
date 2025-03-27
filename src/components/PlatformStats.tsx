// components/PlatformStats.tsx
import React from 'react';

const stats = [
  {
    preText: "Career enhanced for",
    bigText: "90%",
    postText: "Happy Members",
  },
  {
    preText: "Empowered by",
    bigText: "300",
    postText: "Expert mentors",
  },
  {
    preText: "Global community from",
    bigText: "80",
    postText: "Countries",
  },
  {
    preText: "We have built",
    bigText: "10k",
    postText: "Connections",
  },
];

const PlatformStats = () => {
  return (
    <section className="w-full py-10 flex flex-col items-center"
    style={{ 
      background: 'linear-gradient(90deg, #9898FA 0%, #65658D 100%)' 
    }}
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        A platform that delivers results
      </h2>

      <div className="w-4/5 max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center bg-white rounded-md p-1.5 text-center text-black transition-transform duration-300 hover:scale-105 hover:shadow-xl aspect-square max-w-[120px] mx-auto"
          >
            <p className="text-xs mb-0.5">{item.preText}</p>
            <h3 className="text-3xl font-bold mb-0.5">{item.bigText}</h3>
            <p className="text-xs">{item.postText}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlatformStats;
