import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export function LearnMore() {
  const coreValues = [
    {
      title: "Relationship",
      description: "All are welcome as we seek genuine connection with God and one another. We care for and respect each other more than we worry about our differences.",
      icon: Heart
    },
    {
      title: "Discipleship",
      description: "We seek to be remade in the image of Jesus as revealed through Holy Scripture and prayer, and to lead by example as we dedicate ourselves to his work of bringing wholeness to a fragmented world.",
      icon: BookOpen
    },
    {
      title: "Humility",
      description: "Only God is God. We are imperfect people motivated by the sacrificial love of Jesus. It's not about us, but about working together to lift up hungry and hurting people.",
      icon: Users
    },
    {
      title: "Dignity",
      description: "Everyone is made in God's image, loved unconditionally by their Creator. Everyone. We seek to serve our community and world in ways that reveal the infinite value of each person.",
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
          {/* Mission */}
          <Card className="p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              
              <div className="space-y-6">
                <p className="text-gray-600 text-lg">
                  To share with ALL people the unconditional love of God that we experience in Jesus Christ our Lord.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              
              <div className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Our vision is to be a church that helps people <strong>COME ALIVE IN CHRIST</strong> by inviting them to reimagine church with us:
                </p>
                <div className="text-gray-600 space-y-4">
                  <p>
                    <span className="font-semibold text-gray-800">Not pride and judgment,</span> but a sanctuary for restoring the soul – humble people sharing radical hospitality, and loving each other beyond our differences.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Not easy answers,</span> but growing together through shared engagement with the scriptures and the hard questions of life and faith.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Not a self-serving institution,</span> but a community in the community that truly sees our neighbor and that responds with the relational love of Christ.
                  </p>
                </div>
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
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <Link href="/about">Learn More About Our Staff, History & Leadership</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
