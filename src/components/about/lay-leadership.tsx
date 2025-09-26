import { Building2, Heart, Users, Target } from 'lucide-react';

export function LayLeadership() {
  const leadershipRoles = [
    {
      title: "General Board",
      description: "The General Board provides overall governance and strategic direction for our congregation, ensuring our church operates effectively and fulfills its mission.",
      icon: Building2
    },
    {
      title: "Elders",
      description: "Elders provide spiritual leadership and pastoral care, offering guidance, prayer, and support to our church family and helping maintain our spiritual foundation.",
      icon: Heart
    },
    {
      title: "Deacons",
      description: "Deacons serve our congregation through practical ministry, supporting worship services, and helping those in need within our community.",
      icon: Users
    },
    {
      title: "Mission-Vision Team",
      description: "The Mission-Vision Team helps shape our church's direction and priorities, ensuring we stay focused on our calling to serve God and our community effectively.",
      icon: Target
    }
  ];

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-900 font-serif">Lay Leadership</h2>
          <p className="mt-4 text-lg text-indigo-900">A Congregationally Led Church</p>
        </div>

        {/* Congregational Leadership Overview */}
        <div className="mb-12 rounded-lg p-8" style={{ backgroundColor: 'rgb(49 46 129)', marginBottom: '2rem' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white rounded-full">
                <Building2 className="h-8 w-8" style={{ color: 'rgb(49 46 129)' }} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white font-serif mb-6">Our Governance</h3>
            <p className="text-white leading-relaxed text-lg mb-6">
              First Christian Church is a congregationally led church, meaning our members play a vital role 
              in the governance and direction of our community. We believe that the Holy Spirit works through 
              all members of our congregation to guide our church&apos;s mission and ministry.
            </p>
            <p className="text-white leading-relaxed">
              Our leadership structure includes dedicated members who serve on our General Board, as Elders 
              and Deacons, and on our Mission-Vision Team. Each September, we seek nominations from our 
              congregation for leadership positions for the coming year, ensuring fresh perspectives and 
              continued growth in our church family.
            </p>
          </div>
        </div>

        {/* Leadership Roles */}
        <div className="grid md:grid-cols-2 gap-8 mb-12" style={{ marginBottom: '2rem' }}>
          {leadershipRoles.map((role, index) => {
            // Assign specific colors to each role
            let colorScheme;
            switch (role.title) {
              case 'General Board':
                colorScheme = { bg: 'red-600', hex: '#dc2626' };
                break;
              case 'Elders':
                colorScheme = { bg: 'teal-800', hex: '#115e59' };
                break;
              case 'Deacons':
                colorScheme = { bg: 'purple', hex: '#714E91' };
                break;
              case 'Mission-Vision Team':
                colorScheme = { bg: 'amber-500', hex: '#f59e0b' };
                break;
              default:
                colorScheme = { bg: 'indigo-900', hex: '#312e81' };
            }
            
            return (
              <div key={index} className="rounded-lg p-6 border-0" style={{ backgroundColor: colorScheme.hex }}>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <role.icon className="h-8 w-8" style={{ color: colorScheme.hex }} />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-serif">{role.title}</h3>
                </div>
                <p className="text-white leading-relaxed">{role.description}</p>
              </div>
            );
          })}
        </div>

        {/* Nomination Process */}
        <div className="rounded-lg p-8 text-center" style={{ backgroundColor: 'rgb(77 124 15)', marginBottom: '2rem' }}>
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-full">
              <Users className="h-8 w-8" style={{ color: 'rgb(77 124 15)' }} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white font-serif mb-4">Leadership Nominations</h3>
          <p className="text-white leading-relaxed max-w-3xl mx-auto">
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
