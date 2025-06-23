
-- Fix multiple permissive policies on user_ranks table
-- Drop the redundant "System can insert user ranks" policy since "System can manage user ranks" already covers INSERT
DROP POLICY IF EXISTS "System can insert user ranks" ON public.user_ranks;

-- The "System can manage user ranks" policy already exists and covers all operations (INSERT, UPDATE, DELETE, SELECT)
-- using FOR ALL, so no need for a separate INSERT policy
