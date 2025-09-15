export function LayLeadership() {
  const leadership = [
    {
      name: "Robert Wilson",
      title: "Elder Chair",
      committee: "Board of Elders",
      bio: "Robert has been a member for 20 years and serves as our Elder Chair, providing spiritual leadership and guidance to our congregation."
    },
    {
      name: "Mary Thompson",
      title: "Deacon Chair",
      committee: "Board of Deacons",
      bio: "Mary leads our deacon ministry, coordinating care for our members and supporting those in need within our community."
    },
    {
      name: "David Martinez",
      title: "Trustee Chair",
      committee: "Board of Trustees",
      bio: "David oversees our church property and finances, ensuring our resources are used wisely to further our mission."
    },
    {
      name: "Jennifer Lee",
      title: "Christian Education Chair",
      committee: "Christian Education",
      bio: "Jennifer coordinates our Sunday School programs and educational ministries, helping all ages grow in their faith."
    },
    {
      name: "Tom Anderson",
      title: "Worship Chair",
      committee: "Worship Committee",
      bio: "Tom helps plan and coordinate our worship services, ensuring meaningful experiences for all who join us."
    },
    {
      name: "Susan Clark",
      title: "Outreach Chair",
      committee: "Outreach Committee",
      bio: "Susan leads our community outreach efforts, connecting our church with local organizations and service opportunities."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Lay Leadership</h2>
          <p className="mt-4 text-lg text-gray-600">Our dedicated volunteers who help guide and serve our church community</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadership.map((leader, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-blue-600">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 font-serif">{leader.name}</h3>
                <p className="text-blue-600 font-medium">{leader.title}</p>
                <p className="text-sm text-gray-500 mt-1">{leader.committee}</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{leader.bio}</p>
            </div>
          ))}
        </div>

        {/* Call to Leadership */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">Interested in Leadership?</h3>
          <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
            We&apos;re always looking for dedicated members who feel called to serve in leadership roles. 
            Whether you&apos;re interested in serving on a committee, becoming a deacon, or taking on other 
            leadership responsibilities, we&apos;d love to talk with you about how you can contribute to our church family.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Learn About Leadership Opportunities
          </button>
        </div>
      </div>
    </section>
  );
}
