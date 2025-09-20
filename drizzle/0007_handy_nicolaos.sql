CREATE TABLE "calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"google_event_id" varchar(255),
	"title" varchar(255) NOT NULL,
	"description" text,
	"location" varchar(500),
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"all_day" boolean DEFAULT false NOT NULL,
	"recurring" boolean DEFAULT false NOT NULL,
	"ministry_connection" varchar(100),
	"ministry_team_id" uuid,
	"is_special_event" boolean DEFAULT false NOT NULL,
	"special_event_note" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_events_google_event_id_unique" UNIQUE("google_event_id")
);
--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "focal_point" text;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_ministry_team_id_ministry_teams_id_fk" FOREIGN KEY ("ministry_team_id") REFERENCES "public"."ministry_teams"("id") ON DELETE no action ON UPDATE no action;