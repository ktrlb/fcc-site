import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leadershipAssignments, members } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { roleId, memberId, termStart, termEnd } = body;

    if (!roleId || !memberId) {
      return NextResponse.json(
        { error: 'Role ID and Member ID are required' },
        { status: 400 }
      );
    }

    // Get member details for display name
    const member = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);

    if (!member || member.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    const memberData = member[0];
    const displayName = (memberData.preferredName || memberData.firstName) + ' ' + memberData.lastName;

    // Create assignment
    const [assignment] = await db
      .insert(leadershipAssignments)
      .values({
        roleId,
        memberId,
        displayName,
        termStart: termStart ? new Date(termStart) : null,
        termEnd: termEnd ? new Date(termEnd) : null,
        isActive: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error('Error creating leadership assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    await db
      .delete(leadershipAssignments)
      .where(eq(leadershipAssignments.id, assignmentId));

    return NextResponse.json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    );
  }
}

