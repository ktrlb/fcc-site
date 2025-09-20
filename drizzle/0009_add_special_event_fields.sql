-- Add new fields for special events
ALTER TABLE "calendar_events" ADD COLUMN "special_event_image" varchar(500);
ALTER TABLE "calendar_events" ADD COLUMN "contact_person" varchar(255);

