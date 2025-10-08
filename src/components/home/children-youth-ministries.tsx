'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Users, Heart, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function ChildrenYouthMinistries() {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const ministries = [
    {
      title: "Infants & Toddlers",
      description: "We provide a warm, safe, and nurturing environment for our youngest members. Our staffed nursery is available for children 3 and under. We also have a private mothers room if you need a quiet space with your little one.",
      icon: Baby,
      href: "/infants-toddlers",
      cardColor: "red-600",
      textColor: "text-red-600",
      ageRange: "Birth - 3 years",
      image: "/images/assorted-images/fcc-childrens-ministry-asset-a.png"
    },
    {
      title: "Children",
      description: "Children are welcome to worship along with the congregation. They may sit in the front left pews or with their families. After communion, we encourage the children to join us in the Children's Worship Center for a child-focused way to engage our theme for the day. For the Sunday School hour, our Pathfinders Kids Club encourages play and creativity.",
      icon: Users,
      href: "/children",
      cardColor: "teal-800",
      textColor: "text-teal-800",
      ageRange: "Age 4 through 5th grade",
      image: "/images/assorted-images/fcc-kids.jpg"
    },
    {
      title: "Students",
      description: "Our Chi-Rho program for middle schoolers and CYF program for high schoolers are where young disciples grow through love and service.",
      icon: Heart,
      href: "/youth",
      cardColor: "indigo-900",
      textColor: "text-indigo-900",
      ageRange: "6th through 12th grade",
      image: "/images/assorted-images/fcc-youth-mission-2.jpg"
    }
  ];

  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">
            Children & Youth Ministries
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            We believe that children and youth are not just the future of the church, 
            but an integral part of our community today. Our ministries are designed 
            to nurture faith at every stage of development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ministries.map((ministry, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-none max-w-md mx-auto md:max-w-none md:mx-0 overflow-hidden p-0 flex flex-col h-full group cursor-pointer" style={{ backgroundColor: ministry.cardColor === 'red-600' ? 'rgb(220 38 38)' : ministry.cardColor === 'teal-800' ? 'rgb(17 94 89)' : 'rgb(49 46 129)' }}>
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-full bg-white mr-4">
                    <ministry.icon className="h-8 w-8" style={{ color: ministry.textColor === 'text-red-600' ? '#dc2626' : ministry.textColor === 'text-teal-800' ? '#115e59' : '#312e81' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{ministry.title}</h3>
                    <p className="text-lg text-white/80">{ministry.ageRange}</p>
                  </div>
                </div>
                
                {expandedCards.has(index) && (
                  <p className="text-white mb-6 leading-relaxed text-lg">
                    {ministry.description}
                  </p>
                )}
                
                {expandedCards.has(index) ? (
                  <Button asChild variant="outline" className={`w-full group bg-white border border-white hover:bg-white/10 hover:text-white transition-colors ${ministry.textColor}`}>
                    <Link href={ministry.href} className="transition-colors">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" style={{ color: ministry.textColor === 'text-red-600' ? '#dc2626' : ministry.textColor === 'text-teal-800' ? '#115e59' : '#312e81' }} />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => toggleCard(index)}
                    className={`w-full group bg-white border border-white hover:bg-white/10 hover:text-white transition-colors ${ministry.textColor}`}
                  >
                    Learn More
                    <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" style={{ color: ministry.textColor === 'text-red-600' ? '#dc2626' : ministry.textColor === 'text-teal-800' ? '#115e59' : '#312e81' }} />
                  </Button>
                )}
              </CardContent>
              
              <div className="relative overflow-hidden">
                <Image
                  src={ministry.image}
                  alt={ministry.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
