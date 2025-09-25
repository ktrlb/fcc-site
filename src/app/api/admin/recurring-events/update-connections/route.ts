import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recurringEventsCache } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      dayOfWeek,
      time,
      location,
      ministryTeamId,
      specialEventId,
      isSpecialEvent,
      isExternal,
      specialEventNote,
      specialEventImage,
      contactPerson,
      recurringDescription,
      endsBy,
      featuredOnHomePage,
    } = body;

    // Find the matching recurring event pattern
    const matchingEvent = await db
      .select()
      .from(recurringEventsCache)
      .where(
        and(
          eq(recurringEventsCache.title, title),
          eq(recurringEventsCache.dayOfWeek, dayOfWeek.toString()),
          eq(recurringEventsCache.time, time),
          eq(recurringEventsCache.location, location || '')
        )
      )
      .limit(1);

    if (matchingEvent.length === 0) {
      return NextResponse.json({ error: 'Recurring event pattern not found' }, { status: 404 });
    }

    // Update the recurring event with the new connections
    const updatedEvent = await db
      .update(recurringEventsCache)
      .set({
        ministryTeamId: ministryTeamId || null,
        specialEventId: specialEventId || null,
        isSpecialEvent: isSpecialEvent || false,
        isExternal: isExternal || false,
        specialEventNote: specialEventNote || null,
        specialEventImage: specialEventImage || null,
        contactPerson: contactPerson || null,
        recurringDescription: recurringDescription || null,
        endsBy: endsBy ? new Date(endsBy) : null,
        featuredOnHomePage: featuredOnHomePage || false,
        lastAnalyzed: new Date(),
      })
      .where(eq(recurringEventsCache.id, matchingEvent[0].id))
      .returning();

    console.log('Updated recurring event connections:', {
      title,
      ministryTeamId,
      specialEventId,
      isSpecialEvent
    });

    return NextResponse.json({ 
      success: true, 
      event: updatedEvent[0] 
    });
  } catch (error) {
    console.error('Error updating recurring event connections:', error);
    return NextResponse.json(
      { error: 'Failed to update recurring event connections' },
      { status: 500 }
    );
  }
}
