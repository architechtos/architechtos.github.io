
-- Fix multiple permissive policies on user_ranks table for SELECT action
-- Drop the current "System can manage user ranks" policy
DROP POLICY IF EXISTS "System can manage user ranks" ON public.user_ranks;

-- Create separate policies for different operations to avoid overlap
-- Policy for INSERT operations only
CREATE POLICY "System can insert user ranks" ON public.user_ranks
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Policy for UPDATE operations only  
CREATE POLICY "System can update user ranks" ON public.user_ranks
FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Policy for DELETE operations only
CREATE POLICY "System can delete user ranks" ON public.user_ranks
FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL);

-- The "Users can view all user ranks" policy already handles SELECT operations efficiently
-- This separation ensures only one policy evaluates per query type
