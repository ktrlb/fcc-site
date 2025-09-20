import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents, calendarCache, specialEvents, ministryTeams } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch calendar events that are marked as featured special events
    // Join with cached calendar data to get the actual event details
    const events = await db
      .select({
        id: calendarEvents.id,
        googleEventId: calendarEvents.googleEventId,
        title: calendarCache.title,
        description: calendarCache.description,
        location: calendarCache.location,
        startTime: calendarCache.startTime,
        endTime: calendarCache.endTime,
        allDay: calendarCache.allDay,
        recurring: calendarCache.recurring,
        specialEventId: calendarEvents.specialEventId,
        specialEventName: specialEvents.name,
        specialEventColor: specialEvents.color,
        specialEventImage: calendarEvents.specialEventImage,
      contactPerson: calendarEvents.contactPerson,
      recurringDescription: calendarEvents.recurringDescription,
      endsBy: calendarEvents.endsBy,
      ministryTeamId: calendarEvents.ministryTeamId,
        ministryTeamName: ministryTeams.name,
        isSpecialEvent: calendarEvents.isSpecialEvent,
        specialEventNote: calendarEvents.specialEventNote,
        featuredOnHomePage: calendarEvents.featuredOnHomePage,
        isActive: calendarEvents.isActive,
      })
      .from(calendarEvents)
      .innerJoin(calendarCache, eq(calendarEvents.googleEventId, calendarCache.googleEventId))
      .leftJoin(specialEvents, eq(calendarEvents.specialEventId, specialEvents.id))
      .leftJoin(ministryTeams, eq(calendarEvents.ministryTeamId, ministryTeams.id))
      .where(
        and(
          eq(calendarEvents.isActive, true),
          eq(calendarEvents.featuredOnHomePage, true)
        )
      )
      .orderBy(desc(calendarCache.startTime));

    // Debug: Log all events before filtering
    console.log(`Found ${events.length} events marked as featuredOnHomePage`);
    events.forEach(event => {
      console.log(`Event: ${event.title}, startTime: ${event.startTime}, recurring: ${event.recurring}`);
    });

    // Filter events - for recurring events, show them if they're marked as featured
    // For non-recurring events, only show if they're in the future
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      if (event.recurring) {
        // For recurring events marked as featured, show them unless they have an endsBy date that has passed
        if (event.endsBy) {
          return new Date(event.endsBy) >= now;
        }
        // No endsBy date means show indefinitely
        return true;
      } else {
        // For non-recurring events, only show if they're in the future
        return new Date(event.startTime) >= now;
      }
    });

    // Separate recurring and non-recurring events
    const recurringEvents = upcomingEvents.filter(event => event.recurring);
    const nonRecurringEvents = upcomingEvents.filter(event => !event.recurring);

    // Sort non-recurring events by start time and take the next ones
    const sortedNonRecurring = nonRecurringEvents.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // For recurring events, create a summary with recurring pattern
    const recurringSummaries = recurringEvents.map(event => {
      // Use custom recurring description if provided, otherwise generate one
      const customDescription = event.recurringDescription;
      let displayTitle = event.title;
      
      if (customDescription) {
        displayTitle = `${event.title} - ${customDescription}`;
      } else {
        // Fallback to auto-generated description
        const eventDate = new Date(event.startTime);
        const month = eventDate.toLocaleDateString('en-US', { month: 'long' });
        const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
        displayTitle = `${event.title} - ${dayOfWeek}s in ${month}`;
      }
      
      return {
        ...event,
        displayTitle,
        isRecurring: true
      };
    });

    // Combine recurring summaries with upcoming non-recurring events
    // Prioritize non-recurring events (they're more time-sensitive)
    const allEvents = [...sortedNonRecurring, ...recurringSummaries];
    const nextFeaturedEvents = allEvents.slice(0, 4); // Take up to 4 events

    console.log(`Featured events to display: ${nextFeaturedEvents.length} of ${upcomingEvents.length} total upcoming events`);
    nextFeaturedEvents.forEach(event => {
      const displayTitle = (event as { isRecurring?: boolean; displayTitle?: string }).isRecurring ? (event as { isRecurring?: boolean; displayTitle?: string }).displayTitle : event.title;
      console.log(`Featured event: ${displayTitle}`);
    });

    return NextResponse.json({ events: nextFeaturedEvents });
  } catch (error) {
    console.error('Error fetching featured special events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured special events' },
      { status: 500 }
    );
  }
}

