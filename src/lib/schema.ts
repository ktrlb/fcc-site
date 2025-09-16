import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const ministryCategories = pgTable('ministry_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 7 }), // Hex color code
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ministrySkills = pgTable('ministry_skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ministryTeams = pgTable('ministry_teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactHeading: varchar('contact_heading', { length: 255 }),
  leader: varchar('leader', { length: 255 }).notNull(),
  leaderContact: varchar('leader_contact', { length: 255 }).notNull(),
  type: text('type').array(), // Tags for ministry type
  regularMeetingType: varchar('regular_meeting_type', { length: 100 }),
  regularMeetingTime: varchar('regular_meeting_time', { length: 100 }),
  description: text('description').notNull(),
  graphicImage: varchar('graphic_image', { length: 500 }), // URL to image
  recurringType: varchar('recurring_type', { length: 50 }).notNull(), // regular, one-off, as-needed
  // Legacy fields for backward compatibility
  category: varchar('category', { length: 100 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  meetingSchedule: text('meeting_schedule'),
  location: varchar('location', { length: 255 }),
  skillsNeeded: text('skills_needed').array(),
  timeCommitment: varchar('time_commitment', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ministryApplications = pgTable('ministry_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id, { onDelete: 'cascade' }).notNull(),
  applicantName: varchar('applicant_name', { length: 255 }).notNull(),
  applicantEmail: varchar('applicant_email', { length: 255 }).notNull(),
  applicantPhone: varchar('applicant_phone', { length: 20 }),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, declined
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ministryTeamSkills = pgTable('ministry_team_skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id, { onDelete: 'cascade' }).notNull(),
  skillId: uuid('skill_id').references(() => ministrySkills.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export types for TypeScript
export type MinistryCategory = typeof ministryCategories.$inferSelect;
export type NewMinistryCategory = typeof ministryCategories.$inferInsert;

export type MinistrySkill = typeof ministrySkills.$inferSelect;
export type NewMinistrySkill = typeof ministrySkills.$inferInsert;

export type MinistryTeam = typeof ministryTeams.$inferSelect;
export type NewMinistryTeam = typeof ministryTeams.$inferInsert;

export type MinistryApplication = typeof ministryApplications.$inferSelect;
export type NewMinistryApplication = typeof ministryApplications.$inferInsert;

export type MinistryTeamSkill = typeof ministryTeamSkills.$inferSelect;
export type NewMinistryTeamSkill = typeof ministryTeamSkills.$inferInsert;
