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
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-serif">About Worship Services</h2>
          <p className="mt-4 text-lg text-white">Join us for meaningful worship experiences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Regular Services */}
          <div className="px-2">
            <h3 className="text-2xl font-bold text-white mb-6 font-serif">Regular Services</h3>
            <div className="space-y-6">
              {regularServices.map((service, index) => {
                // Cycle through signature colors
                const colors = [
                  { bg: 'red-600', text: 'text-red-600', hex: '#dc2626' },
                  { bg: 'teal-800', text: 'text-teal-800', hex: '#115e59' },
                  { bg: 'indigo-900', text: 'text-indigo-900', hex: '#312e81' }
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <Card key={index} className="p-4 border-0 shadow-none" style={{ backgroundColor: colorScheme.hex }}>
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6" style={{ color: colorScheme.hex }} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-xl font-semibold text-white">{service.time}</h4>
                            <span className="bg-white text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                              Weekly
                            </span>
                          </div>
                          <h5 className="text-lg font-medium text-white mb-2">{service.name}</h5>
                          <p className="text-white">{service.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Special Services */}
          <div className="px-2">
            <h3 className="text-2xl font-bold text-white mb-6 font-serif">Special Services</h3>
            <Card className="p-4 border-0 shadow-none" style={{ backgroundColor: 'rgb(245 158 11)' }}>
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6" style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Throughout the Year</h4>
                    <p className="text-white mb-4">
                      We celebrate special occasions and seasons with unique worship experiences:
                    </p>
                    <ul className="space-y-2">
                      {specialServices.map((service, index) => (
                        <li key={index} className="flex items-center text-white">
                          <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
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
