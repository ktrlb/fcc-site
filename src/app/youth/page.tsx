import { Card, CardContent } from "@/components/ui/card";
import { Heart, Mountain, Users, Calendar, MapPin, Star } from "lucide-react";

export default function YouthPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/youth-header-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center calc(50% + 50px)",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(68 64 60, 0.7)' }}></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Youth Ministry
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Chi-Rho (6th-8th grade) and CYF - Christian Youth Fellowship (9th-12th grade) programs where young disciples grow through love and service.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-serif">Our Youth Programs</h2>
            <p className="mt-4 text-xl text-white/80 max-w-4xl mx-auto">
              Our youth ministry creates spaces where young people can explore their faith, 
              build meaningful relationships, and discover their calling to serve others. 
              Through authentic community and hands-on experiences, we help youth develop 
              into confident, compassionate disciples of Christ.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <h3 className="text-2xl font-bold text-white mb-4">Chi-Rho (6th through 8th grade)</h3>
              <p className="text-white/90 mb-4 text-lg">
                A time of exploration and growth as young people begin to 
                form their own faith identity and values.
              </p>
              <ul className="space-y-2 text-white/90 text-lg">
                <li>• Weekly gatherings with games, discussion, and fellowship</li>
                <li>• Service projects in the local community</li>
                <li>• Weekend retreats and day trips</li>
                <li>• Mentorship relationships with older youth and adults</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(77 124 15)' }}>
              <h3 className="text-2xl font-bold text-white mb-4">CYF - Christian Youth Fellowship (9th through 12th grade)</h3>
              <p className="text-white/90 mb-4 text-lg">
                A time of deepening faith and preparing for life beyond high school, 
                with opportunities for leadership and service.
              </p>
              <ul className="space-y-2 text-white/90 text-lg">
                <li>• Weekly gatherings with deeper theological discussions</li>
                <li>• Leadership roles in church and community</li>
                <li>• Mission trips and service immersion experiences</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Youth Gatherings Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 font-serif">Youth Gatherings</h2>
            <p className="mt-4 text-lg text-indigo-700">Regular opportunities for fellowship and growth</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-white mr-3" />
                <h3 className="text-xl font-bold text-white">Weekly Schedule</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-white">Sunday School</p>
                  <p className="text-white/90">Sunday mornings from 10:00 - 11:00 AM</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Wednesday Youth Group</p>
                  <p className="text-white/90">Wednesday evenings from 5:30 - 7:00 PM (dinner included)</p>
                </div>
                <p className="text-white/90">
                  Weekly gatherings include games, worship, Bible study, discussion, and fellowship. 
                  Each week focuses on relevant topics that help youth navigate their faith in everyday life.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-white mr-3" />
                <h3 className="text-xl font-bold text-white">Special Events</h3>
              </div>
              <ul className="space-y-3 text-white/90">
                <li>• Service projects and community outreach</li>
                <li>• Campouts, retreats and lock-ins</li>
                <li>• Seasonal celebrations and traditions</li>
                <li>• Intergenerational events with the church family</li>
                <li>• Social events and recreational activities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Opportunities Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white font-serif">Service Opportunities</h2>
            <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
              Hands-on service experiences that help youth grow in faith and compassion while learning 
              practical ways to make a difference in their communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <h3 className="text-2xl font-bold text-white mb-6">Summer Service Trips</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-white mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Chi-Rho Service Trip</h4>
                    <p className="text-white/90">Annual summer trip for middle school students to focus on service opportunities and learn ways to bring meaningful service back home.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-white mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">CYF Service Trip</h4>
                    <p className="text-white/90">Annual summer trip for high school students to engage in deeper service work and develop leadership skills in community outreach.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(245 158 11)' }}>
              <h3 className="text-2xl font-bold text-white mb-6">Local Service Days</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-white mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Regular Service Projects</h4>
                    <p className="text-white/90">Monthly opportunities to serve in our local community through various organizations and causes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-white mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Community Partnerships</h4>
                    <p className="text-white/90">Building ongoing relationships with local organizations to create lasting impact in our community.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Camps & Retreats Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 font-serif">Camps & Retreats</h2>
            <p className="mt-4 text-lg text-indigo-700">Special experiences for spiritual growth and community building</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(77 124 15)' }}>
              <Mountain className="h-8 w-8 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Summer Camp</h3>
              <p className="text-white/90 mb-4">
                Week-long residential camp experience with outdoor activities, worship, 
                Bible study, and community building.
              </p>
              <ul className="space-y-1 text-base text-white/90">
                <li>• Ages 12-18</li>
                <li>• Multiple session options</li>
                <li>• Scholarships available</li>
              </ul>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(113 78 145)' }}>
              <Star className="h-8 w-8 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Weekend Retreats</h3>
              <p className="text-white/90 mb-4">
                Quarterly retreats focusing on specific themes like leadership, 
                discipleship, service, and spiritual growth.
              </p>
              <ul className="space-y-1 text-base text-white/90">
                <li>• Friday evening - Sunday morning</li>
                <li>• Age-appropriate programming</li>
                <li>• Guest speakers and workshops</li>
              </ul>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <Users className="h-8 w-8 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Leadership Retreats</h3>
              <p className="text-white/90 mb-4">
                Special opportunities for older youth to develop leadership skills 
                and take on mentoring roles with younger students.
              </p>
              <ul className="space-y-1 text-base text-white/90">
                <li>• High school juniors and seniors</li>
                <li>• Leadership training curriculum</li>
                <li>• Mentorship program</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <h3 className="text-xl font-bold text-white mb-3">Partner Camp: Disciples Crossing</h3>
              <p className="text-white/90 mb-4">
                We regularly support and attend camps at Disciples Crossing in Athens, TX. 
                Their summer camps and retreats provide excellent opportunities for spiritual growth and community building.
              </p>
              <a 
                href="https://disciplescrossing.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-teal-800 hover:bg-white/10 hover:text-white font-semibold py-2 px-6 rounded-lg transition-colors border border-white"
              >
                Learn More & Register for Camps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Involved Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-serif">Getting Involved</h2>
            <p className="mt-4 text-lg text-white/80">Ways to participate in our youth community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <h3 className="text-xl font-bold text-white mb-4">For Youth</h3>
              <ul className="space-y-3 text-white/90">
                <li>• Join us for Sunday School and Wednesday youth group</li>
                <li>• Participate in service projects and summer trips</li>
                <li>• Attend camps and retreats throughout the year</li>
                <li>• Take on leadership roles as you grow in the program</li>
                <li>• Build lasting friendships with peers who share your values</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <h3 className="text-xl font-bold text-white mb-4">For Parents</h3>
              <ul className="space-y-3 text-white/90">
                <li>• Stay informed through regular communication</li>
                <li>• Volunteer as chaperones for events and trips</li>
                <li>• Support fundraising efforts for service trips and camps</li>
                <li>• Pray for our youth and the ministry programs</li>
                <li>• Encourage your youth&apos;s participation and growth</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(245 158 11)' }}>
              <h3 className="text-xl font-bold text-white mb-4">For Volunteers</h3>
              <ul className="space-y-3 text-white/90 mb-6">
                <li>• Teach Sunday School classes</li>
                <li>• Provide meals for Wednesday youth events</li>
                <li>• Volunteer at camps and retreats</li>
                <li>• Mentor youth in their faith journey</li>
                <li>• Contact Austin to learn more about opportunities</li>
              </ul>
              <a 
                href="/children-youth-volunteer"
                className="inline-block bg-white text-amber-500 hover:bg-white/10 hover:text-white font-semibold py-2 px-6 rounded-lg transition-colors border border-white"
              >
                Learn How to Volunteer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-900 font-serif mb-4">Join Our Youth Community</h2>
            <p className="text-xl text-indigo-700 mb-6">
              We&apos;re excited to welcome new youth and families into our community of faith, service, and growth.
            </p>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(77 124 15)' }}>
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
