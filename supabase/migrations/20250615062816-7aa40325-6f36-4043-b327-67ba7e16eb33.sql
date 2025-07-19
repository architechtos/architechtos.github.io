
-- Fix the remaining multiple permissive policies issue on strays table
-- Drop both conflicting UPDATE policies
DROP POLICY IF EXISTS "Admins can update any stray" ON public.strays;
DROP POLICY IF EXISTS "Users can update their own strays" ON public.strays;

-- Create a single optimized UPDATE policy that handles both admin and owner cases
CREATE POLICY "Users can update strays" ON public.strays
FOR UPDATE USING (
  registered_by = (SELECT auth.uid()) OR 
  public.is_admin((SELECT auth.uid()))
);
