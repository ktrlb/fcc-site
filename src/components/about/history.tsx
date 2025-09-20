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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Our History</h2>
          <p className="mt-4 text-lg text-gray-600">Over 150 years of faith, fellowship, and service in Granbury</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
          
          <div className="space-y-12">
            {timeline.map((event, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-2xl font-bold text-blue-600 font-serif">{event.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2 font-serif">{event.title}</h3>
                    <p className="text-gray-600 mt-2 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heritage Statement */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 font-serif text-center mb-6">Our Legacy</h3>
          <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
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
