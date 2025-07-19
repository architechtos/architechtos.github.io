
-- Fix multiple permissive policies on profiles table
-- Drop the redundant "Anyone can view profiles" policy since "Users can view all profiles" already allows this
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- The "Users can view all profiles" policy already exists and covers both authenticated and anonymous users
-- No need to recreate it as it uses USING (true) which allows all access
