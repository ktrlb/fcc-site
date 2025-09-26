export function GiveHero() {
  return (
    <section className="relative h-[400px] w-full overflow-hidden">
      {/* Background image placeholder */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/fistpump.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: 'rgba(68 64 60, 0.7)' }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-white drop-shadow-2xl">
            Give & Generosity
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-white/90 drop-shadow-lg">
            Supporting our mission through your generosity
          </p>
        </div>
      </div>
    </section>
  );
}
