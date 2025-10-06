import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { layLeadership } from '@/lib/schema';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const layLeaders = await db
      .select()
      .from(layLeadership)
      .orderBy(layLeadership.sortOrder, desc(layLeadership.createdAt));

    return NextResponse.json({ layLeaders });
  } catch (error) {
    console.error('Error fetching lay leaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lay leaders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      memberId,
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

    // Get the next sort order if not provided
    const maxSortOrder = await db
      .select({ max: layLeadership.sortOrder })
      .from(layLeadership)
      .limit(1);

    const nextSortOrder = sortOrder ?? (maxSortOrder[0]?.max ?? 0) + 1;

    const newLeader = await db
      .insert(layLeadership)
      .values({
        memberId,
        displayName,
        role,
        roleDescription: roleDescription || null,
        bio: bio || null,
        imageUrl: imageUrl || null,
        focalPoint: focalPoint || null,
        publicEmail: publicEmail || null,
        publicPhone: publicPhone || null,
        isActive: isActive ?? true,
        sortOrder: nextSortOrder,
        termStart: termStart ? new Date(termStart) : null,
        termEnd: termEnd ? new Date(termEnd) : null,
      })
      .returning();

    return NextResponse.json(newLeader[0]);
  } catch (error) {
    console.error('Error creating lay leader:', error);
    return NextResponse.json(
      { error: 'Failed to create lay leader' },
      { status: 500 }
    );
  }
}
