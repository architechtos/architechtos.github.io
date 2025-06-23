
-- Fix multiple permissive policies on reports table for INSERT action
-- Drop redundant INSERT policy, keeping only one
DROP POLICY IF EXISTS "Users can create their own reports" ON public.reports;

-- Keep only "Authenticated users can insert reports" policy which already covers INSERT operations
-- This policy should already exist and handle INSERT with CHECK (auth.uid() = user_id)
