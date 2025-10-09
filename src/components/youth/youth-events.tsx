import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, MapPin, User } from "lucide-react";
import { db } from "@/lib/db";
import { calendarEvents, ministryTeams } from "@/lib/schema";
import { eq, and, gte } from "drizzle-orm";

async function getYouthSpecialEvents() {
  try {
    // First, get the Chi-Rho & CYF ministry ID - try multiple possible names
    const possibleNames = ["Chi-Rho & CYF Student Ministries", "Chi-Rho & CYF", "Chi-Rho &amp; CYF", "Chi Rho & CYF", "Youth Ministry"];
    
    let youthMinistry: { id: string; imageUrl: string | null } | null = null;
    
    for (const name of possibleNames) {
      const youthMinistries = await db
        .select({
          id: ministryTeams.id,
          imageUrl: ministryTeams.imageUrl
        })
        .from(ministryTeams)
        .where(eq(ministryTeams.name, name))
        .limit(1);
      
      if (youthMinistries.length > 0) {
        youthMinistry = youthMinistries[0];
        console.log(`Youth page: Found ministry "${name}" with ID: ${youthMinistry.id}`);
        break;
      }
    }

    if (!youthMinistry) {
      console.log("Youth page: Chi-Rho & CYF ministry not found in database");
      return [];
    }

    const youthMinistryId = youthMinistry.id;
    const ministryImageUrl = youthMinistry.imageUrl;

    // Get special events for youth ministry
    const now = new Date();
    const events = await db
      .select()
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.ministryTeamId, youthMinistryId),
          eq(calendarEvents.isSpecialEvent, true),
          eq(calendarEvents.isActive, true),
          eq(calendarEvents.isExternal, false)
        )
      );

    console.log(`Youth page: Found ${events.length} youth special events before filtering`);

    // Filter by endsBy or startTime
    const upcomingEvents = events.filter(event => {
      if (event.endsBy) {
        return new Date(event.endsBy) >= now;
      } else if (event.startTime) {
        return new Date(event.startTime) >= now;
      }
      return false;
    });

    console.log(`Youth page: ${upcomingEvents.length} upcoming youth special events after date filtering`);

    // Sort by start time
    upcomingEvents.sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return aTime - bTime;
    });

    const finalEvents = upcomingEvents.slice(0, 3);
    console.log(`Youth page: Returning ${finalEvents.length} events:`, finalEvents.map(e => e.title));

    // Add ministry image URL as fallback for events without their own image
    return finalEvents.map(event => ({
      ...event,
      fallbackImage: ministryImageUrl
    }));
  } catch (error) {
    console.error("Error fetching youth special events:", error);
    return [];
  }
}

function formatEventDate(date: Date | null, allDay?: boolean) {
  if (!date) return "";
  
  const eventDate = new Date(date);
  const formatted = eventDate.toLocaleDateString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
  });

  if (allDay) {
    return formatted;
  }

  const time = eventDate.toLocaleTimeString('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${formatted} at ${time}`;
}

export async function YouthEvents() {
  const specialEvents = await getYouthSpecialEvents() as Array<any>;

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Regular Youth Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-indigo-900 font-serif text-center mb-8">
            Regular Youth Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-full p-3 flex-shrink-0">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Wednesday Youth Group</h3>
                    <p className="text-white/90 text-lg mb-2">5:30 - 7:00 PM</p>
                    <p className="text-white/80">Weekly gatherings with dinner, games, worship, and fellowship</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-full p-3 flex-shrink-0">
                    <Clock className="h-6 w-6 text-teal-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Youth Sunday School</h3>
                    <p className="text-white/90 text-lg mb-2">10:00 - 11:00 AM</p>
                    <p className="text-white/80">Sunday morning Bible study and discussion for all youth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Youth Special Events */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-900 font-serif mb-4">
              Youth Special Events
            </h2>
            <p className="text-lg text-indigo-700 max-w-3xl mx-auto">
              Throughout the year, our youth participate in service projects and community outreach, 
              campouts, retreats and lock-ins, and social events and recreational activities.
            </p>
          </div>
          
          {specialEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {specialEvents.map((event, index) => {
                const colors = [
                  { hex: 'rgb(220 38 38)', name: 'red-600' },
                  { hex: 'rgb(17 94 89)', name: 'teal-800' },
                  { hex: 'rgb(49 46 129)', name: 'indigo-900' },
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <Card 
                    key={event.id} 
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                    style={{ backgroundColor: colorScheme.hex }}
                  >
                    <CardContent className="p-6">
                      {(event.specialEventImage || event.fallbackImage) && (
                        <div className="w-full mb-4 rounded-lg overflow-hidden">
                          <img
                            src={event.specialEventImage || event.fallbackImage}
                            alt={event.title}
                            className="w-full h-auto"
                            style={{ display: 'block' }}
                          />
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      
                      {event.specialEventNote && (
                        <p className="text-white/90 mb-4 text-base">
                          {event.specialEventNote.length > 150 
                            ? `${event.specialEventNote.substring(0, 150)}...` 
                            : event.specialEventNote}
                        </p>
                      )}

                      <div className="space-y-2 text-white/90 text-sm">
                        {event.recurringDescription ? (
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{event.recurringDescription}</span>
                          </div>
                        ) : event.startTime && (
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{formatEventDate(event.startTime, event.allDay)}</span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.contactPerson && (
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>Contact: {event.contactPerson}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No upcoming youth special events at this time</p>
              <p className="text-sm">Check back soon for new events!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

