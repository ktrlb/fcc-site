CREATE TABLE "ministry_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ministry_team_id" uuid NOT NULL,
	"applicant_name" varchar(255) NOT NULL,
	"applicant_email" varchar(255) NOT NULL,
	"applicant_phone" varchar(20),
	"message" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ministry_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"color" varchar(7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ministry_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ministry_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ministry_skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ministry_team_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ministry_team_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ministry_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"contact_person" varchar(255) NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"contact_phone" varchar(20),
	"meeting_schedule" text,
	"location" varchar(255),
	"skills_needed" text[],
	"time_commitment" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ministry_applications" ADD CONSTRAINT "ministry_applications_ministry_team_id_ministry_teams_id_fk" FOREIGN KEY ("ministry_team_id") REFERENCES "public"."ministry_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ministry_team_skills" ADD CONSTRAINT "ministry_team_skills_ministry_team_id_ministry_teams_id_fk" FOREIGN KEY ("ministry_team_id") REFERENCES "public"."ministry_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ministry_team_skills" ADD CONSTRAINT "ministry_team_skills_skill_id_ministry_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."ministry_skills"("id") ON DELETE cascade ON UPDATE no action;