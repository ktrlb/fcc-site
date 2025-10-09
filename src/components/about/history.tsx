export function History() {
  const timeline = [
    {
      year: "1836",
      title: "Pioneers Arrive",
      description: "Rachel DeSpain and her family arrive in Texas at Pecan Point, bringing their faith on horseback from Alabama to establish a foundation for Christian community in the region."
    },
    {
      year: "1842-1844",
      title: "Clark Family Begins",
      description: "JA Clark and Hetty DeSpain marry, and their sons Addison and Randolph Clark are born. This family would become instrumental in establishing Christian education and ministry in the area."
    },
    {
      year: "1850s",
      title: "Settlement Grows",
      description: "Pioneers are attracted to the fertile land near the Brazos River, establishing the foundation for what would become the Granbury community."
    },
    {
      year: "1850s",
      title: "Spiritual Education",
      description: "The Clark brothers study under Campbellite Charles Carlton, deepening their understanding of Christian faith and preparing them for future ministry work."
    },
    {
      year: "1861-1865",
      title: "Civil War Years",
      description: "The Civil War largely affects the area, bringing challenges and changes that would shape the community's character and resilience."
    },
    {
      year: "1866",
      title: "Granbury Established",
      description: "The City of Granbury and Hood County are established and named for Confederate Generals Hiram B. Granbury and John Bell Hood, marking the official founding of our community."
    },
    {
      year: "1873",
      title: "First Christian Church Founded",
      description: "JA Clark & Sons start First Christian Church and AddRan male and female college in Thorp Spring, establishing our church's rich educational and spiritual heritage."
    },
    {
      year: "1889",
      title: "Original Chapel Built",
      description: "The original small chapel is built at the southeast corner of Houston & Bluff Streets, providing our first dedicated worship space in Granbury."
    },
    {
      year: "1978",
      title: "Historical Recognition",
      description: "A historical marker is dedicated for the original chapel, recognizing its significance in the community's religious heritage."
    },
    {
      year: "1986",
      title: "Present Building Completed",
      description: "Our present day church building is completed, providing a modern worship space while honoring our historical roots and community mission."
    },
    {
      year: "1992",
      title: "Chapel Preserved",
      description: "The original chapel is moved to its current location as the Langdon Center, preserving this important piece of our church's history for future generations."
    },
    {
      year: "2023",
      title: "150th Anniversary",
      description: "First Christian Church celebrates its 150th anniversary, marking a century and a half of faithful service, spiritual growth, and community impact in Granbury."
    }
  ];

  return (
    <section id="history" className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">Our History</h2>
          <p className="mt-4 text-lg text-white">Over 150 years of faith, fellowship, and service in Granbury</p>
        </div>

        <div className="relative px-6">
          {/* Timeline line - responsive positioning */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-white hidden lg:block"></div>
          <div className="absolute right-4 w-1 h-full bg-white lg:hidden"></div>
          
          <div className="space-y-12">
            {timeline.map((event, index) => {
              const colors = [
                { bg: 'red-600', hex: '#dc2626' },
                { bg: 'teal-800', hex: '#115e59' },
                { bg: 'indigo-900', hex: '#312e81' },
                { bg: 'amber-500', hex: '#f59e0b' }
              ];
              const colorScheme = colors[index % colors.length];
              
              return (
                <div key={index} className="flex items-center relative">
                  {/* Timeline dot - responsive positioning */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-lg hidden lg:block" style={{ backgroundColor: colorScheme.hex }}></div>
                  <div className="absolute right-[-16px] w-4 h-4 rounded-full border-4 border-white shadow-lg lg:hidden" style={{ backgroundColor: colorScheme.hex }}></div>
                  
                  {/* Left side content (even indices) */}
                  {index % 2 === 0 ? (
                    <div className="lg:w-6/12 w-11/12 lg:text-right text-left">
                      <div className="lg:mr-8 rounded-lg shadow-sm p-6 border-0" style={{ backgroundColor: colorScheme.hex }}>
                        <div className="text-2xl font-bold text-white font-serif">{event.year}</div>
                        <h3 className="text-xl font-semibold text-white mt-2 font-serif">{event.title}</h3>
                        <p className="text-white mt-2 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="lg:w-6/12 w-0 lg:block hidden"></div>
                  )}
                  
                  {/* Right side content (odd indices) */}
                  {index % 2 === 1 ? (
                    <div className="lg:w-6/12 w-11/12 lg:text-left text-left">
                      <div className="lg:ml-8 rounded-lg shadow-sm p-6 border-0" style={{ backgroundColor: colorScheme.hex }}>
                        <div className="text-2xl font-bold text-white font-serif">{event.year}</div>
                        <h3 className="text-xl font-semibold text-white mt-2 font-serif">{event.title}</h3>
                        <p className="text-white mt-2 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="lg:w-6/12 w-0 lg:block hidden"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Heritage Statement */}
        <div className="mt-16 rounded-lg shadow-sm p-8 border-0" style={{ backgroundColor: 'rgb(17 94 89)' }}>
          <h3 className="text-2xl font-bold text-white font-serif text-center mb-6">Our Legacy</h3>
          <p className="text-white leading-relaxed text-center max-w-4xl mx-auto">
            For over 150 years, First Christian Church has been a cornerstone of faith and community in Granbury. 
            From the pioneering DeSpain family who brought their faith on horseback from Alabama in 1836, to the Clark 
            family who founded our church and AddRan College in 1873, our rich history is woven into the very fabric 
            of this community. AddRan College, established by our founding family, eventually became Texas Christian University (TCU), 
            one of the nation&apos;s leading universities. We&apos;ve weathered storms, celebrated joys, and grown together as a 
            diverse family of believers. Our legacy is not just about the past—it&apos;s the foundation that continues to inspire 
            our mission today as we welcome all people and work for justice, peace, and community in Granbury and beyond.
          </p>
        </div>
      </div>
    </section>
  );
}
