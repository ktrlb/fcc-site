import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Heart, Music, Gamepad2, Calendar } from "lucide-react";
import Image from "next/image";

export default function ChildrenPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/childrens-header-background.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center calc(50% + 80px)",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(68 64 60, 0.7)' }}></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Users className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Children&apos;s Ministry
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Nurturing young hearts and minds in faith through worship, learning, and community.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">Our Philosophy on Faith Development</h2>
            <p className="mt-4 text-lg text-white/80 max-w-4xl mx-auto">
              We believe that children are capable of deep spiritual understanding and meaningful faith experiences. 
              Our approach combines age-appropriate learning with authentic worship, recognizing that children 
              learn best through stories, play, music, and relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/assorted-images/fcc-childrens-ministry-asset-b.jpeg"
                  alt="Children learning together"
                  fill
                  className="object-cover"
                />
              </div>
              <Heart className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Love-Centered</h3>
              <p className="text-white/90">
                Every interaction is rooted in God&apos;s unconditional love, helping children 
                understand they are beloved children of God.
              </p>
            </div>
            <div className="text-center p-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/assorted-images/fcc-asset-easter-egg-hunt.jpeg"
                  alt="Children's activities"
                  fill
                  className="object-cover"
                />
              </div>
              <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Story-Based</h3>
              <p className="text-white/90">
                We use biblical stories and modern parables to help children connect 
                timeless truths to their daily experiences.
              </p>
            </div>
            <div className="text-center p-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/assorted-images/fcc-intergenerational ministry.jpeg"
                  alt="Intergenerational community"
                  fill
                  className="object-cover"
                />
              </div>
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Community-Focused</h3>
              <p className="text-white/90">
                Children learn faith in relationship with others, building connections 
                with peers, mentors, and the broader church family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Worship Experience Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 font-serif italic">Sunday Worship Experience</h2>
            <p className="mt-4 text-lg text-indigo-700">How children participate in our worship services</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(245 158 11)' }}>
              <div className="flex items-center mb-4">
                <Music className="h-8 w-8 text-white mr-3" />
                <h3 className="text-xl font-bold text-white">Main Worship Service</h3>
              </div>
              <p className="text-white/90 mb-4">
                Children are welcome and encouraged to participate in our main worship services. 
                We believe that worshiping together as a family creates lasting memories and 
                spiritual connections.
              </p>
              <ul className="space-y-2 text-white/90">
                <li>• Children&apos;s bulletins and activity pages</li>
                <li>• Special seating area in the front left pews</li>
                <li>• Child-friendly worship elements</li>
                <li>• Quiet activities available for younger children</li>
              </ul>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(77 124 15)' }}>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-white mr-3" />
                <h3 className="text-xl font-bold text-white">Children&apos;s Worship Center</h3>
              </div>
              <p className="text-white/90 mb-4">
                After communion, children ages 4-12 are invited to our Children&apos;s Worship Center 
                for a child-focused exploration of the day&apos;s theme.
              </p>
              <ul className="space-y-2 text-white/90">
                <li>• Interactive storytelling and drama</li>
                <li>• Hands-on activities and crafts</li>
                <li>• Age-appropriate discussions</li>
                <li>• Creative expression through art and music</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pathfinders Kids Club Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Gamepad2 className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">Pathfinders Kids Club</h2>
            <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
              Our Sunday School program focuses on play, creativity, and relationship-building 
              as the foundation for spiritual growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <h3 className="text-2xl font-bold text-white mb-6">Program Features</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white">Creative Play</h4>
                    <p className="text-white/90">Learning through games, crafts, and imaginative activities</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white">Small Group Relationships</h4>
                    <p className="text-white/90">Building friendships with peers and caring adult mentors</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white">Service Projects</h4>
                    <p className="text-white/90">Age-appropriate opportunities to serve others in the community</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-white">Seasonal Celebrations</h4>
                    <p className="text-white/90">Special events and traditions that mark the church year</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <h3 className="text-2xl font-bold text-white mb-6">Age Groups</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">Explorers (Age 4 - 2nd Grade)</h4>
                  <p className="text-white/90">Focus on basic Bible stories, simple crafts, and play-based learning</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">Navigators (3rd - 5th Grade)</h4>
                  <p className="text-white/90">Interactive Bible study, creative projects, and group discussions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Events Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 font-serif italic">Special Events & Activities</h2>
            <p className="mt-4 text-lg text-indigo-700">Fun and meaningful experiences throughout the year</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(77 124 15)' }}>
              <Calendar className="h-8 w-8 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">VBS & Summer Camps</h3>
              <p className="text-white/90">
                Week-long programs during summer featuring music, crafts, games, and Bible stories 
                in a fun, energetic environment.
              </p>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <Heart className="h-8 w-8 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Family Events</h3>
              <p className="text-white/90">
                Regular gatherings that bring families together for fellowship, service projects, 
                and celebration of special occasions.
              </p>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <BookOpen className="h-8 w-8 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Milestone Celebrations</h3>
              <p className="text-white/90">
                Special recognition of important moments in a child&apos;s faith journey, including 
                baptism preparation classes and milestone celebrations like promoting between grades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">Ready to Join Us?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Register your child for our Children&apos;s Ministry programs to ensure we have all the information needed to provide the best care and experience.
            </p>
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <h3 className="text-xl font-bold text-white mb-4">Children&apos;s Ministry Registration</h3>
              <p className="text-white/90 mb-4">
                Complete our online registration form to enroll your child in our nursery and children&apos;s programs.
              </p>
              <a 
                href="https://fccgranbury.breezechms.com/form/childrens-registration"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-teal-800 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-white"
              >
                Register Your Child
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 font-serif italic">Interested in Volunteering?</h2>
            <p className="text-xl text-indigo-700 mb-8 max-w-3xl mx-auto">
              We&apos;re always looking for caring adults who want to make a difference in the lives of our children and youth. Join our team of dedicated volunteers!
            </p>
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <h3 className="text-2xl font-bold text-white mb-4">Volunteer with Children & Youth</h3>
              <p className="text-white/90 mb-6 text-lg">
                Make a lasting impact on young lives by volunteering with our children&apos;s and youth ministries. 
                We have opportunities for every schedule and skill set.
              </p>
              <a 
                href="/children-youth-volunteer"
                className="inline-block bg-white text-red-600 hover:bg-white/10 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-white text-lg"
              >
                Learn How to Volunteer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">Get Involved</h2>
            <p className="text-xl text-white/80 mb-6">
              We welcome children and families to join our community of faith and discovery.
            </p>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <p className="text-lg text-white">
                <strong>Contact:</strong> Office at First Christian Church<br />
                <strong>Phone:</strong> (817) 573-5431<br />
                <strong>Email:</strong> office@fccgranbury.org
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
