import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { layLeadership } from '@/lib/schema';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { layLeaders } = body;

    if (!Array.isArray(layLeaders)) {
      return NextResponse.json(
        { error: 'Invalid lay leaders data' },
        { status: 400 }
      );
    }

    // Update sort order for each lay leader
    const updatePromises = layLeaders.map((leader: { id: string; sortOrder: number }) =>
      db
        .update(layLeadership)
        .set({ sortOrder: leader.sortOrder })
        .where(eq(layLeadership.id, leader.id))
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering lay leaders:', error);
    return NextResponse.json(
      { error: 'Failed to reorder lay leaders' },
      { status: 500 }
    );
  }
}
