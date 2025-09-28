import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { featuredSpecialEvents, specialEventTypes, ministryTeams } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    // Fetch featured special events from the dedicated table
    const events = await db
      .select({
        id: featuredSpecialEvents.id,
        title: featuredSpecialEvents.title,
        description: featuredSpecialEvents.description,
        location: featuredSpecialEvents.location,
        startTime: featuredSpecialEvents.startTime,
        endTime: featuredSpecialEvents.endTime,
        allDay: featuredSpecialEvents.allDay,
        specialEventImage: featuredSpecialEvents.specialEventImage,
        contactPerson: featuredSpecialEvents.contactPerson,
        specialEventNote: featuredSpecialEvents.specialEventNote,
        specialEventType: {
          id: specialEventTypes.id,
          name: specialEventTypes.name,
          color: specialEventTypes.color,
        },
        ministryTeam: {
          id: ministryTeams.id,
          name: ministryTeams.name,
        },
        isActive: featuredSpecialEvents.isActive,
        sortOrder: featuredSpecialEvents.sortOrder,
      })
      .from(featuredSpecialEvents)
      .leftJoin(specialEventTypes, eq(featuredSpecialEvents.specialEventTypeId, specialEventTypes.id))
      .leftJoin(ministryTeams, eq(featuredSpecialEvents.ministryTeamId, ministryTeams.id))
      .where(eq(featuredSpecialEvents.isActive, true))
      .orderBy(desc(featuredSpecialEvents.sortOrder), desc(featuredSpecialEvents.startTime));

    // Filter events - only show future events
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= now;
    });

    // Take up to 4 events
    const nextFeaturedEvents = upcomingEvents.slice(0, 4);

    console.log(`Featured events to display: ${nextFeaturedEvents.length} of ${upcomingEvents.length} total upcoming events`);

    return NextResponse.json({ events: nextFeaturedEvents });
  } catch (error) {
    console.error('Error fetching featured special events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured special events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const newEvent = await db
      .insert(featuredSpecialEvents)
      .values({
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        allDay: data.allDay || false,
        specialEventImage: data.specialEventImage,
        contactPerson: data.contactPerson,
        specialEventNote: data.specialEventNote,
        specialEventTypeId: data.specialEventTypeId,
        ministryTeamId: data.ministryTeamId,
        sortOrder: data.sortOrder || 0,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ event: newEvent[0] });
  } catch (error) {
    console.error('Error creating featured special event:', error);
    return NextResponse.json(
      { error: 'Failed to create featured special event' },
      { status: 500 }
    );
  }
}