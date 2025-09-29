"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-20" style={{ height: '500px' }}>
      {/* YouTube Video Background - autoplay on load */}
        <iframe
          className="absolute z-0"
          src="https://www.youtube.com/embed/cmSpf6ZiO4I?autoplay=1&mute=1&loop=1&playlist=cmSpf6ZiO4I&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=0&end=0&enablejsapi=1"
          title="FCC Hero Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          frameBorder="0"
          style={{
            position: 'absolute',
            top: 'calc(50% + 110px)',
            left: '50%',
            width: '115vw',
            height: 'calc(64.6875vw + 50px)',
            minHeight: 'calc(115% + 50px)',
            minWidth: '204.44vh',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            pointerEvents: 'none'
          }}
        />
      

      {/* Very light overlay for better text readability */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      />


      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="text-center text-white px-6 max-w-5xl mx-auto">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/Basic FCC Logo Assets-White Circle.png"
              alt="First Christian Church Granbury"
              width={96}
              height={96}
              className="h-24 w-24 object-contain drop-shadow-lg"
            />
          </div>
          <h1 
            className="font-bold font-serif text-white drop-shadow-2xl leading-tight"
            style={{ 
              fontSize: 'clamp(1.25rem, 5vw, 3.25rem)',
              lineHeight: '1.1'
            }}
          >
            Welcome to First Christian Church <br />
            Whoever you are, <em>you</em> are welcome here
          </h1>
        </div>
      </div>

    </section>
  );
}
