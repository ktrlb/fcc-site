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
  contactHeading: varchar('contact_heading', { length: 255 }), // e.g., "Outreach Chair"
  type: text('type').array(), // Tags for ministry type
  regularMeetingType: varchar('regular_meeting_type', { length: 100 }),
  regularMeetingTime: varchar('regular_meeting_time', { length: 100 }),
  description: text('description').notNull(),
  graphicImage: varchar('graphic_image', { length: 500 }), // URL to image (legacy)
  imageUrl: varchar('image_url', { length: 500 }), // Vercel Blob URL for ministry image
  recurringType: varchar('recurring_type', { length: 50 }).notNull(), // regular, one-off, as-needed
  // Legacy fields for backward compatibility
  category: varchar('category', { length: 100 }).notNull(),
  categories: text('categories').array(), // Array of category names for multiple categorization
  contactPerson: varchar('contact_person', { length: 255 }).notNull(), // Primary contact person
  contactEmail: varchar('contact_email', { length: 255 }), // Primary contact email (optional)
  contactPhone: varchar('contact_phone', { length: 20 }), // Primary contact phone
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

// Content tables for structured data
export const sermonSeries = pgTable('sermon_series', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }), // Vercel Blob URL
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const seasonalGuides = pgTable('seasonal_guides', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  pdfUrl: varchar('pdf_url', { length: 500 }), // Vercel Blob URL for PDF
  coverImageUrl: varchar('cover_image_url', { length: 500 }), // Vercel Blob URL for cover
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Staff table for church staff members
export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  bio: text('bio').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }), // Vercel Blob URL for staff photo
  focalPoint: text('focal_point'), // JSON string for focal point coordinates {x: number, y: number}
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: varchar('sort_order', { length: 10 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Special events table for managing special event types with images and configurations
export const specialEvents = pgTable('special_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }), // Vercel Blob URL for special event image
  color: varchar('color', { length: 7 }).default('#3B82F6'), // Hex color code for display
  isDefault: boolean('is_default').default(false).notNull(), // Whether this is a default/required option
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: varchar('sort_order', { length: 10 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Calendar events table for managing Google Calendar events and their custom properties
export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  googleEventId: varchar('google_event_id', { length: 255 }).unique(), // Google Calendar event ID
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 500 }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  allDay: boolean('all_day').default(false).notNull(),
  recurring: boolean('recurring').default(false).notNull(),
  specialEventId: uuid('special_event_id').references(() => specialEvents.id), // Link to special event type
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id), // Link to specific ministry team
  isSpecialEvent: boolean('is_special_event').default(false).notNull(),
  // Flag for outside groups using the facility; hidden from public views when true
  isExternal: boolean('is_external').default(false).notNull(),
  specialEventNote: text('special_event_note'), // Additional details for special events
  specialEventImage: varchar('special_event_image', { length: 500 }), // URL for special event image
  contactPerson: varchar('contact_person', { length: 255 }), // Contact person for special events
  recurringDescription: varchar('recurring_description', { length: 255 }), // Custom description for recurring pattern (e.g., "Tuesdays in January")
  endsBy: timestamp('ends_by'), // When to stop featuring recurring events on homepage
  featuredOnHomePage: boolean('featured_on_home_page').default(false).notNull(), // Whether to feature on home page
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Calendar cache table for storing raw Google Calendar data to reduce API calls
export const calendarCache = pgTable('calendar_cache', {
  id: uuid('id').defaultRandom().primaryKey(),
  googleEventId: varchar('google_event_id', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 500 }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  allDay: boolean('all_day').default(false),
  recurring: boolean('recurring').default(false),
  rawData: text('raw_data'), // Store the full Google Calendar event data as JSON
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Recurring events analysis cache - stores the analyzed recurring patterns
export const recurringEventsCache = pgTable('recurring_events_cache', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  dayOfWeek: varchar('day_of_week', { length: 10 }).notNull(), // 0-6 for Sunday-Saturday
  time: varchar('time', { length: 10 }).notNull(), // HH:MM format
  location: varchar('location', { length: 500 }),
  description: text('description'),
  frequency: varchar('frequency', { length: 20 }).default('weekly').notNull(),
  confidence: varchar('confidence', { length: 20 }).notNull(), // 0-1 as string
  ministryConnection: varchar('ministry_connection', { length: 100 }),
  eventIds: text('event_ids').array(), // Array of Google event IDs that match this pattern
  isExternal: boolean('is_external').default(false).notNull(),
  lastAnalyzed: timestamp('last_analyzed').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Calendar cache refresh history - tracks when the cache is refreshed
export const calendarCacheHistory = pgTable('calendar_cache_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  refreshType: varchar('refresh_type', { length: 20 }).notNull(), // 'scheduled', 'manual', 'force'
  eventsCount: varchar('events_count', { length: 10 }).notNull(), // Store as string for now
  success: boolean('success').notNull(),
  errorMessage: text('error_message'),
  durationMs: varchar('duration_ms', { length: 10 }), // Store as string for now
  source: varchar('source', { length: 50 }).notNull(), // 'google_api', 'fallback_cache', 'sample_data'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Keep the assets table for general file storage
export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // 'image', 'document', 'video', etc.
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: varchar('file_size', { length: 20 }),
  mimeType: varchar('mime_type', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  sortOrder: varchar('sort_order', { length: 10 }).default('0'),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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

export type SermonSeries = typeof sermonSeries.$inferSelect;
export type NewSermonSeries = typeof sermonSeries.$inferInsert;

export type SeasonalGuide = typeof seasonalGuides.$inferSelect;
export type NewSeasonalGuide = typeof seasonalGuides.$inferInsert;

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;

export type SpecialEvent = typeof specialEvents.$inferSelect;
export type NewSpecialEvent = typeof specialEvents.$inferInsert;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;

export type CalendarCache = typeof calendarCache.$inferSelect;
export type NewCalendarCache = typeof calendarCache.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

export type CalendarCacheHistory = typeof calendarCacheHistory.$inferSelect;
export type NewCalendarCacheHistory = typeof calendarCacheHistory.$inferInsert;
