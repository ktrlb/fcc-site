import { Card, CardContent } from "@/components/ui/card";
import { Baby, Shield, Clock, Users, Heart, Sun, Smile, ShieldCheck } from "lucide-react";

export default function InfantsToddlersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-800"
          style={{
            backgroundImage: "url(&apos;/images/nursery-ministry-background.jpeg&apos;)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Baby className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Infants & Toddlers Ministry
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Providing a safe, nurturing environment for our youngest members while supporting parents in worship and fellowship.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Mission & Values */}
        <section className="mb-24">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
                    The children&apos;s ministry of FCC Granbury will provide a safe and welcoming place where children begin to discover the love of Christ.
                  </p>

                  <div className="bg-pink-50 p-6 rounded-lg max-w-4xl mx-auto text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">We will do this by providing:</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li>• A comfortable and safe place, filled with kindness and joy.</li>
                    <li>• A loving place where we cherish every child, support every family, and every staff member.</li>
                    <li>• A beginning point of faith, where even the smallest hearts can start their journey with Jesus.</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Heart className="h-6 w-6 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Love</h4>
                        <p className="text-gray-600">Every child is a gift from God, therefore deserve unconditional love.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheck className="h-6 w-6 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Safety</h4>
                        <p className="text-gray-600">We aim to create a safe environment where all children, parents, and staff feel secure and confident.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Smile className="h-6 w-6 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Joy</h4>
                        <p className="text-gray-600">Our space is filled with the joy of laughter, songs, and the discovery of God.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sun className="h-6 w-6 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Wonder</h4>
                        <p className="text-gray-600">We plant seeds of faith through stories, songs, and prayers. Children are encouraged to ask questions and retell their own stories of faith.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Users className="h-6 w-6 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Community</h4>
                        <p className="text-gray-600">We support families, walking <em>WITH</em> them in faith and life.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Age Range</h3>
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600 mb-2">Birth - 3 Years</p>
                    <p className="text-gray-600">
                      Our nursery is specifically designed and staffed to care for infants and toddlers 
                      up to age 3, with age-appropriate activities and spaces.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Care Standards */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 mt-8">Care Standards & Policies</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Safety & Security</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• All nursery staff are background checked and trained</li>
                  <li>• Secure check-in/check-out system with name tags</li>
                  <li>• Age-appropriate toys and equipment regularly sanitized</li>
                  <li>• Emergency procedures and first aid training for all staff</li>
                  <li>• Limited access with security protocols</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 mb-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Clock className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Operating Hours</h3>
                </div>
                <div className="space-y-3 text-gray-600">
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
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What to Bring */}
        <section className="mb-24">
          <Card className="p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What to Bring</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">For Your Child</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Diapers and wipes</li>
                    <li>• Bottle or sippy cup (labeled with child&apos;s name)</li>
                    <li>• Change of clothes</li>
                    <li>• Comfort item (blanket, pacifier, small toy)</li>
                    <li>• Any special dietary needs or allergies</li>
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">We Provide</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Age-appropriate toys and activities</li>
                    <li>• Safe, clean environment</li>
                    <li>• Trained, loving caregivers</li>
                    <li>• Snacks (with parent permission)</li>
                    <li>• Quiet areas for naps</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Registration Section */}
        <section className="mb-24 mt-12">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Register Your Child?</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Complete our online registration form to enroll your child in our nursery program. This helps us provide the best care and ensure we have all the necessary information about your child.
                </p>
                <div className="bg-pink-50 p-8 rounded-lg max-w-2xl mx-auto mb-8">
                  <a 
                    href="https://fccgranbury.breezechms.com/form/childrens-registration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
                  >
                    Register Your Child
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="text-center mt-12">
          <Card className="p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions or Need More Information?</h2>
              <p className="text-xl text-gray-600 mb-6">
                We&apos;re here to help make your child&apos;s first church experiences positive and meaningful.
              </p>
              <div className="bg-pink-50 p-6 rounded-lg max-w-2xl mx-auto">
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
