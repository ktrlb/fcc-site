import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { specialEventTypes } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { NewSpecialEventType } from '@/lib/schema';
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
      .from(specialEventTypes)
      .where(eq(specialEventTypes.id, id))
      .limit(1);
    
    if (!event[0]) {
      return NextResponse.json(
        { error: 'Special event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ event: event[0] });
  } catch (error) {
    console.error('Error fetching special event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special event' },
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
    
    const updateData: Partial<NewSpecialEventType> = {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      color: data.color,
      isDefault: data.isDefault,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    };
    
    const result = await db
      .update(specialEventTypes)
      .set(updateData)
      .where(eq(specialEventTypes.id, id))
      .returning();
    
    if (!result[0]) {
      return NextResponse.json(
        { error: 'Special event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ event: result[0] });
  } catch (error) {
    console.error('Error updating special event:', error);
    return NextResponse.json(
      { error: 'Failed to update special event' },
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
    
    // Check if this is a default event that shouldn't be deleted
    const event = await db
      .select()
      .from(specialEventTypes)
      .where(eq(specialEventTypes.id, id))
      .limit(1);
    
    if (!event[0]) {
      return NextResponse.json(
        { error: 'Special event not found' },
        { status: 404 }
      );
    }
    
    if (event[0].isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default special events' },
        { status: 400 }
      );
    }
    
    // Soft delete by setting isActive to false
    const result = await db
      .update(specialEventTypes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(specialEventTypes.id, id))
      .returning();
    
    return NextResponse.json({ message: 'Special event deleted successfully' });
  } catch (error) {
    console.error('Error deleting special event:', error);
    return NextResponse.json(
      { error: 'Failed to delete special event' },
      { status: 500 }
    );
  }
}

