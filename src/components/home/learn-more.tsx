'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ImageCarousel } from "@/components/image-carousel";

export function LearnMore() {
  const coreValues = [
    {
      title: "Relationship",
      description: "All are welcome as we seek genuine connection with God and one another. We care for and respect each other more than we worry about our differences.",
      icon: Heart,
      image: "/images/assorted-images/fcc-asset-kitchen-smiling.jpeg"
    },
    {
      title: "Discipleship",
      description: "We seek to be remade in the image of Jesus as revealed through Holy Scripture and prayer, and to lead by example as we dedicate ourselves to his work of bringing wholeness to a fragmented world.",
      icon: BookOpen,
      image: "/images/assorted-images/fcc-service.jpg"
    },
    {
      title: "Humility",
      description: "Only God is God. We are imperfect people motivated by the sacrificial love of Jesus. It's not about us, but about working together to lift up hungry and hurting people.",
      icon: Users,
      image: "/images/assorted-images/fcc-mission-database-background-header.jpg"
    },
    {
      title: "Dignity",
      description: "Everyone is made in God's image, loved unconditionally by their Creator. Everyone. We seek to serve our community and world in ways that reveal the infinite value of each person.",
      icon: Clock,
      image: "/images/assorted-images/fcc-asset-easter-egg-hunt.jpeg"
    }
  ];

  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">
            Things to Know About FCC
          </h2>
          <p className="text-2xl text-white max-w-3xl mx-auto">
            Discover our mission, meet our team, and learn about our rich history in the Granbury community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <Card className="border-0 shadow-none overflow-hidden p-0 gap-0" style={{ backgroundColor: 'rgb(220 38 38)' }}>
            <CardContent className="p-0">
              <div className="p-8 pb-0">
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission is...</h3>
                
                <div className="space-y-3 text-center mb-6">
                  <p className="text-white text-xl leading-relaxed">
                    to share with <strong className="font-bold">ALL people</strong>
                  </p>
                  <p className="text-white text-xl leading-relaxed">
                    the unconditional love of God
                  </p>
                  <p className="text-white text-xl leading-relaxed">
                    that we experience in <em>Jesus Christ</em> our Lord.
                  </p>
                </div>
              </div>
              
              {/* Mission Images Carousel */}
              <ImageCarousel category="mission" height="aspect-[16/9]" />

            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="p-8 border-0 shadow-none" style={{ backgroundColor: 'rgb(17 94 89)' }}>
            <CardContent className="p-0">
              <h3 className="text-3xl font-bold text-white mb-6">Our Vision is...</h3>
              
              <div className="space-y-6">
                <p className="text-white text-xl">
                  to be a church that helps people <strong>COME ALIVE IN CHRIST</strong> by inviting them to reimagine church with us:
                </p>
                <div className="text-white space-y-4">
                  <p className="text-lg">
                    <span className="font-semibold text-white">Not pride and judgment,</span> but a sanctuary for restoring the soul – humble people sharing radical hospitality, and loving each other beyond our differences.
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-white">Not easy answers,</span> but growing together through shared engagement with the scriptures and the hard questions of life and faith.
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-white">Not a self-serving institution,</span> but a community in the community that truly sees our neighbor and that responds with the relational love of Christ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Our Core Values Are...</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              // Cycle through signature colors
              const colors = [
                { bg: 'red-600', text: 'text-red-600', hex: '#dc2626' },
                { bg: 'teal-800', text: 'text-teal-800', hex: '#115e59' },
                { bg: 'indigo-900', text: 'text-indigo-900', hex: '#312e81' },
                { bg: 'amber-500', text: 'text-amber-500', hex: '#f59e0b' }
              ];
              const colorScheme = colors[index % colors.length];
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-none py-0 overflow-hidden flex flex-col" style={{ backgroundColor: colorScheme.hex }}>
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Content Section */}
                    <div className="p-6 text-center flex-1">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white rounded-full">
                          <value.icon className="h-6 w-6" style={{ color: colorScheme.hex }} />
                        </div>
                      </div>
                      
                      <h4 className="text-2xl font-bold text-white mb-2">{value.title}</h4>
                      <p className="text-white text-lg">{value.description}</p>
                    </div>
                    
                    {/* Image Section - At Bottom */}
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={value.image}
                        alt={value.title}
                        fill
                        className="object-cover"
                        style={{
                          objectPosition: value.title === "Relationship" ? "center -25px" :
                                         value.title === "Dignity" ? "center -80px" :
                                         "center 30%"
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-indigo-900 text-white hover:bg-indigo-700 hover:text-white border-0 transition-colors px-8 py-3 text-lg">
            <Link href="/about">Learn More About Our Staff, History & Leadership</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
