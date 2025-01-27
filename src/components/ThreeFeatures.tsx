// components/ThreeFeatures.tsx
import React from 'react';

const ThreeFeatures = () => {
  return (
    <section className="w-full bg-white flex justify-center py-10">
      <div className="w-2/3 flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
        
        {/* Feature 1 */}
        <div className="flex space-x-3">
          <div className="w-14 h-6 rounded-full bg-red-400 flex items-center justify-center text-white font-bold">
            1
          </div>
          <div className="text-black">
            <h3 className="font-semibold">An open access to industry’s best.</h3>
            <p>From animation to film and art, there are hundreds of top experts, you can get access for free.</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex space-x-3">
          <div className="w-14 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
            2
          </div>
          <div className="text-black">
            <h3 className="font-semibold">Personalized advice to accelerate your success.</h3>
            <p>Book 1:1 mentorship session & get advice, insights to move faster with your work and demo reel.</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex space-x-3">
          <div className="w-14 h-6 rounded-full bg-teal-400 flex items-center justify-center text-white font-bold">
            3
          </div>
          <div className="text-black">
            <h3 className="font-semibold">Achieve your long term goals, easily.</h3>
            <p>Connect with mentors for recurring sessions and work towards a long-term goal.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ThreeFeatures;
