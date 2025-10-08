-- Create ministry_leaders table for many-to-many relationship between ministries and member leaders
CREATE TABLE IF NOT EXISTS "ministry_leaders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "ministry_team_id" uuid NOT NULL,
  "member_id" uuid NOT NULL,
  "role" varchar(100),
  "is_primary" boolean DEFAULT false NOT NULL,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "ministry_leaders" ADD CONSTRAINT "ministry_leaders_ministry_team_id_ministry_teams_id_fk" 
  FOREIGN KEY ("ministry_team_id") REFERENCES "ministry_teams"("id") ON DELETE CASCADE;

ALTER TABLE "ministry_leaders" ADD CONSTRAINT "ministry_leaders_member_id_members_id_fk" 
  FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE;

-- Make contactPerson nullable for backward compatibility
ALTER TABLE "ministry_teams" ALTER COLUMN "contact_person" DROP NOT NULL;

