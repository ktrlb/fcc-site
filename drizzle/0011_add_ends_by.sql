-- Add ends_by column to calendar_events table
ALTER TABLE "calendar_events" ADD COLUMN "ends_by" timestamp;
