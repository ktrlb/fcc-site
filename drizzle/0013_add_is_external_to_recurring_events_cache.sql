ALTER TABLE "recurring_events_cache" ADD COLUMN IF NOT EXISTS "is_external" boolean DEFAULT false NOT NULL;

