
-- Fix the performance issue with forum_comments RLS policy
-- Drop the problematic policy that is re-evaluating auth functions
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.forum_comments;

-- Recreate the policy with optimized auth function usage
CREATE POLICY "Authenticated users can insert comments" ON public.forum_comments
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
