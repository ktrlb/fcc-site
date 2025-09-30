import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { members, families, familyMemberships, welcomeTeamTracking } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const [member] = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        preferredName: members.preferredName,
        pastNames: members.pastNames,
        nameSuffix: members.nameSuffix,
        email: members.email,
        churchEmail: members.churchEmail,
        phone: members.phone,
        socialMedia: members.socialMedia,
        address: members.address,
        city: members.city,
        state: members.state,
        zipCode: members.zipCode,
        dateOfBirth: members.dateOfBirth,
        anniversaryDate: members.anniversaryDate,
        memberSince: members.memberSince,
        membershipStatus: members.membershipStatus,
        baptismDate: members.baptismDate,
        spouseName: members.spouseName,
        childrenNames: members.childrenNames,
        emergencyContact: members.emergencyContact,
        emergencyPhone: members.emergencyPhone,
        communicationPreferences: members.communicationPreferences,
        optOutCommunications: members.optOutCommunications,
        isActive: members.isActive,
        allowDirectoryListing: members.allowDirectoryListing,
        allowLayLeadership: members.allowLayLeadership,
        notes: members.notes,
        customFields: members.customFields,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
        // Family info
        primaryFamilyId: members.primaryFamilyId,
        familyName: families.familyName,
        familyAddress: families.address,
        familyCity: families.city,
        familyState: families.state,
        familyZipCode: families.zipCode,
        familyPhone: families.phone,
        familyEmail: families.email,
        familyNotes: families.familyNotes,
      })
      .from(members)
      .leftJoin(families, eq(members.primaryFamilyId, families.id))
      .where(eq(members.id, id))
      .limit(1);

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Get welcome team tracking info
    const [welcomeInfo] = await db
      .select()
      .from(welcomeTeamTracking)
      .where(and(eq(welcomeTeamTracking.memberId, id), eq(welcomeTeamTracking.isActive, true)))
      .limit(1);

    return NextResponse.json({ 
      member: {
        ...member,
        welcomeTeamInfo: welcomeInfo || null
      }
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      firstName,
      lastName,
      preferredName,
      pastNames,
      nameSuffix,
      email,
      churchEmail,
      phone,
      socialMedia,
      address,
      city,
      state,
      zipCode,
      dateOfBirth,
      anniversaryDate,
      memberSince,
      membershipStatus,
      baptismDate,
      spouseName,
      childrenNames,
      emergencyContact,
      emergencyPhone,
      communicationPreferences,
      optOutCommunications,
      isActive,
      allowDirectoryListing,
      allowLayLeadership,
      notes,
      customFields,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    const updatedMember = await db
      .update(members)
      .set({
        firstName,
        lastName,
        preferredName,
        pastNames: pastNames ? JSON.stringify(pastNames) : null,
        nameSuffix,
        email,
        churchEmail,
        phone,
        socialMedia: socialMedia ? JSON.stringify(socialMedia) : null,
        address,
        city,
        state,
        zipCode,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : null,
        memberSince: memberSince ? new Date(memberSince) : null,
        membershipStatus,
        baptismDate: baptismDate ? new Date(baptismDate) : null,
        spouseName,
        childrenNames: childrenNames ? JSON.stringify(childrenNames) : null,
        emergencyContact,
        emergencyPhone,
        communicationPreferences: communicationPreferences ? JSON.stringify(communicationPreferences) : null,
        optOutCommunications: optOutCommunications ? JSON.stringify(optOutCommunications) : null,
        isActive: isActive ?? true,
        allowDirectoryListing: allowDirectoryListing ?? true,
        allowLayLeadership: allowLayLeadership ?? false,
        notes,
        customFields: customFields ? JSON.stringify(customFields) : null,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    if (updatedMember.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ member: updatedMember[0] });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
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

    // Soft delete by setting isActive to false
    const deletedMember = await db
      .update(members)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    if (deletedMember.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Member deactivated successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
