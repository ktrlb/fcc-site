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
      href: "/prayer",
      color: "bg-red-50 text-red-600",
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
      href: "/study",
      color: "bg-blue-50 text-blue-600",
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
      href: "/service",
      color: "bg-green-50 text-green-600",
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
      href: "/presence",
      color: "bg-purple-50 text-purple-600",
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
      color: "bg-yellow-50 text-yellow-600",
      features: [
        "Online Giving",
        "Stewardship Campaign",
        "Outreach Support"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            Finding Your Place Here
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the five areas of discipleship that help us grow in faith and serve our community.
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-blue-50 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              The Five Things
            </h3>
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
              Each year, usually in October, we challenge each person in our church to assess where they are 
              in these five areas of discipleship. These are opportunities to give of our time, our love, 
              and our financial resources.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {fiveThings.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow w-full max-w-sm">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${item.color} mr-4`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {item.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild variant="outline" className="w-full group">
                    <Link href={item.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <Link href="/ministry-database">
              Explore All FCC Ministries
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
