import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, BookOpen, Music, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedSermonSeries } from "@/lib/content-queries";
import { CalendarCacheService } from "@/lib/calendar-cache";
import { db } from "@/lib/db";
import { sundays, sermonSeries } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

// Helper function to get the next Sunday's events
async function getUpcomingSundayEvents() {
  try {
    // Get current time in Chicago timezone
    const now = new Date();
    const chicagoTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    
    // Determine which Sunday to show
    let targetSunday;
    const isSunday = chicagoTime.getDay() === 0; // 0 = Sunday
    const isBeforeNoon = chicagoTime.getHours() < 12;
    
    if (isSunday && isBeforeNoon) {
      // If it's Sunday before noon, show today's schedule
      targetSunday = new Date(chicagoTime);
    } else {
      // Otherwise, show next Sunday's schedule
      targetSunday = new Date(chicagoTime);
      targetSunday.setDate(chicagoTime.getDate() + (7 - chicagoTime.getDay()));
    }
    
    // Get all cached events
    const allEvents = await CalendarCacheService.getCalendarEvents();
    console.log(`📅 Fetched ${allEvents.length} total events from calendar cache`);
    
    // Filter events for the target Sunday
    const startOfDay = new Date(targetSunday);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetSunday);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log(`🔍 Looking for Sunday events between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`);
    
    const sundayEvents = allEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      const isOnSunday = eventDate >= startOfDay && eventDate <= endOfDay;
      const isSundaySchool = event.title.toLowerCase().includes('sunday school');
      const isWorship = event.title.toLowerCase().includes('worship');
      
      const isMatch = isOnSunday && (isSundaySchool || isWorship);
      if (isMatch) {
        console.log(`✅ Found Sunday event: ${event.title} at ${event.startTime}`);
      }
      
      return isMatch;
    });
    
    console.log(`📋 Found ${sundayEvents.length} Sunday events for ${targetSunday.toDateString()}`);
    
    // Sort by start time
    sundayEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    // If no events found, use static fallback
    if (sundayEvents.length === 0) {
      console.log('⚠️ No Sunday events found in calendar cache, using static fallback schedule');
      return {
        date: targetSunday,
        events: [],
        isToday: isSunday && isBeforeNoon,
        isFallback: true
      };
    }
    
    return {
      date: targetSunday,
      events: sundayEvents,
      isToday: isSunday && isBeforeNoon,
      isFallback: false
    };
  } catch (error) {
    console.error('❌ Error fetching upcoming Sunday events:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    // Provide fallback even on error
    console.log('🔄 Using static fallback schedule due to error');
    return {
      date: new Date(),
      events: [],
      isToday: false,
      isFallback: true
    };
  }
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Helper function to get the appropriate icon for an event
function getEventIcon(eventTitle: string) {
  const title = eventTitle.toLowerCase();
  
  if (title.includes('sunday school')) {
    return BookOpen;
  } else if (title.includes('worship') || title.includes('modern') || title.includes('traditional')) {
    return Music;
  } else {
    return Clock; // fallback
  }
}

// Helper function to get the sermon series for the upcoming Sunday
async function getUpcomingSundaySermonSeries(sundayDate: Date) {
  try {
    // Format the date to match the database format (YYYY-MM-DD)
    // Use local date to avoid timezone issues
    const year = sundayDate.getFullYear();
    const month = String(sundayDate.getMonth() + 1).padStart(2, '0');
    const day = String(sundayDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    console.log(`🔍 Looking for sermon series for Sunday: ${dateString}`);
    
    // Get the sermon series for this Sunday
    const sundayData = await db
      .select({
        sermonSeriesId: sundays.sermonSeriesId,
        sermonSeries: {
          id: sermonSeries.id,
          title: sermonSeries.title,
          description: sermonSeries.description,
          imageUrl: sermonSeries.imageUrl,
        }
      })
      .from(sundays)
      .leftJoin(sermonSeries, eq(sundays.sermonSeriesId, sermonSeries.id))
      .where(eq(sundays.date, dateString))
      .limit(1);

    console.log(`📋 Sunday data found:`, sundayData);
    const result = sundayData[0]?.sermonSeries || null;
    console.log(`📖 Sermon series for ${dateString}:`, result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching upcoming Sunday sermon series:', error);
    return null;
  }
}

export async function SeeYouOnSunday() {
  // Get upcoming Sunday's events and sermon series
  const sundayData = await getUpcomingSundayEvents();
  const upcomingSermonSeries = await getUpcomingSundaySermonSeries(sundayData.date);
  
  // Fallback to featured sermon series if no specific series is scheduled
  const featuredSermonSeries = await getFeaturedSermonSeries();
  console.log(`⭐ Featured sermon series:`, featuredSermonSeries);
  const sermonSeries = upcomingSermonSeries || featuredSermonSeries;
  console.log(`🎯 Final sermon series being displayed:`, sermonSeries);

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
                  <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                    {sundayData.isFallback 
                      ? 'Our Usual Sunday Schedule is'
                      : `${sundayData.isToday ? 'Today' : 'Upcoming Sunday'}: ${sundayData.date.toLocaleDateString('en-US', {
                          timeZone: 'America/Chicago', 
                          month: 'long', 
                          day: 'numeric' 
                        })}`
                    }
                  </h3>
                  {sundayData.isFallback && (
                    <p className="text-base text-white/70 text-center mt-2">
                      Standard service times shown
                    </p>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  {sundayData.isFallback ? (
                    // Static fallback schedule
                    <div className="space-y-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white rounded-full p-2 mb-4">
                          <Music className="h-6 w-6" style={{ color: 'rgb(220 38 38)' }} />
                        </div>
                        <p className="font-semibold text-lg md:text-xl text-white">9:00 AM</p>
                        <p className="text-white">Modern Worship</p>
                        <p className="text-base text-white/80">Sanctuary</p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white rounded-full p-2 mb-4">
                          <BookOpen className="h-6 w-6" style={{ color: 'rgb(220 38 38)' }} />
                        </div>
                        <p className="font-semibold text-lg md:text-xl text-white">10:00 AM</p>
                        <p className="text-white">Sunday School</p>
                        <p className="text-base text-white/80">Various Classrooms</p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white rounded-full p-2 mb-4">
                          <Music className="h-6 w-6" style={{ color: 'rgb(220 38 38)' }} />
                        </div>
                        <p className="font-semibold text-lg md:text-xl text-white">11:00 AM</p>
                        <p className="text-white">Traditional Worship</p>
                        <p className="text-base text-white/80">Sanctuary</p>
                      </div>
                    </div>
                  ) : (
                    // Dynamic events from calendar
                    <div className="space-y-8">
                      {sundayData.events.map((event, index) => {
                        const IconComponent = getEventIcon(event.title);
                        return (
                          <div key={index} className="flex flex-col items-center text-center">
                            <div className="bg-white rounded-full p-2 mb-4">
                              <IconComponent className="h-6 w-6" style={{ color: 'rgb(220 38 38)' }} />
                            </div>
                            <p className="font-semibold text-lg md:text-xl text-white">
                              {formatTime(new Date(event.startTime))}
                            </p>
                            <p className="text-white">{event.title}</p>
                            {event.location && (
                              <p className="text-base text-white/80">{event.location}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className="bg-white border-white text-red-600 hover:bg-white/90 hover:text-red-700 transition-colors"
                    >
                      <Link href="/visit" className="flex items-center">
                        Plan Your Visit
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>

          {/* Sermon Series */}
          <Card className="p-0 overflow-hidden !bg-red-600 border-0 shadow-none text-white h-full flex flex-col" style={{ backgroundColor: 'rgb(220 38 38)' }}>
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
                    <p className="text-white mt-2 text-lg">
                      {sermonSeries.description}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white text-lg">No current sermon series available</p>
                  <p className="text-base text-white/80 mt-2">
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
