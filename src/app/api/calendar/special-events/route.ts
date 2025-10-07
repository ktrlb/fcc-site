import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents, calendarCache } from '@/lib/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeExternal = searchParams.get('includeExternal') === 'true';
    const includePast = searchParams.get('includePast') === 'true';
    
    // Fetch all calendar events marked as special events
    const now = new Date();
    
    const eventsQuery = await db
      .select({
        id: calendarEvents.id,
        googleEventId: calendarEvents.googleEventId,
        title: calendarEvents.title,
        description: calendarEvents.description,
        location: calendarEvents.location,
        // Get dates from both tables for fallback
        cacheStartTime: calendarCache.startTime,
        cacheEndTime: calendarCache.endTime,
        eventStartTime: calendarEvents.startTime,
        eventEndTime: calendarEvents.endTime,
        allDay: calendarEvents.allDay,
        recurring: calendarEvents.recurring,
        specialEventId: calendarEvents.specialEventId,
        ministryTeamId: calendarEvents.ministryTeamId,
        isSpecialEvent: calendarEvents.isSpecialEvent,
        isExternal: calendarEvents.isExternal,
        specialEventNote: calendarEvents.specialEventNote,
        specialEventImage: calendarEvents.specialEventImage,
        contactPerson: calendarEvents.contactPerson,
        recurringDescription: calendarEvents.recurringDescription,
        endsBy: calendarEvents.endsBy,
        seriesName: calendarEvents.seriesName,
        featuredOnHomePage: calendarEvents.featuredOnHomePage,
        isActive: calendarEvents.isActive,
        createdAt: calendarEvents.createdAt,
        updatedAt: calendarEvents.updatedAt,
      })
      .from(calendarEvents)
      .leftJoin(calendarCache, eq(calendarEvents.googleEventId, calendarCache.googleEventId))
      .where(
        and(
          eq(calendarEvents.isSpecialEvent, true),
          eq(calendarEvents.isActive, true)
        )
      );
    
    const events = eventsQuery.map(e => ({
      ...e,
      // Use cache dates if available (more accurate), fallback to calendar_events dates
      startTime: e.cacheStartTime || e.eventStartTime,
      endTime: e.cacheEndTime || e.eventEndTime,
    }));
    
    // Filter based on endsBy date OR startTime if no endsBy is set (unless includePast is true)
    const upcomingEvents = includePast ? events : events.filter(event => {
      if (event.endsBy) {
        // If endsBy is set, use that to determine if event should show
        return new Date(event.endsBy) >= now;
      } else {
        // Otherwise use startTime
        return new Date(event.startTime) >= now;
      }
    });
    
    console.log(`Found ${events.length} special events in database`);
    console.log(`After date filtering: ${upcomingEvents.length} upcoming events`);
    upcomingEvents.forEach(e => console.log(`- ${e.title} (${e.startTime}) - endsBy: ${e.endsBy}`));
    
    // Filter out external events if not in admin mode
    const filteredEvents = includeExternal 
      ? upcomingEvents 
      : upcomingEvents.filter(e => !e.isExternal);
    
    // Group by seriesName
    const grouped = new Map<string, typeof events>();
    const individual: typeof events = [];
    
    filteredEvents.forEach(event => {
      if (event.seriesName) {
        // Group events by series name
        if (!grouped.has(event.seriesName)) {
          grouped.set(event.seriesName, []);
        }
        grouped.get(event.seriesName)!.push(event);
      } else {
        // Individual events (no series)
        individual.push(event);
      }
    });
    
    // Sort events within each series by start time
    grouped.forEach((seriesEvents) => {
      seriesEvents.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });
    
    // Sort individual events by start time
    individual.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    // Format the response
    const seriesItems = Array.from(grouped.entries()).map(([seriesName, seriesEvents]) => ({
      type: 'series',
      seriesName,
      title: seriesEvents[0].title, // Use first event's title (they should all be similar)
      description: seriesEvents[0].specialEventNote,
      image: seriesEvents[0].specialEventImage,
      contactPerson: seriesEvents[0].contactPerson,
      location: seriesEvents[0].location,
      eventCount: seriesEvents.length,
      events: seriesEvents.map(e => ({
        id: e.id,
        googleEventId: e.googleEventId,
        startTime: e.startTime,
        endTime: e.endTime,
        allDay: e.allDay,
      })),
      firstEventDate: seriesEvents[0].startTime,
      lastEventDate: seriesEvents[seriesEvents.length - 1].startTime,
      ministryTeamId: seriesEvents[0].ministryTeamId,
      specialEventId: seriesEvents[0].specialEventId,
      featuredOnHomePage: seriesEvents[0].featuredOnHomePage,
    }));
    
    const individualItems = individual.map(event => ({
      type: 'individual',
      id: event.id,
      googleEventId: event.googleEventId,
      title: event.title,
      description: event.specialEventNote,
      image: event.specialEventImage,
      contactPerson: event.contactPerson,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      ministryTeamId: event.ministryTeamId,
      specialEventId: event.specialEventId,
      featuredOnHomePage: event.featuredOnHomePage,
    }));
    
    // Combine and sort all items by end date (for sorting in the list)
    const allItems = [...seriesItems, ...individualItems].sort((a, b) => {
      // Use the last event date for series, or the single event date for individuals
      const aDate = 'firstEventDate' in a ? new Date(a.lastEventDate) : new Date(a.endTime);
      const bDate = 'firstEventDate' in b ? new Date(b.lastEventDate) : new Date(b.endTime);
      return aDate.getTime() - bDate.getTime();
    });
    
    return NextResponse.json({ 
      items: allItems,
      totalSeries: seriesItems.length,
      totalIndividual: individualItems.length,
    });
  } catch (error) {
    console.error('Error fetching special events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special events' },
      { status: 500 }
    );
  }
}

