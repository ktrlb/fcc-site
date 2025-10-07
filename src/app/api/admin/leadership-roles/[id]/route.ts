import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leadershipRoles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { maxPositions } = body;

    if (maxPositions === undefined || maxPositions < 1) {
      return NextResponse.json(
        { error: 'Max positions must be at least 1' },
        { status: 400 }
      );
    }

    await db
      .update(leadershipRoles)
      .set({ 
        maxPositions,
        updatedAt: new Date(),
      })
      .where(eq(leadershipRoles.id, id));

    return NextResponse.json({
      success: true,
      message: 'Max positions updated successfully',
    });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

