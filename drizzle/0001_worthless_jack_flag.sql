ALTER TABLE "ministry_teams" ADD COLUMN "contact_heading" varchar(255);--> statement-breakpoint
ALTER TABLE "ministry_teams" ADD COLUMN "leader" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "ministry_teams" ADD COLUMN "leader_contact" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "ministry_teams" ADD COLUMN "type" text[];--> statement-breakpoint
ALTER TABLE "ministry_teams" ADD COLUMN "regular_meeting_type" varchar(100);--> statement-breakpoint
ALTER TABLE "ministry_teams" ADD COLUMN "regular_meeting_time" varchar(100);--> statement-breakpoint
ALTER TABLE "ministry_teams" ADD COLUMN "graphic_image" varchar(500);--> statement-breakpoint
ALTER TABLE "ministry_teams" ADD COLUMN "recurring_type" varchar(50) NOT NULL;