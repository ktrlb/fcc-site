import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { specialEventTypes } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import type { NewSpecialEventType } from '@/lib/schema';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await db
      .select()
      .from(specialEventTypes)
      .where(eq(specialEventTypes.isActive, true))
      .orderBy(desc(specialEventTypes.sortOrder), desc(specialEventTypes.createdAt));
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching special events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special events' },
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
    
    const newEvent: NewSpecialEventType = {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      color: data.color || '#3B82F6',
      isDefault: data.isDefault || false,
      isActive: true,
      sortOrder: data.sortOrder || '0',
    };
    
    const result = await db.insert(specialEventTypes).values(newEvent).returning();
    
    return NextResponse.json({ event: result[0] });
  } catch (error) {
    console.error('Error creating special event:', error);
    return NextResponse.json(
      { error: 'Failed to create special event' },
      { status: 500 }
    );
  }
}

