
-- Add location columns to stray_activities table
ALTER TABLE public.stray_activities 
ADD COLUMN location_lat NUMERIC,
ADD COLUMN location_lng NUMERIC;
