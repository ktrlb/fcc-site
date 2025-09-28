import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { featuredSpecialEvents, specialEventTypes, ministryTeams } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all featured special events
    const events = await db
      .select({
        id: featuredSpecialEvents.id,
        title: featuredSpecialEvents.title,
        description: featuredSpecialEvents.description,
        location: featuredSpecialEvents.location,
        startTime: featuredSpecialEvents.startTime,
        endTime: featuredSpecialEvents.endTime,
        allDay: featuredSpecialEvents.allDay,
        specialEventNote: featuredSpecialEvents.specialEventNote,
        specialEventImage: featuredSpecialEvents.specialEventImage,
        contactPerson: featuredSpecialEvents.contactPerson,
        isActive: featuredSpecialEvents.isActive,
        sortOrder: featuredSpecialEvents.sortOrder,
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
      .from(featuredSpecialEvents)
      .leftJoin(specialEventTypes, eq(featuredSpecialEvents.specialEventTypeId, specialEventTypes.id))
      .leftJoin(ministryTeams, eq(featuredSpecialEvents.ministryTeamId, ministryTeams.id))
      .where(eq(featuredSpecialEvents.isActive, true))
      .orderBy(featuredSpecialEvents.startTime);

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching special events list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special events list' },
      { status: 500 }
    );
  }
}

