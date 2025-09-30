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

export function FindingYourPlace() {
  const fiveThings = [
    {
      title: "Prayer",
      description: "Connect with God and our community through prayer",
      icon: Heart,
      href: "/ministry-database?search=prayer",
      cardBg: "!bg-red-600",
      iconText: "text-red-600",
      iconHex: "#dc2626",
      bgInline: "#dc2626",
      textColor: "text-red-600",
      buttonText: "Explore Prayer Ministries",
      features: [
        "Prayer Groups",
        "Prayer Concerns List",
        "Weekly Prayer Meetings"
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ];

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-indigo-900 mb-4 font-serif">
            Finding Your Place Here
          </h2>
          <p className="text-2xl text-indigo-900 max-w-3xl mx-auto">
            Discover the five areas of discipleship that help us grow in faith and serve our community.
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-stone-700 p-8 rounded-lg mb-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4 text-center">
              The Five Things
            </h3>
            <p className="text-xl text-white text-center max-w-4xl mx-auto">
              Each year, usually in October, we challenge each person in our church to assess where they are 
              in these five areas of discipleship. These are opportunities to give of our time, our love, 
              and our financial resources.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {fiveThings.map((item, index) => (
              <Card key={index} className={`p-6 hover:shadow-lg transition-shadow w-full max-w-sm text-white ${item.cardBg}`} style={{ backgroundColor: (item as any).bgInline }}>
                <CardContent className="p-0">
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
                  
                  <Button asChild className={`w-full group bg-white border border-white hover:bg-white/10 hover:text-white transition-colors ${item.textColor}`}>
                    <Link href={item.href} className="transition-colors">
                      {item.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-white hover:bg-emerald-100 text-stone-700 px-8 py-3">
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
