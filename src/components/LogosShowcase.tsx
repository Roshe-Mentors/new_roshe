import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const logos = [
  { src: '/path/to/disney.png', alt: 'Disney', href: 'https://www.disney.com' },
  { src: '/path/to/pixar.png', alt: 'Pixar', href: 'https://www.pixar.com' },
  { src: '/path/to/dreamworks.png', alt: 'DreamWorks', href: 'https://www.dreamworks.com' },
  { src: '/path/to/sonypictures.png', alt: 'Sony Pictures Animation', href: 'https://www.sonypicturesanimation.com' },
  { src: '/path/to/illumination.png', alt: 'Illumination', href: 'https://www.illumination.com' },
  { src: '/path/to/skydance.png', alt: 'Skydance Animation', href: 'https://www.skydance.com' },
  // Duplicate logos for seamless scrolling effect
  { src: '/path/to/disney.png', alt: 'Disney', href: 'https://www.disney.com' },
  { src: '/path/to/pixar.png', alt: 'Pixar', href: 'https://www.pixar.com' },
];

export default function LogosShowcase() {
  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="text-black mb-6">Proven success with 50+ top studios</p>
        <div className="relative">
          <div className="flex whitespace-nowrap animate-marquee">
            {logos.map((logo, index) => (
              <Link legacyBehavior key={index} href={logo.href} passHref>
                <a target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Image 
                    src={logo.src}
                    alt={logo.alt}
                    width={100}
                    height={50}
                    className="mx-2 transition-transform duration-300 hover:scale-110"
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


