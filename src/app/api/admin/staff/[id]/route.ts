import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staff } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, id))
      .limit(1);

    if (!staffMember) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ staff: staffMember });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff member' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, title, bio, email, imageUrl, focalPoint, sortOrder, isActive } = body;

    console.log('Updating staff member with data:', { name, title, bio, email, imageUrl, focalPoint, sortOrder });

    if (!name || !title || !bio || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const focalPointString = focalPoint ? JSON.stringify(focalPoint) : null;
    console.log('Storing focal point:', focalPointString);

    const { id } = await params;
    const updatedStaff = await db
      .update(staff)
      .set({
        name,
        title,
        bio,
        email,
        imageUrl: imageUrl || null,
        focalPoint: focalPointString,
        sortOrder: sortOrder || '0',
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(staff.id, id))
      .returning();

    if (updatedStaff.length === 0) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    console.log('Updated staff member in database:', updatedStaff[0]);
    return NextResponse.json({ staff: updatedStaff[0] });
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedStaff = await db
      .delete(staff)
      .where(eq(staff.id, id))
      .returning();

    if (deletedStaff.length === 0) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    console.log('Deleted staff member from database:', deletedStaff[0].name);
    return NextResponse.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}