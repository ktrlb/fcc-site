import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeaturedSpecialEvents } from "@/lib/content-queries";
import Image from "next/image";
import { ExpandableText } from "./expandable-text";

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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-900 mb-4 font-serif">
            Featured Special Events
          </h2>
          <p className="text-xl text-stone-700 max-w-3xl mx-auto">
            Don&apos;t miss these upcoming special events and gatherings in our community.
          </p>
        </div>

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
                
                <h4 className="text-xl font-bold text-stone-900 mb-2">
                  {(event as { displayTitle?: string }).displayTitle || event.title}
                </h4>
                <ExpandableText
                  text={event.specialEventNote || 'Join us for this special event.'}
                  collapsedChars={90}
                  className="text-stone-900 mb-1"
                  toggleClassName="text-sm text-indigo-700 hover:text-indigo-800 underline block ml-auto"
                />
                
                <div className="space-y-1 text-sm text-stone-700">
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

        <div className="text-center mt-12">
          <Button size="lg" className="bg-indigo-900 hover:bg-indigo-800 text-white" asChild>
            <a href="/calendar">View Full Calendar</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
