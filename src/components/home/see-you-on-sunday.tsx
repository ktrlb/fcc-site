import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";

export function SeeYouOnSunday() {
  // This would typically come from your database
  const upcomingSunday = new Date();
  const nextSunday = new Date(upcomingSunday);
  nextSunday.setDate(upcomingSunday.getDate() + (7 - upcomingSunday.getDay()));

  const sermonSeries = {
    title: "Walking in Faith",
    description: "Join us as we explore what it means to walk in faith through life's challenges and triumphs.",
    image: "/images/sermon-series.svg",
    startDate: "January 2024",
    endDate: "March 2024"
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            See You On Sunday
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for worship, fellowship, and community as we gather together in faith.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Service Schedule */}
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Upcoming Sunday</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-semibold text-lg">9:00 AM Service</p>
                    <p className="text-gray-600">Traditional Worship</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-semibold text-lg">11:00 AM Service</p>
                    <p className="text-gray-600">Contemporary Worship</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-semibold text-lg">Location</p>
                    <p className="text-gray-600">2101 W US Hwy 377, Granbury, TX 76048</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Service:</strong> {nextSunday.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sermon Series */}
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Current Sermon Series</h3>
              </div>
              
              <div className="space-y-4">
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={sermonSeries.image}
                    alt={sermonSeries.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <h4 className="text-xl font-bold text-gray-900">{sermonSeries.title}</h4>
                <p className="text-gray-600">{sermonSeries.description}</p>
                
                <div className="text-sm text-gray-500">
                  <p>{sermonSeries.startDate} - {sermonSeries.endDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            View Full Calendar
          </Button>
        </div>
      </div>
    </section>
  );
}
