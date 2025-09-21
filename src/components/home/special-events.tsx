import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Calendar, Download } from "lucide-react";
import { getFeaturedSeasonalGuide, getFeaturedSpecialEvents } from "@/lib/content-queries";
import Image from "next/image";
import { GroupsModalWrapper } from "./groups-modal-wrapper";

export async function SpecialEvents() {
  // Get featured seasonal guide from database
  const seasonalGuide = await getFeaturedSeasonalGuide();
  
  // Fetch featured special events from database
  let featuredEvents: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    allDay?: boolean;
    location?: string;
    specialEventImage?: string;
    specialEventNote?: string;
    contactPerson?: string;
    specialEventColor?: string;
    specialEventName?: string;
    ministryTeamName?: string;
  }> = [];
  try {
    featuredEvents = await getFeaturedSpecialEvents();
    console.log('Homepage: Fetched featured events:', featuredEvents.length, featuredEvents);
  } catch (error) {
    console.error('Failed to fetch featured special events:', error);
  }

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
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">What&apos;s Inside:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Special service schedules</li>
                        <li>• Community outreach opportunities</li>
                        <li>• Fellowship events</li>
                        <li>• Study group schedules</li>
                        <li>• Volunteer opportunities</li>
                      </ul>
                    </div>
                    {seasonalGuide?.coverImageUrl && (
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-md mx-auto sm:mx-0">
                          <Image
                            src={seasonalGuide.coverImageUrl}
                            alt={seasonalGuide.title}
                            fill
                            className="object-cover"
                            style={{ aspectRatio: '8.5/11' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <a 
                    href={seasonalGuide?.pdfUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Seasonal Guide (PDF)
                  </a>
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
                
                <div className="space-y-3 mt-4">
                  <GroupsModalWrapper>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      View Weekly Groups
                    </Button>
                  </GroupsModalWrapper>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <a href="/calendar">View Full Calendar</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Special Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Special Events</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {event.specialEventImage && event.specialEventImage.trim() !== '' && (
                      <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={event.specialEventImage.startsWith('http') 
                            ? event.specialEventImage 
                            : event.specialEventImage.includes('/') 
                              ? event.specialEventImage 
                              : `/uploads/${event.specialEventImage}`}
                          alt={event.title}
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: event.specialEventColor || '#3B82F6' }}
                      >
                        {event.specialEventName || 'Special Event'}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {(event as { displayTitle?: string }).displayTitle || event.title}
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {event.specialEventNote || 'Join us for this special event.'}
                    </p>
                    
                    <div className="space-y-1 text-sm text-gray-500">
                      <p className="font-semibold">
                        {new Date(event.startTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {!event.allDay && (
                        <p>
                          {new Date(event.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                          {event.endTime && (
                            <> - {new Date(event.endTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}</>
                          )}
                        </p>
                      )}
                      {event.location && (
                        <p className="flex items-center">
                          <span className="mr-1">📍</span>
                          {event.location}
                        </p>
                      )}
                      {event.contactPerson && (
                        <p className="flex items-center">
                          <span className="mr-1">👤</span>
                          Contact: {event.contactPerson}
                        </p>
                      )}
                      {event.ministryTeamName && (
                        <p className="flex items-center">
                          <span className="mr-1">🏢</span>
                          {event.ministryTeamName}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button size="lg" variant="outline" className="mr-4" asChild>
            <a href="/calendar">View Full Calendar</a>
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <a href="/ministry-database">Explore Ministries at FCC</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
