"use client";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-20" style={{ height: '450px' }}>
      {/* YouTube Video Background */}
      <iframe
        className="absolute top-0 left-0 w-full h-full z-0"
        src="https://www.youtube.com/embed/cmSpf6ZiO4I?autoplay=1&mute=1&loop=1&playlist=cmSpf6ZiO4I&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=0&end=0&enablejsapi=1"
        title="FCC Hero Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'none'
        }}
      />
      
      {/* Fallback image background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/fistpump.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Very light overlay for better text readability */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-white drop-shadow-2xl">
            Welcome to First Christian Church <br />
            Whoever you are, <em>you</em> are welcome here
          </h1>
        </div>
      </div>

    </section>
  );
}
