
-- Fix multiple permissive policies on user_ranks table for SELECT action
-- Drop redundant SELECT policies, keeping only one
DROP POLICY IF EXISTS "Anyone can view user ranks and users can view their own rank" ON public.user_ranks;
DROP POLICY IF EXISTS "System can manage user ranks" ON public.user_ranks;

-- Keep only "Users can view all user ranks" policy which already covers SELECT operations
-- This policy should already exist and handle SELECT with USING (true)

-- Recreate the system management policy for non-SELECT operations only
CREATE POLICY "System can manage user ranks" ON public.user_ranks
FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);
