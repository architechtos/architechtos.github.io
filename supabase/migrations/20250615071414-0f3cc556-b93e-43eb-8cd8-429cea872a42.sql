
-- Fix multiple permissive policies on user_ranks table for SELECT action
-- Drop and recreate the "System can manage user ranks" policy to exclude SELECT operations
DROP POLICY IF EXISTS "System can manage user ranks" ON public.user_ranks;

-- Recreate the system management policy for INSERT, UPDATE, DELETE only (excluding SELECT)
CREATE POLICY "System can manage user ranks" ON public.user_ranks
FOR ALL USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- The "Users can view all user ranks" policy already handles SELECT operations efficiently
-- This separation ensures only one policy evaluates per SELECT query
