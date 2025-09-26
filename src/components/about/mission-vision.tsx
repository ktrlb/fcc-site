import { Handshake, BookOpen, Heart } from 'lucide-react';

export function MissionVision() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Our Mission & Vision</h2>
          <p className="mt-4 text-lg text-gray-600">The foundation of who we are and where we&apos;re going</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission Statement */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              To share with ALL people the unconditional love of God that we experience in Jesus Christ our Lord.
            </p>
          </div>

          {/* Vision Statement */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our vision is to be a church that helps people <strong>COME ALIVE IN CHRIST</strong> by inviting them to reimagine church with us:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-3">
              <li><strong>Not pride and judgment,</strong> but a sanctuary for restoring the soul – humble people sharing radical hospitality, and loving each other beyond our differences.</li>
              <li><strong>Not easy answers,</strong> but growing together through shared engagement with the scriptures and the hard questions of life and faith.</li>
              <li><strong>Not a self-serving institution,</strong> but a community in the community that truly sees our neighbor and that responds with the relational love of Christ.</li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 font-serif text-center mb-8">Our Core Values</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Handshake className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 font-serif">Relationship</h4>
                  <p className="text-gray-700 leading-relaxed">
                    All are welcome as we seek genuine connection with God and one another. We care for and respect each other more than we worry about our differences.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 font-serif">Discipleship</h4>
                  <p className="text-gray-700 leading-relaxed">
                    We seek to be remade in the image of Jesus as revealed through Holy Scripture and prayer, and to lead by example as we dedicate ourselves to his work of bringing wholeness to a fragmented world.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 font-serif">Humility</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Only God is God. We are imperfect people motivated by the sacrificial love of Jesus. It&apos;s not about us, but about working together to lift up hungry and hurting people.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👑</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 font-serif">Dignity</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Everyone is made in God&apos;s image, loved unconditionally by their Creator. Everyone. We seek to serve our community and world in ways that reveal the infinite value of each person.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
