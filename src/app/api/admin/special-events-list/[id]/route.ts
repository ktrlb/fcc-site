import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { featuredSpecialEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const updatedEvent = await db
      .update(featuredSpecialEvents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(featuredSpecialEvents.id, id))
      .returning();

    if (updatedEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: updatedEvent[0] });
  } catch (error) {
    console.error(`Error updating featured special event ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update featured special event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletedEvent = await db
      .delete(featuredSpecialEvents)
      .where(eq(featuredSpecialEvents.id, id))
      .returning();

    if (deletedEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(`Error deleting featured special event ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete featured special event' },
      { status: 500 }
    );
  }
}
