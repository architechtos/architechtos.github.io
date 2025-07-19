
-- Fix the performance issue with rank_levels RLS policy
DROP POLICY IF EXISTS "Admins can manage rank levels" ON public.rank_levels;

CREATE POLICY "Admins can manage rank levels" ON public.rank_levels
FOR ALL USING (public.is_admin((SELECT auth.uid())));
