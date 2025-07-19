
-- Optimize RLS policies on team_badges table.
-- 1. Fix multiple permissive policies for SELECT action.
-- 2. Optimize auth.uid() call to prevent re-evaluation for each row.
-- 3. Split policies by action to fix syntax error from previous attempt.

-- Drop potentially existing policies to ensure a clean state.
DROP POLICY IF EXISTS "Only admins can manage badges" ON public.team_badges;
DROP POLICY IF EXISTS "Admins can manage badges" ON public.team_badges;
DROP POLICY IF EXISTS "Admins can insert badges" ON public.team_badges;
DROP POLICY IF EXISTS "Admins can update badges" ON public.team_badges;
DROP POLICY IF EXISTS "Admins can delete badges" ON public.team_badges;

-- Recreate admin policy for INSERT with an optimized auth call.
CREATE POLICY "Admins can insert badges" ON public.team_badges
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
);

-- Recreate admin policy for UPDATE with an optimized auth call.
CREATE POLICY "Admins can update badges" ON public.team_badges
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
);

-- Recreate admin policy for DELETE with an optimized auth call.
CREATE POLICY "Admins can delete badges" ON public.team_badges
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid())
    AND username IN ('admin', 'maria')
  )
);

-- The "Anyone can view team badges" policy remains and will be the only one evaluated for SELECT operations.
