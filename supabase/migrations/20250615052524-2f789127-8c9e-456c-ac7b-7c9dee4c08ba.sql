
-- Add the missing optimized DELETE policy for reports
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.reports;

CREATE POLICY "Users can delete their own reports" ON public.reports
FOR DELETE USING (user_id = (SELECT auth.uid()));
