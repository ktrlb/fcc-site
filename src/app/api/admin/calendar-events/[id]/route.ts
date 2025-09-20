import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { NewCalendarEvent } from '@/lib/schema';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, id))
      .limit(1);
    
    if (!event[0]) {
      return NextResponse.json(
        { error: 'Calendar event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ event: event[0] });
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData: Partial<NewCalendarEvent> = {
      title: data.title,
      description: data.description,
      location: data.location,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      allDay: data.allDay,
      recurring: data.recurring,
      ministryConnection: data.ministryConnection,
      ministryTeamId: data.ministryTeamId,
      isSpecialEvent: data.isSpecialEvent,
      specialEventNote: data.specialEventNote,
      updatedAt: new Date(),
    };
    
    const result = await db
      .update(calendarEvents)
      .set(updateData)
      .where(eq(calendarEvents.id, id))
      .returning();
    
    if (!result[0]) {
      return NextResponse.json(
        { error: 'Calendar event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ event: result[0] });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to update calendar event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Soft delete by setting isActive to false
    const result = await db
      .update(calendarEvents)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(calendarEvents.id, id))
      .returning();
    
    if (!result[0]) {
      return NextResponse.json(
        { error: 'Calendar event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Calendar event deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
}
