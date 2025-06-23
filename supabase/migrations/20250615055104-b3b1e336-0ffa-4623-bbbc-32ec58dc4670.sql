
-- Fix the performance issue with user_ranks RLS policies
-- Drop existing policies that have performance issues
DROP POLICY IF EXISTS "Anyone can view user ranks" ON public.user_ranks;
DROP POLICY IF EXISTS "users can view their own rank" ON public.user_ranks;
DROP POLICY IF EXISTS "Users can view all user ranks" ON public.user_ranks;
DROP POLICY IF EXISTS "System can manage user ranks" ON public.user_ranks;

-- Recreate the policies with optimized auth function calls
CREATE POLICY "Users can view all user ranks" ON public.user_ranks
FOR SELECT USING (true);

CREATE POLICY "System can manage user ranks" ON public.user_ranks
FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);
