import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const logos = [
  { src: "/images/disney.png", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/DreamWorks.png", alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: "/images/Illumination.png", alt: 'DreamWorks', href: 'https://www.dreamworks.com' },
  { src: "/images/images.png", alt: 'Sony Pictures Animation', href: 'https://www.sonypicturesanimation.com' },
  { src: "/images/pixar.png", alt: 'Skydance Animation', href: 'https://www.skydance.com' },
  { src: "/images/Skydance_Animation.png", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/Sony_Pictures.png", alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: "/images/disney.png", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/DreamWorks.png", alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: "/images/Illumination.png", alt: 'DreamWorks', href: 'https://www.dreamworks.com' },
  { src: "/images/images.png", alt: 'Sony Pictures Animation', href: 'https://www.sonypicturesanimation.com' },
  { src: "/images/pixar.png", alt: 'Skydance Animation', href: 'https://www.skydance.com' },
  { src: "/images/Skydance_Animation.png", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/Sony_Pictures.png", alt: 'Pixar', href: 'https://www.pixar.com' },
];

export default function LogosShowcase() {
  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="text-black mb-6">Proven success with 50+ top studios</p>
        <div className="relative">
          {/* Container with infinite scroll effect */}
          <div className="flex animate-marquee space-x-10">
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <Link legacyBehavior key={index} href={logo.href} passHref>
                <a target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Image 
                    src={logo.src}
                    alt={logo.alt}
                    width={150}    
                    height={100}   
                    className="mx-4 transition-transform duration-300 transform hover:scale-105" // Scales uniformly
                  />
                </a>
              </Link>
            ))}
            {/* Second set of logos (duplicated for continuous loop) */}
            {logos.map((logo, index) => (
              <Link legacyBehavior key={index + logos.length} href={logo.href} passHref>
                <a target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Image 
                    src={logo.src}
                    alt={logo.alt}
                    width={150}    
                    height={100}  
                    className="mx-4 transition-transform duration-300 transform hover:scale-110" // Scales uniformly
                  />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
