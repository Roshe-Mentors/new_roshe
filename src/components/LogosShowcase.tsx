import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const logos = [
  { src: "/images/logo 1.jpg", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/logo 2.jpg", alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: "/images/logo 3.jpg", alt: 'DreamWorks', href: 'https://www.dreamworks.com' },
  { src: "/images/logo 4.jpg", alt: 'Sony Pictures Animation', href: 'https://www.sonypicturesanimation.com' },
  { src: "/images/logo 5.jpg", alt: 'Skydance Animation', href: 'https://www.skydance.com' },
  { src: "/images/logo 6.jpg", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/logo 7.jpg", alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: "/images/logo 8.jpg", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/logo 9.jpg", alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: "/images/logo 10.jpg", alt: 'DreamWorks', href: 'https://www.dreamworks.com' },
  { src: "/images/logo 11.jpg", alt: 'Sony Pictures Animation', href: 'https://www.sonypicturesanimation.com' },
  { src: "/images/logo 12.jpg", alt: 'Skydance Animation', href: 'https://www.skydance.com' },
  { src: "/images/logo 13.jpg", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/logo 14.jpg", alt: 'Pixar', href: 'https://www.pixar.com' },
];

export default function LogosShowcase() {
  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="text-black mb-6 text-lg md:text-xl">Proven success with 50+ top studios</p>
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee-fast whitespace-nowrap min-w-full">
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <Link legacyBehavior key={index} href={logo.href} passHref>
                <a target="_blank" rel="noopener noreferrer" className="inline-block">
                  <div className="w-[150px] sm:w-[200px] md:w-[300px] lg:w-[400px] relative">
                    <Image 
                      src={logo.src}
                      alt={logo.alt}
                      width={800}    
                      height={533}   
                      className="transition-transform duration-300 transform hover:scale-105 object-contain"
                      
                    />
                  </div>
                </a>
              </Link>
            ))}
            {/* Second set of logos */}
            {logos.map((logo, index) => (
              <Link legacyBehavior key={index + logos.length} href={logo.href} passHref>
                <a target="_blank" rel="noopener noreferrer" className="inline-block">
                  <div className="w-[150px] sm:w-[200px] md:w-[300px] lg:w-[400px] relative">
                    <Image 
                      src={logo.src}
                      alt={logo.alt}
                      width={800}    
                      height={533}   
                      className="transition-transform duration-300 transform hover:scale-105 object-contain"
                    />
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
