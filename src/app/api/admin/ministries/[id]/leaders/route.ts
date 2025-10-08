import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ministryLeaders, members } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

// GET /api/admin/ministries/[id]/leaders - Fetch leaders for a ministry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const leaders = await db
      .select({
        id: ministryLeaders.id,
        memberId: ministryLeaders.memberId,
        role: ministryLeaders.role,
        isPrimary: ministryLeaders.isPrimary,
        sortOrder: ministryLeaders.sortOrder,
        member: {
          id: members.id,
          firstName: members.firstName,
          lastName: members.lastName,
          preferredName: members.preferredName,
          email: members.email,
        },
      })
      .from(ministryLeaders)
      .leftJoin(members, eq(ministryLeaders.memberId, members.id))
      .where(eq(ministryLeaders.ministryTeamId, id))
      .orderBy(ministryLeaders.sortOrder, ministryLeaders.isPrimary);

    return NextResponse.json({ leaders });
  } catch (error) {
    console.error('Error fetching ministry leaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ministry leaders' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ministries/[id]/leaders - Update leaders for a ministry
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { leaders } = await request.json();

    // Delete existing leaders for this ministry
    await db.delete(ministryLeaders).where(eq(ministryLeaders.ministryTeamId, id));

    // Insert new leaders
    if (leaders && leaders.length > 0) {
      await db.insert(ministryLeaders).values(
        leaders.map((leader: any, index: number) => ({
          ministryTeamId: id,
          memberId: leader.memberId,
          role: leader.role || null,
          isPrimary: leader.isPrimary || false,
          sortOrder: index,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating ministry leaders:', error);
    return NextResponse.json(
      { error: 'Failed to update ministry leaders' },
      { status: 500 }
    );
  }
}

