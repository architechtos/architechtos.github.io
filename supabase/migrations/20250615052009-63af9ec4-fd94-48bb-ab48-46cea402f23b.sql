
-- Add the missing optimized DELETE policy for forum_threads
DROP POLICY IF EXISTS "Users can delete their own threads" ON public.forum_threads;

CREATE POLICY "Users can delete their own threads" ON public.forum_threads
FOR DELETE USING (user_id = (SELECT auth.uid()));
