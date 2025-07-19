
-- Remove duplicate INSERT policies for stray_actions table
DROP POLICY IF EXISTS "Authenticated users can insert actions" ON public.stray_actions;
DROP POLICY IF EXISTS "Authenticated users can insert stray actions" ON public.stray_actions;

-- Create a single optimized INSERT policy
CREATE POLICY "Authenticated users can insert stray actions" ON public.stray_actions
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
