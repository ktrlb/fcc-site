"use client";

import Image from "next/image";

export function VisitHero() {
  return (
    <section className="relative w-screen overflow-hidden pt-20" style={{ height: '450px', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      {/* Worship Image Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/assorted-images/fcc-asset-worship.jpg"
          alt="First Christian Church Worship Service"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="text-center text-white px-6 max-w-5xl mx-auto">
          <h1 
            className="font-bold font-serif text-white drop-shadow-2xl leading-tight"
            style={{ 
              fontSize: 'clamp(1.25rem, 5vw, 3.25rem)',
              lineHeight: '1.1'
            }}
          >
            Visit Us
          </h1>
          <p 
            className="text-white/90 drop-shadow-lg mt-4"
            style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              lineHeight: '1.3'
            }}
          >
            We think First Christian Church of Granbury is a pretty special place.
            <br />
            We want to share it with you.
          </p>
        </div>
      </div>
    </section>
  );
}
