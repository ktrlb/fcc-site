import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeaturedSpecialEvents } from "@/lib/content-queries";
import Image from "next/image";
import { ExpandableText } from "./expandable-text";
import { MapPin, User, Building2 } from "lucide-react";

export async function FeaturedSpecialEvents() {
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
    recurringDescription?: string;
  }> = [];
  
  try {
    featuredEvents = await getFeaturedSpecialEvents();
    console.log('Homepage: Fetched featured events:', featuredEvents.length, featuredEvents);
  } catch (error) {
    console.error('Failed to fetch featured special events:', error);
  }

  if (featuredEvents.length === 0) {
    return null;
  }

  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">
            Featured Special Events
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Don&apos;t miss these upcoming special events and gatherings in our community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featuredEvents.map((event, index) => {
            // Cycle through signature colors
            const colors = [
              { bg: 'red-600', text: 'text-red-600', hex: '#dc2626' },
              { bg: 'teal-800', text: 'text-teal-800', hex: '#115e59' },
              { bg: 'indigo-900', text: 'text-indigo-900', hex: '#312e81' }
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
            <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow border-0 shadow-none max-w-md mx-auto lg:max-w-none lg:mx-0" style={{ backgroundColor: colorScheme.hex }}>
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
                
                <h4 className="text-xl font-bold text-white mb-2">
                  {(event as { displayTitle?: string }).displayTitle || event.title}
                </h4>
                <ExpandableText
                  text={event.specialEventNote || 'Join us for this special event.'}
                  collapsedChars={90}
                  className="text-white mb-1"
                  toggleClassName="text-sm text-white/80 hover:text-white underline block ml-auto"
                />
                
                <div className="space-y-1 text-sm text-white">
                  {event.recurringDescription ? (
                    <p className="font-semibold">
                      {event.recurringDescription}
                    </p>
                  ) : (
                    <p className="font-semibold">
                      {new Date(event.startTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'America/Chicago'
                      })}
                    </p>
                  )}
                  {!event.allDay && (
                    <p>
                      {new Date(event.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'America/Chicago'
                      })}
                      {event.endTime && (
                        <> - {new Date(event.endTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'America/Chicago'
                        })}</>
                      )}
                    </p>
                  )}
                  {event.location && (
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </p>
                  )}
                  {event.contactPerson && (
                    <p className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Contact: {event.contactPerson}
                    </p>
                  )}
                  {event.ministryTeamName && (
                    <p className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      {event.ministryTeamName}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-indigo-900 text-white hover:bg-indigo-700 hover:text-white border-0 transition-colors" asChild>
            <a href="/calendar">View Full Calendar</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
