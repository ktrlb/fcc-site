export function Staff() {
  const staff = [
    {
      name: "Rev. Dr. John Smith",
      title: "Senior Minister",
      bio: "Pastor John has been serving First Christian Church for over 15 years. He holds a Doctor of Ministry from Brite Divinity School and is passionate about community outreach and spiritual growth.",
      image: "/images/staff-placeholder.jpg"
    },
    {
      name: "Sarah Johnson",
      title: "Associate Minister",
      bio: "Sarah joined our staff in 2020 and brings fresh energy to our youth and family ministries. She has a Master of Divinity from TCU and loves working with children and families.",
      image: "/images/staff-placeholder.jpg"
    },
    {
      name: "Mike Davis",
      title: "Music Director",
      bio: "Mike has been leading our music ministry for 8 years. He&apos;s a talented musician who helps create meaningful worship experiences through music and song.",
      image: "/images/staff-placeholder.jpg"
    },
    {
      name: "Lisa Brown",
      title: "Church Administrator",
      bio: "Lisa keeps our church running smoothly behind the scenes. She handles everything from scheduling to communications and is the friendly voice you&apos;ll hear when you call the office.",
      image: "/images/staff-placeholder.jpg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Our Staff</h2>
          <p className="mt-4 text-lg text-gray-600">Meet the people who help make our church community thrive</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staff.map((person, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-gray-400">👤</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 font-serif">{person.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{person.title}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
