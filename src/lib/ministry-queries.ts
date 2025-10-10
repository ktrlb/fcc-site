import { db } from './db';
import { ministryTeams, ministryCategories, ministryApplications, ministryLeaders, members } from './schema';
import { eq } from 'drizzle-orm';
import type { NewMinistryTeam } from './schema';

export async function getMinistryTeams() {
  try {
    return await db.select().from(ministryTeams).where(eq(ministryTeams.isActive, true));
  } catch (error) {
    console.log('Database query error:', error instanceof Error ? error.message : 'Unknown error');
    
    // Check if we need to apply migrations
    if (error instanceof Error && (error.message.includes('image_url') || error.message.includes('categories'))) {
      console.log('Missing columns detected, applying migrations...');

      // Apply both migrations in case either or both are missing
      await db.execute(`
        ALTER TABLE "ministry_teams"
        ADD COLUMN IF NOT EXISTS "image_url" varchar(500);
      `);
      
      await db.execute(`
        ALTER TABLE "ministry_teams"
        ADD COLUMN IF NOT EXISTS "categories" text[];
      `);

      console.log('Migrations applied, retrying query...');

      // Retry the query
      return await db.select().from(ministryTeams).where(eq(ministryTeams.isActive, true));
    }
    
    throw error;
  }
}

export async function getMinistryTeamsWithLeaders(includeInactive: boolean = false) {
  try {
    // Get ministries (active only for public, all for admin)
    const ministries = includeInactive 
      ? await db.select().from(ministryTeams)
      : await db.select().from(ministryTeams).where(eq(ministryTeams.isActive, true));
    
    // For each ministry, fetch its leaders
    const ministriesWithLeaders = await Promise.all(
      ministries.map(async (ministry) => {
        const leaders = await db
          .select({
            id: ministryLeaders.id,
            memberId: ministryLeaders.memberId,
            role: ministryLeaders.role,
            isPrimary: ministryLeaders.isPrimary,
            sortOrder: ministryLeaders.sortOrder,
            member: {
              id: members.id,
              firstName: members.firstName,
              lastName: members.lastName,
              preferredName: members.preferredName,
            },
          })
          .from(ministryLeaders)
          .leftJoin(members, eq(ministryLeaders.memberId, members.id))
          .where(eq(ministryLeaders.ministryTeamId, ministry.id))
          .orderBy(ministryLeaders.sortOrder, ministryLeaders.isPrimary);
        
        return {
          ...ministry,
          leaders,
        };
      })
    );
    
    return ministriesWithLeaders;
  } catch (error) {
    console.log('Database query error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

export async function getMinistryCategories() {
  return await db.select().from(ministryCategories);
}

export async function searchMinistryTeams() {
  // Simplified search - just return all active ministries for now
  return await db.select().from(ministryTeams).where(eq(ministryTeams.isActive, true));
}

export async function getMinistryTeamById(id: string) {
  const result = await db.select().from(ministryTeams).where(eq(ministryTeams.id, id)).limit(1);
  const ministry = result[0] || null;
  
  if (!ministry) return null;
  
  // Fetch leaders for this ministry
  const leaders = await db
    .select({
      id: ministryLeaders.id,
      memberId: ministryLeaders.memberId,
      role: ministryLeaders.role,
      isPrimary: ministryLeaders.isPrimary,
      sortOrder: ministryLeaders.sortOrder,
      member: {
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        preferredName: members.preferredName,
      },
    })
    .from(ministryLeaders)
    .leftJoin(members, eq(ministryLeaders.memberId, members.id))
    .where(eq(ministryLeaders.ministryTeamId, ministry.id))
    .orderBy(ministryLeaders.sortOrder, ministryLeaders.isPrimary);
  
  return {
    ...ministry,
    leaders,
  };
}

export async function createMinistryApplication(data: {
  ministryTeamId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  message?: string;
}) {
  return await db.insert(ministryApplications).values(data).returning();
}

export async function getMinistryApplications() {
  return await db
    .select({
      id: ministryApplications.id,
      applicantName: ministryApplications.applicantName,
      applicantEmail: ministryApplications.applicantEmail,
      applicantPhone: ministryApplications.applicantPhone,
      message: ministryApplications.message,
      status: ministryApplications.status,
      createdAt: ministryApplications.createdAt,
      ministryName: ministryTeams.name,
    })
    .from(ministryApplications)
    .leftJoin(ministryTeams, eq(ministryApplications.ministryTeamId, ministryTeams.id))
    .orderBy(ministryApplications.createdAt);
}

export async function createMinistryTeam(data: NewMinistryTeam) {
  return await db.insert(ministryTeams).values(data).returning();
}

export async function updateMinistryTeam(id: string, data: Partial<NewMinistryTeam>) {
  return await db
    .update(ministryTeams)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ministryTeams.id, id))
    .returning();
}

export async function deleteMinistryTeam(id: string) {
  return await db.delete(ministryTeams).where(eq(ministryTeams.id, id));
}
