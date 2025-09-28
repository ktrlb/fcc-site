import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { featuredSpecialEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const event = await db
      .select()
      .from(featuredSpecialEvents)
      .where(eq(featuredSpecialEvents.id, id))
      .limit(1);

    if (event.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: event[0] });
  } catch (error) {
    console.error('Error fetching featured special event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured special event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updatedEvent = await db
      .update(featuredSpecialEvents)
      .set({
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        allDay: data.allDay,
        specialEventImage: data.specialEventImage,
        contactPerson: data.contactPerson,
        specialEventNote: data.specialEventNote,
        specialEventTypeId: data.specialEventTypeId,
        ministryTeamId: data.ministryTeamId,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(featuredSpecialEvents.id, id))
      .returning();

    if (updatedEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: updatedEvent[0] });
  } catch (error) {
    console.error('Error updating featured special event:', error);
    return NextResponse.json(
      { error: 'Failed to update featured special event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deletedEvent = await db
      .delete(featuredSpecialEvents)
      .where(eq(featuredSpecialEvents.id, id))
      .returning();

    if (deletedEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: deletedEvent[0] });
  } catch (error) {
    console.error('Error deleting featured special event:', error);
    return NextResponse.json(
      { error: 'Failed to delete featured special event' },
      { status: 500 }
    );
  }
}
