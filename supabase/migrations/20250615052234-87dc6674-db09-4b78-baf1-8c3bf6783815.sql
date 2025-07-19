
-- Fix the performance issue with user_ranks RLS policy
-- First, let's check the current policies and recreate them with optimized auth calls

DROP POLICY IF EXISTS "Users can view all user ranks" ON public.user_ranks;
DROP POLICY IF EXISTS "System can manage user ranks" ON public.user_ranks;

-- Recreate the policies with optimized auth function calls
CREATE POLICY "Users can view all user ranks" ON public.user_ranks
FOR SELECT USING (true);

CREATE POLICY "System can manage user ranks" ON public.user_ranks
FOR ALL USING (true);
