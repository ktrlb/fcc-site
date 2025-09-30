import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { members, families, familyMemberships } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where conditions
    const whereConditions = [];
    
    if (status && status !== 'all') {
      whereConditions.push(eq(members.membershipStatus, status));
    }
    
    if (search) {
      whereConditions.push(eq(members.isActive, true));
      // TODO: Add search functionality for name fields
    }

    const result = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        preferredName: members.preferredName,
        email: members.email,
        phone: members.phone,
        membershipStatus: members.membershipStatus,
        isActive: members.isActive,
        allowDirectoryListing: members.allowDirectoryListing,
        allowLayLeadership: members.allowLayLeadership,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
        // Family info
        primaryFamilyId: members.primaryFamilyId,
        familyName: families.familyName,
      })
      .from(members)
      .leftJoin(families, eq(members.primaryFamilyId, families.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(members.createdAt));

    return NextResponse.json({ members: result });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
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
      firstName,
      lastName,
      preferredName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      membershipStatus,
      dateOfBirth,
      anniversaryDate,
      memberSince,
      baptismDate,
      spouseName,
      childrenNames,
      emergencyContact,
      emergencyPhone,
      allowDirectoryListing,
      allowLayLeadership,
      notes,
      // Family info
      familyName,
      createNewFamily,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    let primaryFamilyId = null;

    // Handle family creation/assignment
    if (createNewFamily && familyName) {
      const [newFamily] = await db
        .insert(families)
        .values({
          familyName,
          address,
          city,
          state,
          zipCode,
          phone,
          email,
        })
        .returning();
      primaryFamilyId = newFamily.id;
    }

    const [newMember] = await db
      .insert(members)
      .values({
        firstName,
        lastName,
        preferredName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        membershipStatus: membershipStatus || 'Visitor',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : null,
        memberSince: memberSince ? new Date(memberSince) : null,
        baptismDate: baptismDate ? new Date(baptismDate) : null,
        spouseName,
        childrenNames: childrenNames ? JSON.stringify(childrenNames) : null,
        emergencyContact,
        emergencyPhone,
        allowDirectoryListing: allowDirectoryListing ?? true,
        allowLayLeadership: allowLayLeadership ?? false,
        notes,
        primaryFamilyId,
      })
      .returning();

    // If we created a family, set this member as head of household
    if (primaryFamilyId) {
      await db.update(families)
        .set({ headOfHousehold1: newMember.id })
        .where(eq(families.id, primaryFamilyId));
    }

    return NextResponse.json({ member: newMember });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
