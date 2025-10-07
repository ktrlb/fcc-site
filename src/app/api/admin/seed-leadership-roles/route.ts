import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leadershipRoles, ministryTeams } from '@/lib/schema';
import { isAdminAuthenticated } from '@/lib/admin-auth';

const ROLE_DEFINITIONS = {
  'Moderator': 'Presides at all meetings of the General Board and the congregation and serves as president of the corporation.',
  'Vice Moderator': 'In the absence of the Moderator, performs all duties of the Moderator. Serves as Chairperson of the Personnel Committee.',
  'Recording Secretary': 'Keeps and distributes minutes of all regular and special meetings of the congregation and the General Board.',
  'Treasurer': 'Provides oversight for the financial life of the congregation regarding receipt of all income and expenditures.',
  'Financial Secretary': 'Oversees the counting of receipts and coordinates with the bookkeeper to ensure accurate financial records.',
  'Outreach Representative': 'Serves as an advocate for the outreach ministry of the congregation and oversees the outreach budget.',
  'Stewardship Representative': 'Fosters faithful stewardship year-round and coordinates the annual stewardship campaign.',
  'Property Representative': 'Provides oversight of property and makes recommendations for repair and upkeep.',
  'MVT Member-at-Large': 'Participates in ongoing ministry visioning and discernment across all areas of ministry.',
  'Chair of Permanent Funds': 'Leads the team that oversees management of invested funds and allocation of distributions.',
  'La Reunion Board Member': 'Provides leadership and strategic visioning for the La Reunion Outreach Center & Food Pantry.',
  'Trustee': 'Acts as legal agent of the church in all business matters under direction of the General Board.',
  'Chair of the Elders': 'Leads the Elders in overseeing spiritual life and pastoral functions of the congregation.',
  'Chair of the Deacons': 'Leads the Deacons in facilitating worship and supporting the growth of the congregation.',
  'Elder': 'Oversees the spiritual life of the congregation, serves at the Lord\'s table, and assists in caregiving ministries.',
  'Deacon': 'Facilitates worship and assists in greeting, communion preparation, serving, and receiving offerings.',
} as const;

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = {
      board: 0,
      elder: 0,
      deacon: 0,
      ministry: 0,
    };

    // General Board positions
    const boardRoles = [
      { name: 'Moderator', sortOrder: 1, max: 1 },
      { name: 'Vice Moderator', sortOrder: 2, max: 1 },
      { name: 'Recording Secretary', sortOrder: 3, max: 1 },
      { name: 'Treasurer', sortOrder: 4, max: 1 },
      { name: 'Financial Secretary', sortOrder: 5, max: 1 },
      { name: 'Stewardship Representative', sortOrder: 6, max: 1 },
      { name: 'Outreach Representative', sortOrder: 7, max: 1 },
      { name: 'Property Representative', sortOrder: 8, max: 1 },
      { name: 'Chair of the Elders', sortOrder: 9, max: 1 },
      { name: 'Chair of the Deacons', sortOrder: 10, max: 1 },
      { name: 'MVT Member-at-Large', sortOrder: 11, max: 5 },
      { name: 'Trustee', sortOrder: 12, max: 3 },
      { name: 'Chair of Permanent Funds', sortOrder: 13, max: 1 },
      { name: 'La Reunion Board Member', sortOrder: 14, max: 6 },
    ];

    for (const role of boardRoles) {
      await db.insert(leadershipRoles).values({
        roleName: role.name,
        roleType: 'general-board',
        description: ROLE_DEFINITIONS[role.name as keyof typeof ROLE_DEFINITIONS] || '',
        maxPositions: role.max,
        sortOrder: role.sortOrder,
        isActive: true,
      });
      results.board++;
    }

    // Elder role (14 positions)
    await db.insert(leadershipRoles).values({
      roleName: 'Elder',
      roleType: 'elder',
      description: ROLE_DEFINITIONS['Elder'],
      maxPositions: 14,
      sortOrder: 1,
      isActive: true,
    });
    results.elder++;

    // Deacon role (36 positions)
    await db.insert(leadershipRoles).values({
      roleName: 'Deacon',
      roleType: 'deacon',
      description: ROLE_DEFINITIONS['Deacon'],
      maxPositions: 36,
      sortOrder: 1,
      isActive: true,
    });
    results.deacon++;

    // Get all ministries to create ministry leader roles
    const ministries = await db.select().from(ministryTeams);
    
    for (const ministry of ministries) {
      if (ministry.contactPerson && ministry.contactPerson.trim()) {
        // Skip if multiple contacts (has & or "and")
        if (ministry.contactPerson.includes('&') || ministry.contactPerson.toLowerCase().includes(' and ')) {
          continue;
        }
        
        await db.insert(leadershipRoles).values({
          roleName: ministry.contactHeading || `${ministry.name} Leader`,
          roleType: 'ministry-leader',
          description: `Contact person for ${ministry.name}`,
          ministryTeamId: ministry.id,
          maxPositions: 1,
          sortOrder: results.ministry,
          isActive: true,
        });
        results.ministry++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Leadership roles seeded successfully',
      results,
      total: results.board + results.elder + results.deacon + results.ministry,
    });
  } catch (error) {
    console.error('Error seeding leadership roles:', error);
    return NextResponse.json(
      { error: 'Failed to seed leadership roles' },
      { status: 500 }
    );
  }
}

