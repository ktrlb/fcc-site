-- Add series_name column to calendar_events table for grouping events
ALTER TABLE calendar_events ADD COLUMN series_name VARCHAR(255);

