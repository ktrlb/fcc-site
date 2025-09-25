import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ googleEventId: string }> }
) {
  try {
    const { googleEventId } = await params;
    const rows = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.googleEventId, googleEventId))
      .limit(1);

    const event = rows[0] || null;

    // Public-safe payload (only fields used by client modals)
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
    console.error('Error fetching calendar event by Google ID (public):', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar event' },
      { status: 500 }
    );
  }
}




