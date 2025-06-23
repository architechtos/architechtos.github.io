
-- Fix the performance issue with strays RLS policy
-- Drop the problematic policy that is re-evaluating auth functions
DROP POLICY IF EXISTS "Users can update strays they registered" ON public.strays;
DROP POLICY IF EXISTS "Users can update their own strays" ON public.strays;

-- Recreate the policy with optimized auth function usage
CREATE POLICY "Users can update their own strays" ON public.strays
FOR UPDATE USING (registered_by = (SELECT auth.uid()));
