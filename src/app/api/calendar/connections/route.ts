import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents, ministryTeams, specialEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch all calendar event connections with ministry and special event data
    const connections = await db
      .select({
        googleEventId: calendarEvents.googleEventId,
        ministryTeamId: calendarEvents.ministryTeamId,
        specialEventId: calendarEvents.specialEventId,
        isSpecialEvent: calendarEvents.isSpecialEvent,
        specialEventImage: calendarEvents.specialEventImage,
        specialEventNote: calendarEvents.specialEventNote,
        contactPerson: calendarEvents.contactPerson,
        ministryTeam: {
          id: ministryTeams.id,
          name: ministryTeams.name,
          description: ministryTeams.description,
          imageUrl: ministryTeams.imageUrl,
          graphicImage: ministryTeams.graphicImage,
          contactPerson: ministryTeams.contactPerson,
          contactEmail: ministryTeams.contactEmail,
          contactPhone: ministryTeams.contactPhone,
          categories: ministryTeams.categories,
        },
        specialEvent: {
          id: specialEvents.id,
          name: specialEvents.name,
          description: specialEvents.description,
          imageUrl: specialEvents.imageUrl,
          color: specialEvents.color,
        }
      })
      .from(calendarEvents)
      .leftJoin(ministryTeams, eq(calendarEvents.ministryTeamId, ministryTeams.id))
      .leftJoin(specialEvents, eq(calendarEvents.specialEventId, specialEvents.id))
      .where(eq(calendarEvents.isActive, true));

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Error fetching calendar connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar connections' },
      { status: 500 }
    );
  }
}
