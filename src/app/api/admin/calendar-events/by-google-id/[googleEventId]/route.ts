import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendarEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ googleEventId: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { googleEventId } = await params;
    const event = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.googleEventId, googleEventId))
      .limit(1);
    
    if (!event[0]) {
      return NextResponse.json({ event: null });
    }
    
    return NextResponse.json({ event: event[0] });
  } catch (error) {
    console.error('Error fetching calendar event by Google ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar event' },
      { status: 500 }
    );
  }
}

