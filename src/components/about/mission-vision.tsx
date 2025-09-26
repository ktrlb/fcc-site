import { Handshake, BookOpen, Heart, Crown } from 'lucide-react';

export function MissionVision() {
  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-900 font-serif">Our Mission & Vision</h2>
          <p className="mt-4 text-lg text-indigo-900">The foundation of who we are and where we&apos;re going</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission Statement */}
          <div className="rounded-lg shadow-sm p-8 border-0" style={{ backgroundColor: 'rgb(220 38 38)' }}>
            <h3 className="text-2xl font-bold text-white font-serif mb-8">Our Mission</h3>
            <div className="text-center space-y-6">
              <p className="text-white leading-relaxed text-2xl mb-6 font-medium">
                To share with <span className="text-4xl font-bold text-yellow-300">ALL people</span>
              </p>
              <p className="text-white leading-relaxed text-xl mb-6">
                the unconditional love of God
              </p>
              <p className="text-white leading-relaxed text-xl italic">
                that we experience in Jesus Christ our Lord.
              </p>
            </div>
          </div>

          {/* Vision Statement */}
          <div className="rounded-lg shadow-sm p-8 border-0" style={{ backgroundColor: 'rgb(49 46 129)' }}>
            <h3 className="text-2xl font-bold text-white font-serif mb-4">Our Vision</h3>
            <p className="text-white leading-relaxed mb-4">
              Our vision is to be a church that helps people <strong>COME ALIVE IN CHRIST</strong> by inviting them to reimagine church with us:
            </p>
            <ul className="text-white leading-relaxed space-y-3">
              <li><strong>Not pride and judgment,</strong> but a sanctuary for restoring the soul – humble people sharing radical hospitality, and loving each other beyond our differences.</li>
              <li><strong>Not easy answers,</strong> but growing together through shared engagement with the scriptures and the hard questions of life and faith.</li>
              <li><strong>Not a self-serving institution,</strong> but a community in the community that truly sees our neighbor and that responds with the relational love of Christ.</li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-indigo-900 font-serif text-center mb-8">Our Core Values</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Relationship",
                description: "All are welcome as we seek genuine connection with God and one another. We care for and respect each other more than we worry about our differences.",
                icon: Handshake,
                color: { bg: 'amber-500', hex: '#f59e0b' }
              },
              {
                title: "Discipleship", 
                description: "We seek to be remade in the image of Jesus as revealed through Holy Scripture and prayer, and to lead by example as we dedicate ourselves to his work of bringing wholeness to a fragmented world.",
                icon: BookOpen,
                color: { bg: 'teal-800', hex: '#115e59' }
              },
              {
                title: "Humility",
                description: "Only God is God. We are imperfect people motivated by the sacrificial love of Jesus. It's not about us, but about working together to lift up hungry and hurting people.",
                icon: Heart,
                color: { bg: 'lime-700', hex: '#4d7c0f' }
              },
              {
                title: "Dignity",
                description: "Everyone is made in God's image, loved unconditionally by their Creator. Everyone. We seek to serve our community and world in ways that reveal the infinite value of each person.",
                icon: Crown,
                color: { bg: 'purple', hex: '#714E91' }
              }
            ].map((value, index) => (
              <div key={index} className="rounded-lg shadow-sm p-6 border-0" style={{ backgroundColor: value.color.hex }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6" style={{ color: value.color.hex }} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3 font-serif">{value.title}</h4>
                    <p className="text-white leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
