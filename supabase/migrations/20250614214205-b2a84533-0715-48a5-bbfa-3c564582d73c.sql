
-- Reset all user points and activities for testing
DELETE FROM public.point_activities;
DELETE FROM public.user_ranks;

-- Reset auto-increment sequences if they exist
-- This ensures clean slate for testing
