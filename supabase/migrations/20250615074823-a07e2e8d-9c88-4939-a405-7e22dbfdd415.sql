
-- Fix the performance issue with reports RLS policy
-- Replace auth.uid() with (SELECT auth.uid()) to prevent re-evaluation for each row

DROP POLICY IF EXISTS "Authenticated users can insert reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;

-- Recreate the policies with optimized auth function calls
CREATE POLICY "Authenticated users can insert reports" ON public.reports
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own reports" ON public.reports
FOR UPDATE USING (user_id = (SELECT auth.uid()));
