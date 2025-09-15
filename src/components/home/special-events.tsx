import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Calendar, Download } from "lucide-react";

export function SpecialEvents() {
  // This would typically come from your database
  const specialEvents = [
    {
      id: 1,
      title: "Easter Celebration",
      date: "March 31, 2024",
      description: "Join us for our special Easter service and community celebration.",
      type: "Holiday"
    },
    {
      id: 2,
      title: "Community Food Drive",
      date: "April 15, 2024",
      description: "Help us serve our community by donating non-perishable food items.",
      type: "Service"
    },
    {
      id: 3,
      title: "Youth Group Retreat",
      date: "May 10-12, 2024",
      description: "A weekend of fellowship, worship, and fun for our youth.",
      type: "Youth"
    }
  ];

  const regularGroups = [
    "Sunday School Classes",
    "Bible Study Groups",
    "Prayer Groups",
    "Women's Fellowship",
    "Men's Ministry",
    "Youth Group",
    "Children's Ministry"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            Special Events & Seasonal Guide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected with our community through special events and regular fellowship opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Seasonal Guide */}
          <Card className="lg:col-span-2 p-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Seasonal Guide</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Download our comprehensive seasonal guide to stay informed about upcoming events, 
                  special services, and community activities throughout the year.
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">What&apos;s Inside:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Special service schedules</li>
                    <li>• Community outreach opportunities</li>
                    <li>• Fellowship events</li>
                    <li>• Study group schedules</li>
                    <li>• Volunteer opportunities</li>
                  </ul>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download Seasonal Guide (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Regular Groups */}
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Regular Groups</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Join one of our many regular groups that meet throughout the week.
                </p>
                
                <ul className="space-y-3">
                  {regularGroups.map((group, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {group}
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Groups
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special Events Highlight */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Upcoming Special Events</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialEvents.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-600">{event.type}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <p className="text-sm font-semibold text-gray-500">{event.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="mr-4">
            View Full Calendar
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Join a Group
          </Button>
        </div>
      </div>
    </section>
  );
}
