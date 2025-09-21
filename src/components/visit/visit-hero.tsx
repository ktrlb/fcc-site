import Image from "next/image";

export function VisitHero() {
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
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="text-center text-white px-6 max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/Basic FCC Logo Assets-White Circle.png"
              alt="First Christian Church Granbury"
              width={80}
              height={80}
              className="h-16 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-white drop-shadow-2xl">
            Visit Us
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-white/90 drop-shadow-lg">
            We&apos;d love to welcome you to our community
          </p>
        </div>
      </div>
    </section>
  );
}
