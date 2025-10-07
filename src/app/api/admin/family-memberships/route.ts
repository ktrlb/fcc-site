import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { familyMemberships } from '@/lib/schema';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { memberId, familyId, relationship, isPrimary } = body;

    if (!memberId || !familyId || !relationship) {
      return NextResponse.json(
        { error: 'Member ID, Family ID, and relationship are required' },
        { status: 400 }
      );
    }

    const [membership] = await db
      .insert(familyMemberships)
      .values({
        memberId,
        familyId,
        relationship,
        isPrimary: isPrimary || false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      membership,
    });
  } catch (error) {
    console.error('Error creating family membership:', error);
    return NextResponse.json(
      { error: 'Failed to create family membership' },
      { status: 500 }
    );
  }
}

