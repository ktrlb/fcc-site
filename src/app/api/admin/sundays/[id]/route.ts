import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { sundays } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/admin/sundays/[id] - Get specific Sunday
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const [sunday] = await db
      .select()
      .from(sundays)
      .where(eq(sundays.id, id))
      .limit(1);

    if (!sunday) {
      return NextResponse.json({ error: 'Sunday not found' }, { status: 404 });
    }

    return NextResponse.json({ sunday });
  } catch (error) {
    console.error('Error fetching Sunday:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/sundays/[id] - Update Sunday
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { date, sermonSeriesId, title, description, isActive } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Check if another Sunday exists for this date (excluding current one)
    const existingSunday = await db
      .select()
      .from(sundays)
      .where(eq(sundays.date, date))
      .limit(1);

    if (existingSunday.length > 0 && existingSunday[0].id !== id) {
      return NextResponse.json({ error: 'Another Sunday already exists for this date' }, { status: 400 });
    }

    const updatedSunday = await db
      .update(sundays)
      .set({
        date,
        sermonSeriesId: sermonSeriesId || null,
        title: title || null,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(sundays.id, id))
      .returning();

    if (updatedSunday.length === 0) {
      return NextResponse.json({ error: 'Sunday not found' }, { status: 404 });
    }

    return NextResponse.json({ sunday: updatedSunday[0] });
  } catch (error) {
    console.error('Error updating Sunday:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/sundays/[id] - Delete Sunday
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deletedSunday = await db
      .delete(sundays)
      .where(eq(sundays.id, id))
      .returning();

    if (deletedSunday.length === 0) {
      return NextResponse.json({ error: 'Sunday not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Sunday deleted successfully' });
  } catch (error) {
    console.error('Error deleting Sunday:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
