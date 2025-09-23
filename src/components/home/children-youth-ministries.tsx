import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Users, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ChildrenYouthMinistries() {
  const ministries = [
    {
      title: "Infants & Toddlers",
      description: "We provide a warm, safe, and nurturing environment for our youngest members. Our staffed nursery is available for children 3 and under. We also have a private mothers room if you need a quiet space with your little one.",
      icon: Baby,
      href: "/children/infants-toddlers",
      color: "bg-red-100 text-red-600",
      ageRange: "Birth - 3 years"
    },
    {
      title: "Children",
      description: "Children are welcome to worship along with the congregation. They may sit in the front left pews or with their families. After communion, we encourage the children to join us in the Children's Worship Center for a child-focused way to engage our theme for the day. For the Sunday School hour, our Pathfinders Kids Club encourages play and creativity.",
      icon: Users,
      href: "/children/children",
      color: "bg-sky-50 text-indigo-900",
      ageRange: "Age 4 through 2nd grade"
    },
    {
      title: "Students",
      description: "Our Chi-Rho program for middle schoolers and CYF program for high schoolers are where young disciples grow through love and service.",
      icon: Heart,
      href: "/children/youth",
      color: "bg-orange-200 text-amber-500",
      ageRange: "6th through 12th grade"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Children & Youth Ministries
          </h2>
          <p className="text-xl text-stone-700 max-w-3xl mx-auto">
            We believe that children and youth are not just the future of the church, 
            but an integral part of our community today. Our ministries are designed 
            to nurture faith at every stage of development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ministries.map((ministry, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className={`p-4 rounded-full ${ministry.color} mr-4`}>
                    <ministry.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900">{ministry.title}</h3>
                    <p className="text-sm text-stone-600">{ministry.ageRange}</p>
                  </div>
                </div>
                
                <p className="text-stone-600 mb-6 leading-relaxed">
                  {ministry.description}
                </p>
                
                <Button asChild variant="outline" className="w-full group">
                  <Link href={ministry.href}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
