import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  BookOpen, 
  HandHeart, 
  Users, 
  DollarSign,
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function FindingYourPlace() {
  const fiveThings = [
    {
      title: "Prayer & Worship",
      description: "Connect with God and our community through prayer and worship",
      icon: Heart,
      href: "/ministry-database?search=prayer",
      cardBg: "!bg-red-600",
      iconText: "text-red-600",
      iconHex: "#dc2626",
      bgInline: "#dc2626",
      textColor: "text-red-600",
      buttonText: "Explore Prayer & Worship",
      secondaryButtonText: "Need to Request Prayers?",
      secondaryButtonHref: "https://fccgranbury.breezechms.com/form/prayers",
      features: [
        "Prayer Groups",
        "Prayer Concerns List",
        "Weekly Worship Services"
      ],
      image: "/images/assorted-images/fcc-outdoor-worship.jpg"
    },
    {
      title: "Study",
      description: "Grow in faith through Bible study and learning",
      icon: BookOpen,
      href: "/ministry-database?search=discipleship",
      cardBg: "!bg-indigo-900",
      iconText: "text-indigo-900",
      iconHex: "#312e81",
      bgInline: "#312e81",
      textColor: "text-indigo-900",
      buttonText: "Explore Study Opportunities",
      features: [
        "Sunday School Classes",
        "Seasonal Bible Studies",
        "Small Group Studies"
      ],
      image: "/images/assorted-images/fcc-asset-group-learning.png"
    },
    {
      title: "Service",
      description: "Make a difference through serving others",
      icon: HandHeart,
      href: "/ministry-database?search=outreach",
      cardBg: "!bg-amber-500",
      iconText: "text-amber-500",
      iconHex: "#f59e0b",
      bgInline: "#f59e0b",
      textColor: "text-amber-500",
      buttonText: "Explore Opportunities to Serve",
      features: [
        "Community Partners",
        "Miracle Days",
        "Volunteer Opportunities"
      ],
      image: "/images/assorted-images/fcc-asset-volunteers-smiling.jpg"
    },
    {
      title: "Presence",
      description: "Build relationships through fellowship and community",
      icon: Users,
      href: "/ministry-database?search=fellowship",
      cardBg: "!bg-teal-800",
      iconText: "text-teal-800",
      iconHex: "#115e59",
      bgInline: "#115e59",
      textColor: "text-teal-800",
      buttonText: "Explore Opportunities to Connect",
      features: [
        "Fellowship Events",
        "Small Groups",
        "Community Gatherings"
      ],
      image: "/images/assorted-images/fcc-asset-women-ministry.JPG"
    },
    {
      title: "Generosity",
      description: "Share your resources to support our mission",
      icon: DollarSign,
      href: "/give",
      cardBg: "!bg-lime-700",
      iconText: "!text-lime-700",
      iconHex: "#4d7c0f",
      bgInline: "#4d7c0f",
      textColor: "text-lime-700",
      buttonText: "Learn More",
      features: [
        "Online Giving",
        "Stewardship Campaign",
        "Outreach Support"
      ],
      image: "/images/assorted-images/fcc-food-pantry-image-asset.jpeg"
    }
  ];

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 font-serif italic">
              Find Your Place Here
            </h2>
          <p className="text-xl text-indigo-900 max-w-3xl mx-auto">
            Discover the five areas of discipleship that help us grow in faith and serve our community.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {fiveThings.map((item, index) => (
              <Card key={index} className={`hover:shadow-lg transition-shadow w-full max-w-sm text-white ${item.cardBg} overflow-hidden border-0 py-0`} style={{ backgroundColor: (item as any).bgInline }}>
                <CardContent className="p-0 m-0">
                  {/* Image Section - Full width at top */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={(item as any).image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: item.title === "Presence" ? "center -40px" : 
                                       item.title === "Study" ? "center -70px" : 
                                       item.title === "Generosity" ? "center -25px" :
                                       "center center"
                      }}
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-full bg-white mr-4`}>
                        <item.icon className={`h-6 w-6 ${item.iconText}`} style={{ color: (item as any).iconHex }} />
                      </div>
                      <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                    </div>
                    
                    <p className="text-white mb-4 text-lg">{item.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-base text-white">
                          <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-3">
                      <Button asChild className={`w-full group bg-white border border-white hover:bg-white/10 hover:text-white transition-colors ${item.textColor}`}>
                        <Link href={item.href} className="transition-colors">
                          {item.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                      {(item as any).secondaryButtonText && (
                        <Button asChild variant="outline" className={`w-full group bg-transparent border-white text-white hover:bg-white hover:${item.textColor} transition-colors`}>
                          <Link href={(item as any).secondaryButtonHref} className="transition-colors">
                            {(item as any).secondaryButtonText}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-indigo-900 text-white hover:bg-indigo-700 hover:text-white border-0 transition-colors px-8 py-3 text-lg">
            <Link href="/ministry-database">
              Explore All FCC Ministries
            </Link>
          </Button>
        </div>
      {/* Safelist text color utilities for dynamic icon colors */}
      <div className="hidden text-red-600 text-indigo-900 text-amber-500 text-teal-800 text-lime-700"></div>
      </div>
    </section>
  );
}
