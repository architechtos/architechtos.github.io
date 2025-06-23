
-- Fix multiple permissive SELECT policies on the strays table.
-- The "Anyone can view strays" policy already covers all users, including authenticated ones.
-- The "Authenticated users can view strays" policy is therefore redundant and causes a performance issue.
-- This migration removes the redundant policy.
DROP POLICY IF EXISTS "Authenticated users can view strays" ON public.strays;
