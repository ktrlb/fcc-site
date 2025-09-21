CREATE TABLE "calendar_cache_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"refresh_type" varchar(20) NOT NULL,
	"events_count" integer NOT NULL,
	"success" boolean NOT NULL,
	"error_message" text,
	"duration_ms" integer,
	"source" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
