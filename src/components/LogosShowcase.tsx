import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const logos = [
  { src: "/images/disney.jpg", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/pixar.jpg", alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: "/images/dreamworks.jpg", alt: 'DreamWorks', href: 'https://www.dreamworks.com' },
  { src: "/images/sonypic.jpg", alt: 'Sony Pictures Animation', href: 'https://www.sonypicturesanimation.com' },
  { src: "/images/skydance.jpg", alt: 'Skydance Animation', href: 'https://www.skydance.com' },
  { src: "/images/disney.jpg", alt: 'Disney', href: 'https://www.disney.com' },
  { src: "/images/mpc.jpg", alt: 'MPC', href: 'https://www.mpc.com' },
  { src: "/images/marvel.jpg", alt: 'Marvel', href: 'https://www.marvel.com' },
  { src: "/images/imageworks.jpg", alt: 'Sony Pictures Imageworks', href: 'https://www.imageworks.com' },
  { src: "/images/dneg.jpg", alt: 'DNEG', href: 'https://www.dneg.com' },
  { src: "/images/cinesite.jpg", alt: 'Cinesite', href: 'https://www.cinesite.com' },
  { src: "/images/industrial.jpg", alt: 'Industrial Light & Magic', href: 'https://www.ilm.com' },
];

export default function LogosShowcase() {
  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="text-black mb-4 text-lg md:text-xl">Proven success with 20+ top studios</p>
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee-fast whitespace-nowrap min-w-full">
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <Link legacyBehavior key={index} href={logo.href} passHref>
                <a target="_blank" rel="noopener noreferrer" className="inline-block mx-4">
                  <div className="w-[100px] sm:w-[120px] md:w-[160px] lg:w-[200px] relative">
                    <Image 
                      src={logo.src}
                      alt={logo.alt}
                      width={150}    
                      height={75}   
                      className="transition-transform duration-300 transform hover:scale-105 object-contain"
                    />
                  </div>
                </a>
              </Link>
            ))}
            {/* Second set of logos */}
            {logos.map((logo, index) => (
              <Link legacyBehavior key={index + logos.length} href={logo.href} passHref>
                <a target="_blank" rel="noopener noreferrer" className="inline-block mx-4">
                  <div className="w-[100px] sm:w-[120px] md:w-[160px] lg:w-[200px] relative">
                    <Image 
                      src={logo.src}
                      alt={logo.alt}
                      width={150}    
                      height={75}   
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
