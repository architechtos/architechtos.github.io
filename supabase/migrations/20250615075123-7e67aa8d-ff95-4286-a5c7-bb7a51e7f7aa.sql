
-- Fix multiple permissive policies on stray_actions table for SELECT action
-- Drop the redundant policy since both policies allow the same access level

DROP POLICY IF EXISTS "Anyone can view stray actions" ON public.stray_actions;

-- Keep only "Users can view all stray actions" policy which already handles all SELECT operations efficiently
-- This ensures only one policy evaluates per SELECT query
