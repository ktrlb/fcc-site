import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { updateSeasonalGuide } from '@/lib/content-queries';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { seasonalGuides } from '@/lib/schema';

// PUT /api/admin/seasonal-guides/[id] - Update seasonal guide
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
    const { title, description, pdfUrl, coverImageUrl, isFeatured, isActive } = body;

    const updatedGuide = await updateSeasonalGuide(id, {
      title,
      description,
      pdfUrl,
      coverImageUrl,
      isFeatured,
      isActive,
    });

    if (!updatedGuide) {
      return NextResponse.json({ error: 'Seasonal guide not found' }, { status: 404 });
    }

    return NextResponse.json(updatedGuide);
  } catch (error) {
    console.error('Error updating seasonal guide:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/seasonal-guides/[id] - Delete seasonal guide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [deletedGuide] = await db
      .delete(seasonalGuides)
      .where(eq(seasonalGuides.id, id))
      .returning();

    if (!deletedGuide) {
      return NextResponse.json({ error: 'Seasonal guide not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Seasonal guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting seasonal guide:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
