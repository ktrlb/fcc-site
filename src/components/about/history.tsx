export function History() {
  const timeline = [
    {
      year: "1895",
      title: "Church Founded",
      description: "First Christian Church was established in Granbury by a small group of dedicated believers who wanted to create a welcoming community of faith."
    },
    {
      year: "1920s",
      title: "Growth & Expansion",
      description: "The church grew significantly during the 1920s, adding new programs and ministries to serve the expanding Granbury community."
    },
    {
      year: "1950s",
      title: "New Sanctuary",
      description: "Our current sanctuary was built, providing a beautiful space for worship and community gatherings that continues to serve us today."
    },
    {
      year: "1980s",
      title: "Community Outreach",
      description: "The church established several community outreach programs, including food banks and support services for families in need."
    },
    {
      year: "2000s",
      title: "Modern Ministry",
      description: "We embraced new technologies and contemporary worship while maintaining our traditional values and community focus."
    },
    {
      year: "Today",
      title: "Continuing Mission",
      description: "We continue to serve Granbury with the same dedication and love that has guided us for over 125 years, welcoming all who seek spiritual growth and community."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Our History</h2>
          <p className="mt-4 text-lg text-gray-600">Over 125 years of faith, fellowship, and service in Granbury</p>
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
          <h3 className="text-2xl font-bold text-gray-900 font-serif text-center mb-6">Our Heritage</h3>
          <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            For over 125 years, First Christian Church has been a cornerstone of faith and community in Granbury. 
            We&apos;ve weathered storms, celebrated joys, and grown together as a family of believers. Our rich history 
            is not just about the past—it&apos;s the foundation that continues to inspire our mission today. We honor 
            those who came before us by carrying forward their legacy of love, service, and unwavering faith in God.
          </p>
        </div>
      </div>
    </section>
  );
}
