
-- Fix the performance issue with stray_actions RLS policy
-- Drop the problematic policy that is re-evaluating auth functions
DROP POLICY IF EXISTS "Users can create stray actions" ON public.stray_actions;
DROP POLICY IF EXISTS "Authenticated users can insert actions" ON public.stray_actions;
DROP POLICY IF EXISTS "Authenticated users can insert stray actions" ON public.stray_actions;

-- Create a single optimized INSERT policy
CREATE POLICY "Authenticated users can insert stray actions" ON public.stray_actions
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
