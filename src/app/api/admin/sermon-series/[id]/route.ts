import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { updateSermonSeries } from '@/lib/content-queries';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sermonSeries } from '@/lib/schema';

// PUT /api/admin/sermon-series/[id] - Update sermon series
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
    const { title, description, imageUrl, isFeatured, isActive } = body;

    const updatedSeries = await updateSermonSeries(id, {
      title,
      description,
      imageUrl,
      isFeatured,
      isActive,
    });

    if (!updatedSeries) {
      return NextResponse.json({ error: 'Sermon series not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSeries);
  } catch (error) {
    console.error('Error updating sermon series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/sermon-series/[id] - Delete sermon series
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [deletedSeries] = await db
      .delete(sermonSeries)
      .where(eq(sermonSeries.id, id))
      .returning();

    if (!deletedSeries) {
      return NextResponse.json({ error: 'Sermon series not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Sermon series deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
