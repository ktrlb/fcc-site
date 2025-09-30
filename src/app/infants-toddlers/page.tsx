import { Card, CardContent } from "@/components/ui/card";
import { Baby, Shield, Clock, Users, Heart, Sun, Smile, ShieldCheck } from "lucide-react";

export default function InfantsToddlersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/nursery-ministry-background.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center calc(50% + 60px)",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(68 64 60, 0.7)' }}></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Baby className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">
              Infants & Toddlers Ministry
            </h1>
            <p className="text-2xl text-white max-w-3xl mx-auto">
              Providing a safe, nurturing environment for our youngest members while supporting parents in worship and fellowship.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-serif">Our Mission</h2>
            <p className="mt-4 text-lg text-white/80 max-w-4xl mx-auto">
              The children&apos;s ministry of FCC Granbury will provide a safe and welcoming place where children begin to discover the love of Christ.
            </p>
          </div>

          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
            <h3 className="text-lg font-semibold text-white mb-4">We will do this by providing:</h3>
            <ul className="space-y-3 text-white">
              <li>• A comfortable and safe place, filled with kindness and joy.</li>
              <li>• A loving place where we cherish every child, support every family, and every staff member.</li>
              <li>• A beginning point of faith, where even the smallest hearts can start their journey with Jesus.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 font-serif">Our Values</h2>
            <p className="mt-4 text-lg text-indigo-700">The principles that guide our ministry</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Heart className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-indigo-900">Love</h4>
                    <p className="text-indigo-700">Every child is a gift from God, therefore deserve unconditional love.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-teal-800 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-indigo-900">Safety</h4>
                    <p className="text-indigo-700">We aim to create a safe environment where all children, parents, and staff feel secure and confident.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Smile className="h-6 w-6 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-indigo-900">Joy</h4>
                    <p className="text-indigo-700">Our space is filled with the joy of laughter, songs, and the discovery of God.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Sun className="h-6 w-6 text-lime-700 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-indigo-900">Wonder</h4>
                    <p className="text-indigo-700">We plant seeds of faith through stories, songs, and prayers. Children are encouraged to ask questions and retell their own stories of faith.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-6 w-6 text-indigo-900 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-indigo-900">Community</h4>
                    <p className="text-indigo-700">We support families, walking <em>WITH</em> them in faith and life.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-6">Age Range</h3>
              <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
                <p className="text-2xl font-bold text-white mb-2">Birth - 3 Years</p>
                <p className="text-white/90">
                  Our nursery is specifically designed and staffed to care for infants and toddlers 
                  up to age 3, with age-appropriate activities and spaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Standards Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-serif">Care Standards & Policies</h2>
            <p className="mt-4 text-lg text-white/80">Ensuring the safety and well-being of every child</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-white mr-3" />
                <h3 className="text-xl font-bold text-white">Safety & Security</h3>
              </div>
              <ul className="space-y-3 text-white/90">
                <li>• All nursery staff are background checked and trained</li>
                <li>• Secure check-in/check-out system with name tags</li>
                <li>• Age-appropriate toys and equipment regularly sanitized</li>
                <li>• Emergency procedures and first aid training for all staff</li>
                <li>• Limited access with security protocols</li>
              </ul>
            </div>

            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(245 158 11)' }}>
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-white mr-3" />
                <h3 className="text-xl font-bold text-white">Operating Hours</h3>
              </div>
              <div className="space-y-3 text-white/90">
                <div>
                  <p className="font-semibold">Sunday Services:</p>
                  <p>9:00 AM - 12:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Special Events:</p>
                  <p>Available during church-wide events and activities</p>
                </div>
                <div>
                  <p className="font-semibold">Holiday Services:</p>
                  <p>Extended hours during Christmas and Easter seasons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 font-serif">What to Bring</h2>
            <p className="mt-4 text-lg text-indigo-700">Preparing for your child's visit</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <h3 className="text-xl font-bold text-white mb-4">For Your Child</h3>
              <ul className="space-y-2 text-white/90">
                <li>• Diapers and wipes</li>
                <li>• Bottle or sippy cup (labeled with child&apos;s name)</li>
                <li>• Change of clothes</li>
                <li>• Comfort item (blanket, pacifier, small toy)</li>
                <li>• Any special dietary needs or allergies</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <h3 className="text-xl font-bold text-white mb-4">We Provide</h3>
              <ul className="space-y-2 text-white/90">
                <li>• Age-appropriate toys and activities</li>
                <li>• Safe, clean environment</li>
                <li>• Trained, loving caregivers</li>
                <li>• Snacks (with parent permission)</li>
                <li>• Quiet areas for naps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white font-serif mb-4">Ready to Register Your Child?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Complete our online registration form to enroll your child in our nursery program. This helps us provide the best care and ensure we have all the necessary information about your child.
            </p>
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <a 
                href="https://fccgranbury.breezechms.com/form/childrens-registration"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-indigo-900 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg border border-white"
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
            <h2 className="text-3xl font-bold text-indigo-900 font-serif mb-4">Interested in Volunteering?</h2>
            <p className="text-xl text-indigo-700 mb-8 max-w-3xl mx-auto">
              We&apos;re always looking for caring adults who want to make a difference in the lives of our children and youth. Join our team of dedicated volunteers!
            </p>
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <h3 className="text-2xl font-bold text-white mb-4">Volunteer with Children & Youth</h3>
              <p className="text-white/90 mb-6 text-lg">
                Make a lasting impact on young lives by volunteering with our children&apos;s and youth ministries. 
                We have opportunities for every schedule and skill set.
              </p>
              <a 
                href="/children-youth-volunteer"
                className="inline-block bg-white text-teal-800 hover:bg-white/10 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-white text-lg"
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
            <h2 className="text-3xl font-bold text-white font-serif mb-4">Questions or Need More Information?</h2>
            <p className="text-xl text-white/80 mb-6">
              We&apos;re here to help make your child&apos;s first church experiences positive and meaningful.
            </p>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
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
