import { Card, CardContent } from "@/components/ui/card";
import { Heart, Mountain, Users, Calendar, MapPin, Star } from "lucide-react";

export default function YouthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
            <div 
              className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600"
              style={{
                backgroundImage: "url(&apos;/images/youth-header-background.jpg&apos;)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
            <div className="relative flex items-center justify-center h-full">
              <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Heart className="h-16 w-16 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Youth Ministry
                </h1>
                <p className="text-xl text-white max-w-3xl mx-auto">
                  Chi-Rho (6th-8th grade) and CYF - Christian Youth Fellowship (9th-12th grade) programs where young disciples grow through love and service.
                </p>
              </div>
            </div>
          </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Program Overview */}
        <section className="mb-24">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Youth Programs</h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Our youth ministry creates spaces where young people can explore their faith, 
                  build meaningful relationships, and discover their calling to serve others. 
                  Through authentic community and hands-on experiences, we help youth develop 
                  into confident, compassionate disciples of Christ.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Chi-Rho (6th through 8th grade)</h3>
                  <p className="text-gray-600 mb-4">
                    A time of exploration and growth as young people begin to 
                    form their own faith identity and values.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Weekly gatherings with games, discussion, and fellowship</li>
                    <li>• Service projects in the local community</li>
                    <li>• Weekend retreats and day trips</li>
                    <li>• Mentorship relationships with older youth and adults</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">CYF - Christian Youth Fellowship (9th through 12th grade)</h3>
                  <p className="text-gray-600 mb-4">
                    A time of deepening faith and preparing for life beyond high school, 
                    with opportunities for leadership and service.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Weekly gatherings with deeper theological discussions</li>
                    <li>• Leadership roles in church and community</li>
                    <li>• Mission trips and service immersion experiences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Weekly Gatherings */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 mt-8">Youth Gatherings</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Weekly Schedule</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Sunday School</p>
                    <p className="text-gray-600">Sunday mornings from 10:00 - 11:00 AM</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Wednesday Youth Group</p>
                    <p className="text-gray-600">Wednesday evenings from 5:30 - 7:00 PM (dinner included)</p>
                  </div>
                  <p className="text-gray-600">
                    Weekly gatherings include games, worship, Bible study, discussion, and fellowship. 
                    Each week focuses on relevant topics that help youth navigate their faith in everyday life.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Special Events</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• Service projects and community outreach</li>
                  <li>• Campouts, retreats and lock-ins</li>
                  <li>• Seasonal celebrations and traditions</li>
                  <li>• Intergenerational events with the church family</li>
                  <li>• Social events and recreational activities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Service Opportunities */}
        <section className="mb-24">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <Heart className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Opportunities</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Hands-on service experiences that help youth grow in faith and compassion while learning 
                  practical ways to make a difference in their communities.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Summer Service Trips</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Users className="h-6 w-6 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Chi-Rho Service Trip</h4>
                        <p className="text-gray-600">Annual summer trip for middle school students to focus on service opportunities and learn ways to bring meaningful service back home.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-6 w-6 text-blue-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">CYF Service Trip</h4>
                        <p className="text-gray-600">Annual summer trip for high school students to engage in deeper service work and develop leadership skills in community outreach.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Local Service Days</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-purple-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Regular Service Projects</h4>
                        <p className="text-gray-600">Monthly opportunities to serve in our local community through various organizations and causes.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Star className="h-6 w-6 text-orange-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Community Partnerships</h4>
                        <p className="text-gray-600">Building ongoing relationships with local organizations to create lasting impact in our community.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Camps & Retreats */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 mt-8">Camps & Retreats</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <Mountain className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Summer Camp</h3>
                <p className="text-gray-600 mb-4">
                  Week-long residential camp experience with outdoor activities, worship, 
                  Bible study, and community building.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Ages 12-18</li>
                  <li>• Multiple session options</li>
                  <li>• Scholarships available</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <Star className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Weekend Retreats</h3>
                <p className="text-gray-600 mb-4">
                  Quarterly retreats focusing on specific themes like leadership, 
                  discipleship, service, and spiritual growth.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Friday evening - Sunday morning</li>
                  <li>• Age-appropriate programming</li>
                  <li>• Guest speakers and workshops</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <Users className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership Retreats</h3>
                <p className="text-gray-600 mb-4">
                  Special opportunities for older youth to develop leadership skills 
                  and take on mentoring roles with younger students.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• High school juniors and seniors</li>
                  <li>• Leadership training curriculum</li>
                  <li>• Mentorship program</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Partner Camp: Disciples Crossing</h3>
                <p className="text-gray-700 mb-4">
                  We regularly support and attend camps at Disciples Crossing in Athens, TX. 
                  Their summer camps and retreats provide excellent opportunities for spiritual growth and community building.
                </p>
                <a 
                  href="https://disciplescrossing.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Learn More & Register for Camps
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Getting Involved */}
        <section className="mb-12">
          <Card className="p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Getting Involved</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">For Youth</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Join us for Sunday School and Wednesday youth group</li>
                    <li>• Participate in service projects and summer trips</li>
                    <li>• Attend camps and retreats throughout the year</li>
                    <li>• Take on leadership roles as you grow in the program</li>
                    <li>• Build lasting friendships with peers who share your values</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">For Parents</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Stay informed through regular communication</li>
                    <li>• Volunteer as chaperones for events and trips</li>
                    <li>• Support fundraising efforts for service trips and camps</li>
                    <li>• Pray for our youth and the ministry programs</li>
                    <li>• Encourage your youth&apos;s participation and growth</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">For Volunteers</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Teach Sunday School classes</li>
                    <li>• Provide meals for Wednesday youth events</li>
                    <li>• Volunteer at camps and retreats</li>
                    <li>• Mentor youth in their faith journey</li>
                    <li>• Contact Austin to learn more about opportunities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="text-center mb-24 mt-12">
          <Card className="p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Youth Community</h2>
              <p className="text-xl text-gray-600 mb-6">
                We&apos;re excited to welcome new youth and families into our community of faith, service, and growth.
              </p>
              <div className="bg-green-50 p-6 rounded-lg max-w-2xl mx-auto">
                <p className="text-lg text-gray-700">
                  <strong>Contact:</strong> Office at First Christian Church<br />
                  <strong>Phone:</strong> (817) 573-5431<br />
                  <strong>Email:</strong> office@fccgranbury.org<br />
                  <strong>Youth Pastor:</strong> Available for questions and guidance
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
