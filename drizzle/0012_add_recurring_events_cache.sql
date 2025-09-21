CREATE TABLE IF NOT EXISTS "recurring_events_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"day_of_week" varchar(10) NOT NULL,
	"time" varchar(10) NOT NULL,
	"location" varchar(500),
	"description" text,
	"frequency" varchar(20) DEFAULT 'weekly' NOT NULL,
	"confidence" varchar(10) NOT NULL,
	"ministry_connection" varchar(100),
	"event_ids" text[],
	"last_analyzed" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
