import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { layLeadership } from '@/lib/schema';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      displayName,
      role,
      roleDescription,
      bio,
      imageUrl,
      focalPoint,
      publicEmail,
      publicPhone,
      isActive,
      sortOrder,
      termStart,
      termEnd,
    } = body;

    const updatedLeader = await db
      .update(layLeadership)
      .set({
        displayName,
        role,
        roleDescription: roleDescription || null,
        bio: bio || null,
        imageUrl: imageUrl || null,
        focalPoint: focalPoint || null,
        publicEmail: publicEmail || null,
        publicPhone: publicPhone || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        termStart: termStart ? new Date(termStart) : null,
        termEnd: termEnd ? new Date(termEnd) : null,
        updatedAt: new Date(),
      })
      .where(eq(layLeadership.id, id))
      .returning();

    if (updatedLeader.length === 0) {
      return NextResponse.json(
        { error: 'Lay leader not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLeader[0]);
  } catch (error) {
    console.error('Error updating lay leader:', error);
    return NextResponse.json(
      { error: 'Failed to update lay leader' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const deletedLeader = await db
      .delete(layLeadership)
      .where(eq(layLeadership.id, id))
      .returning();

    if (deletedLeader.length === 0) {
      return NextResponse.json(
        { error: 'Lay leader not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lay leader:', error);
    return NextResponse.json(
      { error: 'Failed to delete lay leader' },
      { status: 500 }
    );
  }
}
