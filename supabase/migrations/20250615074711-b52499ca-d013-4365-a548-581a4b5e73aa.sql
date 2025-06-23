
-- Fix multiple permissive policies on rank_levels table for SELECT action
-- Drop the current "Admins can manage rank levels" policy and recreate it for non-SELECT operations only
DROP POLICY IF EXISTS "Admins can manage rank levels" ON public.rank_levels;

-- Create separate policies for different operations to avoid overlap with the existing "Anyone can view rank levels" policy
-- Policy for INSERT operations only (must use WITH CHECK for INSERT)
CREATE POLICY "Admins can insert rank levels" ON public.rank_levels
FOR INSERT WITH CHECK (public.is_admin((SELECT auth.uid())));

-- Policy for UPDATE operations only  
CREATE POLICY "Admins can update rank levels" ON public.rank_levels
FOR UPDATE USING (public.is_admin((SELECT auth.uid())));

-- Policy for DELETE operations only
CREATE POLICY "Admins can delete rank levels" ON public.rank_levels
FOR DELETE USING (public.is_admin((SELECT auth.uid())));

-- The "Anyone can view rank levels" policy already handles SELECT operations efficiently
-- This separation ensures only one policy evaluates per query type
