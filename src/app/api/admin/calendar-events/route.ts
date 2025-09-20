import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import type { NewCalendarEvent } from '@/lib/schema';

export async function GET() {
  try {
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
    const data = await request.json();
    
    const newEvent: NewCalendarEvent = {
      googleEventId: data.googleEventId,
      title: data.title,
      description: data.description,
      location: data.location,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      allDay: data.allDay || false,
      recurring: data.recurring || false,
      ministryConnection: data.ministryConnection,
      ministryTeamId: data.ministryTeamId,
      isSpecialEvent: data.isSpecialEvent || false,
      specialEventNote: data.specialEventNote,
      isActive: true,
    };
    
    const result = await db.insert(calendarEvents).values(newEvent).returning();
    
    return NextResponse.json({ event: result[0] });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}
