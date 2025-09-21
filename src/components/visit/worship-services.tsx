import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

export function WorshipServices() {
  const regularServices = [
    {
      time: "9:00 AM",
      name: "Modern Worship",
      description: "A contemporary worship experience with modern music and casual atmosphere"
    },
    {
      time: "10:00 AM", 
      name: "Sunday School",
      description: "Sunday School for all ages - children, youth, and adults"
    },
    {
      time: "11:00 AM", 
      name: "Traditional Worship",
      description: "A more traditional worship experience with hymns and liturgy"
    }
  ];

  const specialServices = [
    "Outdoor Worship",
    "Candlelight Christmas Eve",
    "VBS Sunday", 
    "Christmas Cantata",
    "Children's Christmas Pageant"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">About Worship Services</h2>
          <p className="mt-4 text-lg text-gray-600">Join us for meaningful worship experiences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Regular Services */}
          <div className="px-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Regular Services</h3>
            <div className="space-y-6">
              {regularServices.map((service, index) => (
                <Card key={index} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-xl font-semibold text-gray-900">{service.time}</h4>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Weekly
                          </span>
                        </div>
                        <h5 className="text-lg font-medium text-gray-900 mb-2">{service.name}</h5>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Special Services */}
          <div className="px-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Special Services</h3>
            <Card className="p-4">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Throughout the Year</h4>
                    <p className="text-gray-600 mb-4">
                      We celebrate special occasions and seasons with unique worship experiences:
                    </p>
                    <ul className="space-y-2">
                      {specialServices.map((service, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
}
