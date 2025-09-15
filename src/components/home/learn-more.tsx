import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export function LearnMore() {
  const coreValues = [
    {
      title: "Faith",
      description: "We believe in the power of faith to transform lives and communities.",
      icon: Heart
    },
    {
      title: "Community",
      description: "Building meaningful relationships and supporting one another in our journey.",
      icon: Users
    },
    {
      title: "Service",
      description: "Serving others with love, compassion, and dedication to making a difference.",
      icon: BookOpen
    },
    {
      title: "Growth",
      description: "Continuous spiritual growth through study, prayer, and fellowship.",
      icon: Clock
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            Learn More About FCC
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our mission, meet our team, and learn about our rich history in the Granbury community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Mission, Vision, Values */}
          <Card className="p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Foundation</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Mission Statement</h4>
                  <p className="text-gray-600">
                    To be a welcoming community of faith that nurtures spiritual growth, 
                    builds meaningful relationships, and serves our neighbors with love and compassion.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Vision Statement</h4>
                  <p className="text-gray-600">
                    To be a beacon of hope and transformation in Granbury, inspiring all to 
                    live lives of purpose, service, and faith.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild className="w-full">
                  <Link href="/about">Learn More About Our Mission</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Staff & History */}
          <Card className="p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Community</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Meet Our Staff</h4>
                  <p className="text-gray-600">
                    Get to know our dedicated pastoral team and staff who serve our community 
                    with passion and commitment.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Our History</h4>
                  <p className="text-gray-600">
                    Discover our rich heritage and the journey that has brought us to where 
                    we are today in the Granbury community.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/about#staff">Meet Our Staff</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/about#history">Our History</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <value.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Learn More About FCC
          </Button>
        </div>
      </div>
    </section>
  );
}
