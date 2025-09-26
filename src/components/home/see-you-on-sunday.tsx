import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { getFeaturedSermonSeries } from "@/lib/content-queries";

export async function SeeYouOnSunday() {
  // This would typically come from your database
  const upcomingSunday = new Date();
  const nextSunday = new Date(upcomingSunday);
  nextSunday.setDate(upcomingSunday.getDate() + (7 - upcomingSunday.getDay()));

  // Get featured sermon series from database
  const sermonSeries = await getFeaturedSermonSeries();

  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">
            See You On Sunday
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Join us for worship, fellowship, and community as we gather together in faith.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-7xl mx-auto">
          {/* Service Schedule */}
          <Card className="p-4 md:p-6 lg:p-8 !bg-red-600 border-0 text-white shadow-none h-full flex flex-col" style={{ backgroundColor: 'rgb(220 38 38)' }}>
            <CardContent className="!px-0 text-white flex flex-col h-full">
              <div className="px-8 py-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white text-center">Upcoming Sunday</h3>
                </div>
                
                <div className="space-y-4 flex-1">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-white mr-3" />
                  <div>
                    <p className="font-semibold text-base md:text-lg text-white">9:00 AM</p>
                    <p className="text-white">Modern Worship</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-white mr-3" />
                  <div>
                    <p className="font-semibold text-base md:text-lg text-white">10:00 AM</p>
                    <p className="text-white">Sunday School for All Ages</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-white mr-3" />
                  <div>
                    <p className="font-semibold text-lg text-white">11:00 AM</p>
                    <p className="text-white">Traditional Worship</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-white mr-3" />
                  <div>
                    <p className="font-semibold text-lg text-white">Location</p>
                    <p className="text-white">2109 W US Hwy 377, Granbury, TX 76048</p>
                  </div>
                </div>
              </div>

                <div className="mt-6">
                  <p className="text-sm text-white">
                    <strong>Next Service:</strong> {nextSunday.toLocaleDateString('en-US', {
                      timeZone: 'America/Chicago', 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sermon Series */}
          <Card className="p-4 md:p-6 lg:p-8 overflow-hidden !bg-red-600 border-0 shadow-none text-white h-full flex flex-col" style={{ backgroundColor: 'rgb(220 38 38)' }}>
            <CardContent className="!px-0 text-white flex flex-col h-full">
              {sermonSeries?.imageUrl && (
                <div className="w-full">
                  <img
                    src={sermonSeries.imageUrl}
                    alt={sermonSeries.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <div className="px-8 py-8 flex-1 flex flex-col">
              <div className="mb-4 text-center">
                <h3 className="text-2xl font-bold text-white">Current Sermon Series</h3>
              </div>

              {sermonSeries ? (
                <>
                  <h4 className="text-xl font-bold text-white">
                    {sermonSeries.title}
                  </h4>
                  {sermonSeries.description && (
                    <p className="text-white mt-2">
                      {sermonSeries.description}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white">No current sermon series available</p>
                  <p className="text-sm text-white/80 mt-2">
                    Create a sermon series in the admin panel to display it here.
                  </p>
                </div>
              )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
