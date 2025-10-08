import { pgTable, uuid, varchar, text, boolean, timestamp, integer, decimal } from 'drizzle-orm/pg-core';

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
  contactPerson: varchar('contact_person', { length: 255 }), // Legacy: Primary contact person (deprecated - use ministryLeaders table)
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

// Ministry leaders - links members to ministry teams as leaders/contacts
export const ministryLeaders = pgTable('ministry_leaders', {
  id: uuid('id').defaultRandom().primaryKey(),
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id, { onDelete: 'cascade' }).notNull(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 100 }), // e.g., "Lead", "Co-Lead", "Coordinator"
  isPrimary: boolean('is_primary').default(false).notNull(), // Primary contact for the ministry
  sortOrder: integer('sort_order').default(0), // Display order
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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

export const sundays = pgTable('sundays', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: varchar('date', { length: 10 }).notNull(), // The specific Sunday date (YYYY-MM-DD)
  sermonSeriesId: uuid('sermon_series_id').references(() => sermonSeries.id),
  title: varchar('title', { length: 255 }), // Optional custom title for this Sunday
  description: text('description'), // Optional description
  isActive: boolean('is_active').default(true).notNull(),
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

// Families table for grouping related members
export const families = pgTable('families', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyName: varchar('family_name', { length: 255 }).notNull(), // e.g., "Smith Family"
  headOfHousehold1: uuid('head_of_household_1'), // Primary head of household
  headOfHousehold2: uuid('head_of_household_2'), // Secondary head (spouse, partner, etc.)
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 10 }),
  phone: varchar('phone', { length: 20 }), // Primary family phone
  email: varchar('email', { length: 255 }), // Primary family email
  familyNotes: text('family_notes'), // For tracking extended family, special situations, etc.
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Members table for church members (sensitive data - admin only)
export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Basic info
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  preferredName: varchar('preferred_name', { length: 100 }), // Nickname or preferred name
  pastNames: text('past_names'), // JSON array of previous names (maiden, divorced, etc.)
  nameSuffix: varchar('name_suffix', { length: 10 }), // Jr., Sr., III, etc.
  // Contact info (sensitive)
  email: varchar('email', { length: 255 }),
  churchEmail: varchar('church_email', { length: 255 }), // FCC email if they have one
  phone: varchar('phone', { length: 20 }),
  socialMedia: text('social_media'), // JSON object for Facebook, Instagram, etc.
  // Address (can be individual or family)
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 10 }),
  // Demographics (sensitive)
  dateOfBirth: timestamp('date_of_birth'),
  anniversaryDate: timestamp('anniversary_date'), // Wedding anniversary
  // Church info
  memberSince: timestamp('member_since'), // When they became a member
  membershipStatus: varchar('membership_status', { length: 50 }).default('Visitor'), // From your list
  baptismDate: timestamp('baptism_date'),
  // Family relationships
  primaryFamilyId: uuid('primary_family_id').references(() => families.id), // Primary family
  spouseName: varchar('spouse_name', { length: 255 }),
  childrenNames: text('children_names'), // JSON array of children names
  emergencyContact: varchar('emergency_contact', { length: 255 }),
  emergencyPhone: varchar('emergency_phone', { length: 20 }),
  // Communication preferences
  communicationPreferences: text('communication_preferences'), // JSON object for email, phone, text preferences
  optOutCommunications: text('opt_out_communications'), // JSON array of communication types to opt out of
  // Privacy controls
  isActive: boolean('is_active').default(true).notNull(),
  allowDirectoryListing: boolean('allow_directory_listing').default(true).notNull(), // Can appear in directory
  allowLayLeadership: boolean('allow_lay_leadership').default(false).notNull(), // Can appear in lay leadership
  // Admin fields
  notes: text('notes'), // Internal admin notes
  customFields: text('custom_fields'), // JSON object for future flexible data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Family memberships table (many-to-many for people in multiple families)
export const familyMemberships = pgTable('family_memberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'cascade' }).notNull(),
  relationship: varchar('relationship', { length: 50 }).notNull(), // 'head', 'spouse', 'child', 'parent', 'sibling', etc.
  isPrimary: boolean('is_primary').default(false).notNull(), // Is this their primary family?
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Welcome team tracking for visitors and prospects
export const welcomeTeamTracking = pgTable('welcome_team_tracking', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  // Visitor tracking
  firstVisitDate: timestamp('first_visit_date'),
  firstVisitService: varchar('first_visit_service', { length: 100 }), // Which service they attended
  howDidYouHear: varchar('how_did_you_hear', { length: 255 }), // How they found the church
  previousChurch: varchar('previous_church', { length: 255 }),
  // Welcome team notes
  welcomeTeamNotes: text('welcome_team_notes'),
  followUpDate: timestamp('follow_up_date'),
  followUpNotes: text('follow_up_notes'),
  // Status tracking
  visitorStatus: varchar('visitor_status', { length: 50 }).default('new'), // new, contacted, engaged, etc.
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leadership Roles - Defines all possible leadership positions
export const leadershipRoles = pgTable('leadership_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  roleName: varchar('role_name', { length: 255 }).notNull(), // e.g., "Moderator", "Elder", "Worship Leader"
  roleType: varchar('role_type', { length: 50 }).notNull(), // 'general-board', 'elder', 'deacon', 'ministry-leader', 'volunteer'
  description: text('description'), // Role description/responsibilities
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id, { onDelete: 'set null' }), // Link to ministry if applicable
  maxPositions: integer('max_positions').default(1), // How many people can hold this role (e.g., 14 elders, 1 moderator)
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leadership Assignments - Links people to roles
export const leadershipAssignments = pgTable('leadership_assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  roleId: uuid('role_id').references(() => leadershipRoles.id, { onDelete: 'cascade' }).notNull(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  // Display overrides (optional - uses member data by default)
  displayName: varchar('display_name', { length: 255 }), // Override member's name if needed
  bio: text('bio'), // Custom bio for this role
  imageUrl: varchar('image_url', { length: 500 }), // Custom photo for this role
  focalPoint: text('focal_point'), // Image focal point
  publicEmail: varchar('public_email', { length: 255 }), // Public contact email
  publicPhone: varchar('public_phone', { length: 20 }), // Public contact phone
  // Term tracking
  termStart: timestamp('term_start'),
  termEnd: timestamp('term_end'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// LEGACY: Lay Leadership table - keeping for backward compatibility during migration
export const layLeadership = pgTable('lay_leadership', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  // Public display info
  displayName: varchar('display_name', { length: 255 }).notNull(), // What name to show publicly
  role: varchar('role', { length: 255 }).notNull(), // e.g., "Elder", "Deacon", "Trustee"
  roleDescription: text('role_description'), // Brief description of their role
  bio: text('bio'), // Public bio for leadership page
  imageUrl: varchar('image_url', { length: 500 }), // Vercel Blob URL for photo
  focalPoint: text('focal_point'), // JSON string for focal point coordinates
  // Contact info (public only)
  publicEmail: varchar('public_email', { length: 255 }), // Email they want public
  publicPhone: varchar('public_phone', { length: 20 }), // Phone they want public
  // Display settings
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0),
  // Terms
  termStart: timestamp('term_start'),
  termEnd: timestamp('term_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leadership history table for tracking previous positions
export const leadershipHistory = pgTable('leadership_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  roleDescription: text('role_description'),
  termStart: timestamp('term_start').notNull(),
  termEnd: timestamp('term_end'),
  notes: text('notes'), // Additional notes about their service
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Volunteer tracking for hours and schedules
export const volunteerTracking = pgTable('volunteer_tracking', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id, { onDelete: 'cascade' }),
  // Volunteer session
  date: timestamp('date').notNull(),
  hours: decimal('hours', { precision: 4, scale: 2 }), // Hours volunteered
  description: text('description'), // What they did
  // Approval tracking (for children's ministry, etc.)
  requiresApproval: boolean('requires_approval').default(false).notNull(),
  isApproved: boolean('is_approved'),
  approvedBy: uuid('approved_by').references(() => members.id), // Who approved them
  approvedAt: timestamp('approved_at'),
  // Future scheduling
  scheduledDate: timestamp('scheduled_date'),
  scheduledTime: varchar('scheduled_time', { length: 50 }),
  isCompleted: boolean('is_completed').default(false).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Audit trail for tracking changes (for rollback capability)
export const memberAuditLog = pgTable('member_audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  changedBy: varchar('changed_by', { length: 255 }).notNull(), // Admin user who made the change
  changeType: varchar('change_type', { length: 50 }).notNull(), // 'create', 'update', 'delete'
  fieldName: varchar('field_name', { length: 100 }),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  changeReason: text('change_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Special event types table for managing event type categories with images and configurations
export const specialEventTypes = pgTable('special_event_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }), // Vercel Blob URL for special event image
  contactPerson: varchar('contact_person', { length: 255 }), // Default contact person for this event type
  color: varchar('color', { length: 7 }).default('#3B82F6'), // Hex color code for display
  isDefault: boolean('is_default').default(false).notNull(), // Whether this is a default/required option
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: varchar('sort_order', { length: 10 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Individual special events for homepage featuring
export const featuredSpecialEvents = pgTable('featured_special_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 500 }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  allDay: boolean('all_day').default(false).notNull(),
  specialEventImage: varchar('special_event_image', { length: 500 }), // URL for special event image
  contactPerson: varchar('contact_person', { length: 255 }),
  specialEventNote: text('special_event_note'), // Additional details for special events
  specialEventTypeId: uuid('special_event_type_id').references(() => specialEventTypes.id), // Link to special event type
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id), // Link to specific ministry team
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0), // For manual ordering
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
  specialEventId: uuid('special_event_id').references(() => specialEventTypes.id), // Link to special event type
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id), // Link to specific ministry team
  isSpecialEvent: boolean('is_special_event').default(false).notNull(),
  // Flag for outside groups using the facility; hidden from public views when true
  isExternal: boolean('is_external').default(false).notNull(),
  specialEventNote: text('special_event_note'), // Additional details for special events
  specialEventImage: varchar('special_event_image', { length: 500 }), // URL for special event image
  contactPerson: varchar('contact_person', { length: 255 }), // Contact person for special events
  recurringDescription: varchar('recurring_description', { length: 255 }), // Custom description for recurring pattern (e.g., "Tuesdays in January")
  endsBy: timestamp('ends_by'), // When to stop featuring recurring events on homepage
  seriesName: varchar('series_name', { length: 255 }), // Group events into a series (e.g., "Fall Bible Study")
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
  // Add ministry and special event ID fields for persistent connections
  ministryTeamId: uuid('ministry_team_id').references(() => ministryTeams.id),
  specialEventId: uuid('special_event_id').references(() => specialEventTypes.id),
  isSpecialEvent: boolean('is_special_event').default(false).notNull(),
  specialEventNote: text('special_event_note'),
  specialEventImage: varchar('special_event_image', { length: 500 }),
  contactPerson: varchar('contact_person', { length: 255 }),
  recurringDescription: varchar('recurring_description', { length: 255 }),
  endsBy: timestamp('ends_by'),
  featuredOnHomePage: boolean('featured_on_home_page').default(false).notNull(),
  eventIds: text('event_ids').array(), // Array of Google event IDs that match this pattern
  isExternal: boolean('is_external').default(false).notNull(),
  month: integer('month').notNull(), // 0-11 for January-December
  year: integer('year').notNull(), // Full year (e.g., 2025)
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

export type MinistryLeader = typeof ministryLeaders.$inferSelect;
export type NewMinistryLeader = typeof ministryLeaders.$inferInsert;

export type SermonSeries = typeof sermonSeries.$inferSelect;
export type NewSermonSeries = typeof sermonSeries.$inferInsert;

export type Sunday = typeof sundays.$inferSelect;
export type NewSunday = typeof sundays.$inferInsert;

export type SeasonalGuide = typeof seasonalGuides.$inferSelect;
export type NewSeasonalGuide = typeof seasonalGuides.$inferInsert;

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type Family = typeof families.$inferSelect;
export type NewFamily = typeof families.$inferInsert;

export type FamilyMembership = typeof familyMemberships.$inferSelect;
export type NewFamilyMembership = typeof familyMemberships.$inferInsert;

export type WelcomeTeamTracking = typeof welcomeTeamTracking.$inferSelect;
export type NewWelcomeTeamTracking = typeof welcomeTeamTracking.$inferInsert;

export type LayLeadership = typeof layLeadership.$inferSelect;
export type NewLayLeadership = typeof layLeadership.$inferInsert;

export type LeadershipHistory = typeof leadershipHistory.$inferSelect;
export type NewLeadershipHistory = typeof leadershipHistory.$inferInsert;

export type VolunteerTracking = typeof volunteerTracking.$inferSelect;
export type NewVolunteerTracking = typeof volunteerTracking.$inferInsert;

export type MemberAuditLog = typeof memberAuditLog.$inferSelect;
export type NewMemberAuditLog = typeof memberAuditLog.$inferInsert;

export type SpecialEventType = typeof specialEventTypes.$inferSelect;
export type NewSpecialEventType = typeof specialEventTypes.$inferInsert;
export type FeaturedSpecialEvent = typeof featuredSpecialEvents.$inferSelect;
export type NewFeaturedSpecialEvent = typeof featuredSpecialEvents.$inferInsert;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;

export type CalendarCache = typeof calendarCache.$inferSelect;
export type NewCalendarCache = typeof calendarCache.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

export type CalendarCacheHistory = typeof calendarCacheHistory.$inferSelect;
export type NewCalendarCacheHistory = typeof calendarCacheHistory.$inferInsert;
