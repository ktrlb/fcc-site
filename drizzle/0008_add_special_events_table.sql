CREATE TABLE "special_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image_url" varchar(500),
	"color" varchar(7) DEFAULT '#3B82F6' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" varchar(10) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_events" ADD COLUMN "special_event_id" uuid;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD COLUMN "featured_on_home_page" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_special_event_id_special_events_id_fk" FOREIGN KEY ("special_event_id") REFERENCES "public"."special_events"("id") ON DELETE no action ON UPDATE no action;

