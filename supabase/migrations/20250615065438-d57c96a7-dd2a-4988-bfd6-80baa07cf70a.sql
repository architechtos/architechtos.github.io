
-- Fix multiple permissive policies on forum_threads table for INSERT action
-- Drop redundant INSERT policies, keeping only one
DROP POLICY IF EXISTS "Authenticated users can create threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.forum_threads;

-- Keep only "Authenticated users can insert threads" policy which already covers INSERT operations
-- This policy should already exist and handle INSERT with CHECK (auth.uid() = user_id)
