import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents, specialEvents, ministryTeams } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch calendar events that are marked as featured special events
    const events = await db
      .select({
        id: calendarEvents.id,
        googleEventId: calendarEvents.googleEventId,
        title: calendarEvents.title,
        description: calendarEvents.description,
        location: calendarEvents.location,
        startTime: calendarEvents.startTime,
        endTime: calendarEvents.endTime,
        allDay: calendarEvents.allDay,
        recurring: calendarEvents.recurring,
        specialEventId: calendarEvents.specialEventId,
        specialEventName: specialEvents.name,
        specialEventColor: specialEvents.color,
        specialEventImage: calendarEvents.specialEventImage,
        contactPerson: calendarEvents.contactPerson,
        ministryTeamId: calendarEvents.ministryTeamId,
        ministryTeamName: ministryTeams.name,
        isSpecialEvent: calendarEvents.isSpecialEvent,
        specialEventNote: calendarEvents.specialEventNote,
        featuredOnHomePage: calendarEvents.featuredOnHomePage,
        isActive: calendarEvents.isActive,
      })
      .from(calendarEvents)
      .leftJoin(specialEvents, eq(calendarEvents.specialEventId, specialEvents.id))
      .leftJoin(ministryTeams, eq(calendarEvents.ministryTeamId, ministryTeams.id))
      .where(
        and(
          eq(calendarEvents.isActive, true),
          eq(calendarEvents.featuredOnHomePage, true)
        )
      )
      .orderBy(desc(calendarEvents.startTime));

    // Filter out past events (only show upcoming events)
    const now = new Date();
    const upcomingEvents = events.filter(event => 
      new Date(event.startTime) >= now
    );

    return NextResponse.json({ events: upcomingEvents });
  } catch (error) {
    console.error('Error fetching featured special events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured special events' },
      { status: 500 }
    );
  }
}

