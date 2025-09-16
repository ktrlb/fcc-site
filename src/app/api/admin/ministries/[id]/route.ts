import { NextRequest, NextResponse } from 'next/server';
import { updateMinistryTeam, deleteMinistryTeam } from '@/lib/ministry-queries';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const ministry = await updateMinistryTeam(id, data);
    return NextResponse.json(ministry[0]);
  } catch (error) {
    console.error('Error updating ministry:', error);
    return NextResponse.json({ error: 'Failed to update ministry' }, { status: 500 });
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
    await deleteMinistryTeam(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ministry:', error);
    return NextResponse.json({ error: 'Failed to delete ministry' }, { status: 500 });
  }
}
