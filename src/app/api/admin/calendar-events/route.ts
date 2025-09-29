import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents, calendarCache, recurringEventsCache } from '@/lib/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import type { NewCalendarEvent } from '@/lib/schema';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.isActive, true))
      .orderBy(desc(calendarEvents.startTime));
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
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

    // Bulk apply to series (for recurring patterns)
    if (data.applyToSeries && data.seriesCriteria) {
      const { title, dayOfWeek, time, location } = data.seriesCriteria as {
        title: string;
        dayOfWeek: number; // 0-6 Sunday-Saturday
        time: string; // HH:MM in 24h Chicago time
        location?: string;
      };

      // Fetch matching events from cache
      const cached = await db
        .select()
        .from(calendarCache);

      // Helper to extract Chicago HH:MM and day index
      const chicagoTimeOf = (d: Date) => {
        const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false });
        const parts = fmt.formatToParts(d);
        const hh = parts.find(p => p.type === 'hour')?.value || '00';
        const mm = parts.find(p => p.type === 'minute')?.value || '00';
        return `${hh}:${mm}`;
      };
      const chicagoDowOf = (d: Date) => {
        const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'long' });
        const name = fmt.format(d).toLowerCase();
        return ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(name);
      };

      const matchingGoogleIds = cached
        .filter(e => {
          const dow = chicagoDowOf(e.startTime as Date);
          const hhmm = chicagoTimeOf(e.startTime as Date);
          const loc = (e.location || '').trim();
          return (
            e.title === title &&
            dow === dayOfWeek &&
            hhmm === time &&
            (location ? loc === location : true)
          );
        })
        .map(e => e.googleEventId)
        .filter((id): id is string => !!id);

      // Upsert/update calendar_events for each matching id
      for (const googleEventId of matchingGoogleIds) {
        const existing = await db
          .select({ id: calendarEvents.id })
          .from(calendarEvents)
          .where(eq(calendarEvents.googleEventId, googleEventId))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(calendarEvents)
            .set({
              isExternal: !!data.isExternal,
              updatedAt: new Date(),
            })
            .where(eq(calendarEvents.id, existing[0].id));
        } else {
          const insertEvent: NewCalendarEvent = {
            googleEventId,
            title,
            description: null,
            location: location || null,
            startTime: new Date(), // placeholder
            endTime: new Date(),   // placeholder
            allDay: false,
            recurring: true,
            specialEventId: undefined,
            ministryTeamId: undefined,
            isSpecialEvent: false,
            isExternal: !!data.isExternal,
            specialEventNote: null,
            specialEventImage: null,
            contactPerson: null,
            recurringDescription: null,
            endsBy: null,
            featuredOnHomePage: false,
            isActive: true,
          };
          await db.insert(calendarEvents).values(insertEvent);
        }
      }

      // Also persist the external flag on the recurring pattern cache so mini-calendar reflects it
      try {
        const normalizedLocation = (location || '').trim();
        // Update rows matching normalized location string
        await db
          .update(recurringEventsCache)
          .set({ isExternal: !!data.isExternal })
          .where(
            and(
              eq(recurringEventsCache.title, title),
              eq(recurringEventsCache.dayOfWeek, String(dayOfWeek)),
              eq(recurringEventsCache.time, time),
              eq(recurringEventsCache.location, normalizedLocation)
            )
          );
        // If no location provided/blank, also update rows where location is NULL
        if (!normalizedLocation) {
          await db
            .update(recurringEventsCache)
            .set({ isExternal: !!data.isExternal })
            .where(
              and(
                eq(recurringEventsCache.title, title),
                eq(recurringEventsCache.dayOfWeek, String(dayOfWeek)),
                eq(recurringEventsCache.time, time),
                // location IS NULL
                sql`${recurringEventsCache.location} IS NULL`
              )
            );
        }
      } catch (e) {
        console.error('Failed to update recurring_events_cache isExternal:', e);
      }

      return NextResponse.json({ ok: true, applied: matchingGoogleIds.length });
    }
    
    // First, try to find an existing event with this googleEventId
    const existingEvent = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.googleEventId, data.googleEventId))
      .limit(1);
    
    if (existingEvent.length > 0) {
      // Update existing event
      const updateData: Partial<NewCalendarEvent> = {
        specialEventId: data.specialEventId,
        ministryTeamId: data.ministryTeamId,
        isSpecialEvent: data.isSpecialEvent || false,
        isExternal: data.isExternal || false,
        specialEventNote: data.specialEventNote,
        specialEventImage: data.specialEventImage,
        contactPerson: data.contactPerson,
        recurringDescription: data.recurringDescription,
        endsBy: data.endsBy ? new Date(data.endsBy) : null,
        featuredOnHomePage: data.featuredOnHomePage || false,
        updatedAt: new Date(),
      };
      
      const result = await db
        .update(calendarEvents)
        .set(updateData)
        .where(eq(calendarEvents.id, existingEvent[0].id))
        .returning();
      
      return NextResponse.json({ event: result[0] });
    } else {
      // Create new event - handle null start/end times
      if (!data.startTime || !data.endTime) {
        return NextResponse.json(
          { error: 'Event must have valid start and end times to be saved' },
          { status: 400 }
        );
      }
      
      const newEvent: NewCalendarEvent = {
        googleEventId: data.googleEventId,
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        allDay: data.allDay || false,
        recurring: data.recurring || false,
        specialEventId: data.specialEventId,
        ministryTeamId: data.ministryTeamId,
        isSpecialEvent: data.isSpecialEvent || false,
        isExternal: data.isExternal || false,
        specialEventNote: data.specialEventNote,
        specialEventImage: data.specialEventImage,
        contactPerson: data.contactPerson,
        recurringDescription: data.recurringDescription,
        endsBy: data.endsBy ? new Date(data.endsBy) : null,
        featuredOnHomePage: data.featuredOnHomePage || false,
        isActive: true,
      };
      
      const result = await db.insert(calendarEvents).values(newEvent).returning();
      
      return NextResponse.json({ event: result[0] });
    }
  } catch (error) {
    console.error('Error creating/updating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create/update calendar event' },
      { status: 500 }
    );
  }
}
