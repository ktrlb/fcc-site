import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents, specialEventTypes, ministryTeams, featuredSpecialEvents } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, get all featured events to check against
    const featuredEvents = await db
      .select({
        title: featuredSpecialEvents.title,
        startTime: featuredSpecialEvents.startTime,
      })
      .from(featuredSpecialEvents)
      .where(eq(featuredSpecialEvents.isActive, true));

    // Create a set of featured event identifiers (title + startTime for matching)
    const featuredEventSet = new Set(
      featuredEvents.map(event => `${event.title}|${event.startTime.toISOString()}`)
    );

    // Fetch all special events from calendar events table
    const events = await db
      .select({
        id: calendarEvents.id,
        title: calendarEvents.title,
        description: calendarEvents.description,
        location: calendarEvents.location,
        startTime: calendarEvents.startTime,
        endTime: calendarEvents.endTime,
        allDay: calendarEvents.allDay,
        specialEventNote: calendarEvents.specialEventNote,
        specialEventImage: calendarEvents.specialEventImage,
        contactPerson: calendarEvents.contactPerson,
        isActive: calendarEvents.isActive,
        sortOrder: calendarEvents.id, // Use ID as sort order since there's no sortOrder field
        specialEventType: {
          id: specialEventTypes.id,
          name: specialEventTypes.name,
          color: specialEventTypes.color,
        },
        ministryTeam: {
          id: ministryTeams.id,
          name: ministryTeams.name,
        },
      })
      .from(calendarEvents)
      .leftJoin(specialEventTypes, eq(calendarEvents.specialEventId, specialEventTypes.id))
      .leftJoin(ministryTeams, eq(calendarEvents.ministryTeamId, ministryTeams.id))
      .where(
        and(
          eq(calendarEvents.isSpecialEvent, true),
          eq(calendarEvents.isActive, true)
        )
      )
      .orderBy(calendarEvents.startTime);

    // Add featured status to each event
    const eventsWithFeaturedStatus = events.map(event => ({
      ...event,
      isFeatured: featuredEventSet.has(`${event.title}|${event.startTime.toISOString()}`)
    }));

    return NextResponse.json({ events: eventsWithFeaturedStatus });
  } catch (error) {
    console.error('Error fetching special events list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special events list' },
      { status: 500 }
    );
  }
}

