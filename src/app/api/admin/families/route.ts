import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { families, familyMemberships, members } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const includeMembers = searchParams.get('includeMembers') === 'true';

    const allFamilies = await db
      .select()
      .from(families)
      .orderBy(families.familyName);

    if (!includeMembers) {
      return NextResponse.json({
        families: allFamilies,
        total: allFamilies.length,
      });
    }

    // Get all family memberships with member details
    const memberships = await db
      .select({
        familyId: familyMemberships.familyId,
        firstName: members.firstName,
        lastName: members.lastName,
        preferredName: members.preferredName,
      })
      .from(familyMemberships)
      .leftJoin(members, eq(familyMemberships.memberId, members.id));

    // Group members by family
    const familyMembersMap = new Map<string, typeof memberships>();
    memberships.forEach(m => {
      if (!familyMembersMap.has(m.familyId)) {
        familyMembersMap.set(m.familyId, []);
      }
      familyMembersMap.get(m.familyId)!.push(m);
    });

    // Add members to each family
    const familiesWithMembers = allFamilies.map(family => ({
      ...family,
      members: familyMembersMap.get(family.id) || [],
    }));

    return NextResponse.json({
      families: familiesWithMembers,
      total: familiesWithMembers.length,
    });
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Failed to fetch families' },
      { status: 500 }
    );
  }
}

