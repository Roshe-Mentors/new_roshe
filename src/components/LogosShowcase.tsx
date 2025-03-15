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
                    width={400}    
                    height={800}  
                    className="mx-4 w-[200px] h-auto transition-transform duration-300 transform hover:scale-105"// Scales uniformly
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
                    width={400}    
                    height={800}  
                    className="mx-4 w-[200px] h-auto transition-transform duration-300 transform hover:scale-105" // Scales uniformly
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
