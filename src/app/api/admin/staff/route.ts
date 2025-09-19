import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staff } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const staffMembers = await db
      .select()
      .from(staff)
      .where(eq(staff.isActive, true))
      .orderBy(staff.sortOrder, staff.name);

    console.log('Returning staff data from database:', staffMembers.length, 'members');
    staffMembers.forEach(member => {
      if (member.focalPoint) {
        console.log(`Staff ${member.name} focal point:`, member.focalPoint);
      }
    });
    return NextResponse.json({ staff: staffMembers });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, bio, email, imageUrl, focalPoint, sortOrder } = body;

    console.log('Creating staff member with data:', { name, title, bio, email, imageUrl, focalPoint });

    if (!name || !title || !bio || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [newStaff] = await db
      .insert(staff)
      .values({
        name,
        title,
        bio,
        email,
        imageUrl: imageUrl || null,
        focalPoint: focalPoint ? JSON.stringify(focalPoint) : null,
        isActive: true,
        sortOrder: sortOrder || '0',
      })
      .returning();

    console.log('Created staff member in database:', newStaff);
    return NextResponse.json({ staff: newStaff });
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}