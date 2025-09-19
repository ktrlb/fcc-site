import { db } from './db';
import { ministryTeams, ministryCategories, ministryApplications } from './schema';
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

export async function getMinistryCategories() {
  return await db.select().from(ministryCategories);
}

export async function searchMinistryTeams() {
  // Simplified search - just return all active ministries for now
  return await db.select().from(ministryTeams).where(eq(ministryTeams.isActive, true));
}

export async function getMinistryTeamById(id: string) {
  const result = await db.select().from(ministryTeams).where(eq(ministryTeams.id, id)).limit(1);
  return result[0] || null;
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
