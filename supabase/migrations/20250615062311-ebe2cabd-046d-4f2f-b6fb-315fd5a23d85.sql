
-- Fix multiple permissive policies on user_roles table
-- Drop the conflicting policies
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

-- Create a single SELECT policy that allows users to view all roles
CREATE POLICY "Users can view all user roles" ON public.user_roles
FOR SELECT USING (true);

-- Create separate policies for other operations that only admins can perform
CREATE POLICY "Only admins can insert roles" ON public.user_roles
FOR INSERT WITH CHECK (public.is_admin((SELECT auth.uid())));

CREATE POLICY "Only admins can update roles" ON public.user_roles
FOR UPDATE USING (public.is_admin((SELECT auth.uid())));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
FOR DELETE USING (public.is_admin((SELECT auth.uid())));
