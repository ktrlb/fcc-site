-- Add is_external flag to calendar_events to mark outside group facility use
ALTER TABLE "calendar_events"
ADD COLUMN IF NOT EXISTS "is_external" boolean DEFAULT false NOT NULL;


