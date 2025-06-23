
-- Fix multiple permissive policies on user_ranks table for UPDATE action
-- Drop the redundant "System can update user ranks" policy
DROP POLICY IF EXISTS "System can update user ranks" ON public.user_ranks;

-- Keep only "System can manage user ranks" policy which already covers UPDATE operations
-- This policy uses FOR ALL which includes UPDATE, so no need for a separate UPDATE policy
