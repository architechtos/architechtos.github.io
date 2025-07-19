
-- Fix multiple permissive policies on reports table for SELECT action
-- Drop the redundant "Users can view their own reports" policy since "Users can view all reports" already covers all SELECT operations

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;

-- Keep only "Users can view all reports" policy which already handles all SELECT operations efficiently
-- This ensures only one policy evaluates per SELECT query
