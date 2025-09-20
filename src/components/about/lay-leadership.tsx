export function LayLeadership() {
  const leadershipRoles = [
    {
      title: "General Board",
      description: "The General Board provides overall governance and strategic direction for our congregation, ensuring our church operates effectively and fulfills its mission.",
      icon: "🏛️"
    },
    {
      title: "Elders",
      description: "Elders provide spiritual leadership and pastoral care, offering guidance, prayer, and support to our church family and helping maintain our spiritual foundation.",
      icon: "🙏"
    },
    {
      title: "Deacons",
      description: "Deacons serve our congregation through practical ministry, supporting worship services, and helping those in need within our community.",
      icon: "🤝"
    },
    {
      title: "Mission-Vision Team",
      description: "The Mission-Vision Team helps shape our church's direction and priorities, ensuring we stay focused on our calling to serve God and our community effectively.",
      icon: "🎯"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Lay Leadership</h2>
          <p className="mt-4 text-lg text-gray-600">A Congregationally Led Church</p>
        </div>

        {/* Congregational Leadership Overview */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8" style={{ marginBottom: '2rem' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-6">Our Governance</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              First Christian Church is a congregationally led church, meaning our members play a vital role 
              in the governance and direction of our community. We believe that the Holy Spirit works through 
              all members of our congregation to guide our church&apos;s mission and ministry.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our leadership structure includes dedicated members who serve on our General Board, as Elders 
              and Deacons, and on our Mission-Vision Team. Each September, we seek nominations from our 
              congregation for leadership positions for the coming year, ensuring fresh perspectives and 
              continued growth in our church family.
            </p>
          </div>
        </div>

        {/* Leadership Roles */}
        <div className="grid md:grid-cols-2 gap-8 mb-12" style={{ marginBottom: '2rem' }}>
          {leadershipRoles.map((role, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{role.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 font-serif">{role.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>

        {/* Nomination Process */}
        <div className="bg-blue-50 rounded-lg p-8 text-center" style={{ marginBottom: '2rem' }}>
          <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">Leadership Nominations</h3>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Each September, we invite our congregation to nominate members for leadership positions for the 
            coming year. We seek individuals who are committed to our church&apos;s mission, demonstrate spiritual 
            maturity, and have a heart for serving others. If you feel called to leadership or know someone 
            who would be a good fit, we encourage you to participate in our nomination process.
          </p>
        </div>
      </div>
    </section>
  );
}
