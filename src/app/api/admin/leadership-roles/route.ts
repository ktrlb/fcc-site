import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leadershipRoles, leadershipAssignments, members, ministryTeams } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const roleType = searchParams.get('roleType');

    // Get all roles
    let rolesQuery = db
      .select({
        id: leadershipRoles.id,
        roleName: leadershipRoles.roleName,
        roleType: leadershipRoles.roleType,
        description: leadershipRoles.description,
        ministryTeamId: leadershipRoles.ministryTeamId,
        maxPositions: leadershipRoles.maxPositions,
        sortOrder: leadershipRoles.sortOrder,
        isActive: leadershipRoles.isActive,
      })
      .from(leadershipRoles);

    if (roleType) {
      rolesQuery = rolesQuery.where(eq(leadershipRoles.roleType, roleType)) as any;
    }

    const roles = await rolesQuery;

    // Get all assignments with member and ministry details
    const assignments = await db
      .select({
        id: leadershipAssignments.id,
        roleId: leadershipAssignments.roleId,
        memberId: leadershipAssignments.memberId,
        displayName: leadershipAssignments.displayName,
        bio: leadershipAssignments.bio,
        imageUrl: leadershipAssignments.imageUrl,
        focalPoint: leadershipAssignments.focalPoint,
        publicEmail: leadershipAssignments.publicEmail,
        publicPhone: leadershipAssignments.publicPhone,
        termStart: leadershipAssignments.termStart,
        termEnd: leadershipAssignments.termEnd,
        isActive: leadershipAssignments.isActive,
        // Member details
        memberFirstName: members.firstName,
        memberLastName: members.lastName,
        memberPreferredName: members.preferredName,
        memberEmail: members.email,
      })
      .from(leadershipAssignments)
      .leftJoin(members, eq(leadershipAssignments.memberId, members.id));

    // Get ministry details for ministry leader roles
    const ministries = await db.select().from(ministryTeams);
    const ministryMap = new Map(ministries.map(m => [m.id, m]));

    // Combine roles with their assignments
    const rolesWithAssignments = roles.map(role => {
      const roleAssignments = assignments.filter(a => a.roleId === role.id);
      const ministry = role.ministryTeamId ? ministryMap.get(role.ministryTeamId) : null;
      
      return {
        ...role,
        ministry: ministry ? {
          id: ministry.id,
          name: ministry.name,
          contactPerson: ministry.contactPerson,
        } : null,
        assignments: roleAssignments.map(a => ({
          id: a.id,
          memberId: a.memberId,
          displayName: a.displayName || (a.memberPreferredName || a.memberFirstName) + ' ' + a.memberLastName,
          bio: a.bio,
          imageUrl: a.imageUrl,
          focalPoint: a.focalPoint,
          publicEmail: a.publicEmail,
          publicPhone: a.publicPhone,
          termStart: a.termStart?.toISOString(),
          termEnd: a.termEnd?.toISOString(),
          isActive: a.isActive,
          memberEmail: a.memberEmail,
        })),
        currentAssignments: roleAssignments.filter(a => a.isActive).length,
      };
    });

    return NextResponse.json({
      roles: rolesWithAssignments,
      total: roles.length,
    });
  } catch (error) {
    console.error('Error fetching leadership roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leadership roles' },
      { status: 500 }
    );
  }
}

