import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      title: string;
      dayOfWeek: number; // 0-6 (Sun-Sat)
      time: string; // HH:mm in America/Chicago
      location?: string;
    };

    if (!body?.title || typeof body.dayOfWeek !== 'number' || !body?.time) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // calendar_events stores connections without normalized DoW/Time in some schemas.
    // We still return the most recent matching record by title/location if present.
    const results = await db
      .select()
      .from(calendarEvents)
      .where(and(
        eq(calendarEvents.title, body.title),
        eq(calendarEvents.location, body.location ?? '')
      ))
      .limit(1);

    const event = results[0] || null;

    return NextResponse.json({
      event: event
        ? {
            googleEventId: event.googleEventId,
            specialEventId: event.specialEventId,
            ministryTeamId: event.ministryTeamId,
            isSpecialEvent: event.isSpecialEvent,
            isExternal: event.isExternal,
            specialEventNote: event.specialEventNote,
            specialEventImage: event.specialEventImage,
            contactPerson: event.contactPerson,
            recurringDescription: event.recurringDescription,
            endsBy: event.endsBy,
            featuredOnHomePage: event.featuredOnHomePage,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching calendar event by recurring match:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}




