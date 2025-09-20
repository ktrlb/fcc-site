import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
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
        specialEventNote: data.specialEventNote,
        specialEventImage: data.specialEventImage,
        contactPerson: data.contactPerson,
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
      // Create new event
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
        specialEventNote: data.specialEventNote,
        specialEventImage: data.specialEventImage,
        contactPerson: data.contactPerson,
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
