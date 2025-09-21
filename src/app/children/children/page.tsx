import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Heart, Music, Gamepad2, Calendar } from "lucide-react";

export default function ChildrenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
            <div 
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"
              style={{
                backgroundImage: "url(&apos;/images/childrens-header-background.jpeg&apos;)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
            <div className="relative flex items-center justify-center h-full">
              <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Users className="h-16 w-16 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Children&apos;s Ministry
                </h1>
                <p className="text-xl text-white max-w-3xl mx-auto">
                  Nurturing young hearts and minds in faith through worship, learning, and community.
                </p>
              </div>
            </div>
          </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Philosophy Section */}
        <section className="mb-24">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Philosophy on Faith Development</h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  We believe that children are capable of deep spiritual understanding and meaningful faith experiences. 
                  Our approach combines age-appropriate learning with authentic worship, recognizing that children 
                  learn best through stories, play, music, and relationships.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Love-Centered</h3>
                  <p className="text-gray-600">
                    Every interaction is rooted in God&apos;s unconditional love, helping children 
                    understand they are beloved children of God.
                  </p>
                </div>
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Story-Based</h3>
                  <p className="text-gray-600">
                    We use biblical stories and modern parables to help children connect 
                    timeless truths to their daily experiences.
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Community-Focused</h3>
                  <p className="text-gray-600">
                    Children learn faith in relationship with others, building connections 
                    with peers, mentors, and the broader church family.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Worship Experience */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 mt-8">Sunday Worship Experience</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Music className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Main Worship Service</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Children are welcome and encouraged to participate in our main worship services. 
                  We believe that worshiping together as a family creates lasting memories and 
                  spiritual connections.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Children&apos;s bulletins and activity pages</li>
                  <li>• Special seating area in the front left pews</li>
                  <li>• Child-friendly worship elements</li>
                  <li>• Quiet activities available for younger children</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Heart className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Children&apos;s Worship Center</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  After communion, children ages 4-12 are invited to our Children&apos;s Worship Center 
                  for a child-focused exploration of the day&apos;s theme.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Interactive storytelling and drama</li>
                  <li>• Hands-on activities and crafts</li>
                  <li>• Age-appropriate discussions</li>
                  <li>• Creative expression through art and music</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pathfinders Kids Club */}
        <section className="mb-24">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <Gamepad2 className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Pathfinders Kids Club</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our Sunday School program focuses on play, creativity, and relationship-building 
                  as the foundation for spiritual growth.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Program Features</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Creative Play</h4>
                        <p className="text-gray-600">Learning through games, crafts, and imaginative activities</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Small Group Relationships</h4>
                        <p className="text-gray-600">Building friendships with peers and caring adult mentors</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Service Projects</h4>
                        <p className="text-gray-600">Age-appropriate opportunities to serve others in the community</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Seasonal Celebrations</h4>
                        <p className="text-gray-600">Special events and traditions that mark the church year</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Age Groups</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Explorers (Age 4 - 2nd Grade)</h4>
                      <p className="text-gray-600">Focus on basic Bible stories, simple crafts, and play-based learning</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Navigators (3rd - 5th Grade)</h4>
                      <p className="text-gray-600">Interactive Bible study, creative projects, and group discussions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Special Events */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 mt-8">Special Events & Activities</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <Calendar className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">VBS & Summer Camps</h3>
                <p className="text-gray-600">
                  Week-long programs during summer featuring music, crafts, games, and Bible stories 
                  in a fun, energetic environment.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <Heart className="h-8 w-8 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Family Events</h3>
                <p className="text-gray-600">
                  Regular gatherings that bring families together for fellowship, service projects, 
                  and celebration of special occasions.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Milestone Celebrations</h3>
                <p className="text-gray-600">
                  Special recognition of important moments in a child&apos;s faith journey, including 
                  baptism preparation classes and milestone celebrations like promoting between grades.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Registration Section */}
        <section className="mb-12">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join Us?</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Register your child for our Children&apos;s Ministry programs to ensure we have all the information needed to provide the best care and experience.
                </p>
                <div className="bg-blue-50 p-6 rounded-lg max-w-2xl mx-auto mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Children&apos;s Ministry Registration</h3>
                  <p className="text-gray-700 mb-4">
                    Complete our online registration form to enroll your child in our nursery and children&apos;s programs.
                  </p>
                  <a 
                    href="https://fccgranbury.breezechms.com/form/childrens-registration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Register Your Child
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="text-center mb-24 mt-12">
          <Card className="p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Involved</h2>
              <p className="text-xl text-gray-600 mb-6">
                We welcome children and families to join our community of faith and discovery.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg max-w-2xl mx-auto">
                <p className="text-lg text-gray-700">
                  <strong>Contact:</strong> Office at First Christian Church<br />
                  <strong>Phone:</strong> (817) 573-5431<br />
                  <strong>Email:</strong> office@fccgranbury.org
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
