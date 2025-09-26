import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { sundays } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

// GET /api/admin/sundays - Get all Sundays or filter by date
export async function GET(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (date) {
      // Get Sunday for specific date
      const sunday = await db
        .select()
        .from(sundays)
        .where(eq(sundays.date, date))
        .limit(1);

      return NextResponse.json({ sundays: sunday });
    } else {
      // Get all Sundays
      const allSundays = await db
        .select()
        .from(sundays)
        .where(eq(sundays.isActive, true))
        .orderBy(asc(sundays.date));

      return NextResponse.json({ sundays: allSundays });
    }
  } catch (error) {
    console.error('Error fetching Sundays:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/sundays - Create new Sunday
export async function POST(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, sermonSeriesId, title, description } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Check if Sunday already exists for this date
    const existingSunday = await db
      .select()
      .from(sundays)
      .where(eq(sundays.date, date))
      .limit(1);

    if (existingSunday.length > 0) {
      return NextResponse.json({ error: 'Sunday already exists for this date' }, { status: 400 });
    }

    const newSunday = await db
      .insert(sundays)
      .values({
        date,
        sermonSeriesId: sermonSeriesId || null,
        title: title || null,
        description: description || null,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ sunday: newSunday[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating Sunday:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
