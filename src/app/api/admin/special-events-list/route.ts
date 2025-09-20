import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents, specialEvents, ministryTeams } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all calendar events that are marked as special events
    const events = await db
      .select({
        id: calendarEvents.id,
        googleEventId: calendarEvents.googleEventId,
        title: calendarEvents.title,
        description: calendarEvents.description,
        location: calendarEvents.location,
        startTime: calendarEvents.startTime,
        endTime: calendarEvents.endTime,
        specialEventNote: calendarEvents.specialEventNote,
        specialEventImage: calendarEvents.specialEventImage,
        contactPerson: calendarEvents.contactPerson,
        featuredOnHomePage: calendarEvents.featuredOnHomePage,
        specialEventType: {
          id: specialEvents.id,
          name: specialEvents.name,
          color: specialEvents.color,
        },
        ministryTeam: {
          id: ministryTeams.id,
          name: ministryTeams.name,
        },
      })
      .from(calendarEvents)
      .leftJoin(specialEvents, eq(calendarEvents.specialEventId, specialEvents.id))
      .leftJoin(ministryTeams, eq(calendarEvents.ministryTeamId, ministryTeams.id))
      .where(
        and(
          eq(calendarEvents.isActive, true),
          eq(calendarEvents.isSpecialEvent, true)
        )
      )
      .orderBy(calendarEvents.startTime);

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching special events list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special events list' },
      { status: 500 }
    );
  }
}

