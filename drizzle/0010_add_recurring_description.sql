-- Add recurring description field for custom recurring pattern descriptions
ALTER TABLE "calendar_events" ADD COLUMN "recurring_description" varchar(255);
