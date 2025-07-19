
-- Comprehensive fix for RLS performance issues across all tables
-- This addresses the common pattern of auth function re-evaluation

-- Fix profiles table policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (id = (SELECT auth.uid()));

-- Fix strays table policies
DROP POLICY IF EXISTS "Authenticated users can insert strays" ON public.strays;
DROP POLICY IF EXISTS "Users can update their own strays" ON public.strays;
DROP POLICY IF EXISTS "Admins can update any stray" ON public.strays;

CREATE POLICY "Authenticated users can insert strays" ON public.strays
FOR INSERT WITH CHECK (registered_by = (SELECT auth.uid()));

CREATE POLICY "Users can update their own strays" ON public.strays
FOR UPDATE USING (registered_by = (SELECT auth.uid()));

CREATE POLICY "Admins can update any stray" ON public.strays
FOR UPDATE USING (public.is_admin((SELECT auth.uid())));

-- Fix stray_activities table policies
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.stray_activities;

CREATE POLICY "Authenticated users can insert activities" ON public.stray_activities
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own activities" ON public.stray_activities
FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own activities" ON public.stray_activities
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Fix reports table policies
DROP POLICY IF EXISTS "Authenticated users can insert reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.reports;

CREATE POLICY "Authenticated users can insert reports" ON public.reports
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own reports" ON public.reports
FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own reports" ON public.reports
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Fix forum_threads table policies
DROP POLICY IF EXISTS "Authenticated users can insert threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Users can update their own threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Users can delete their own threads" ON public.forum_threads;

CREATE POLICY "Authenticated users can insert threads" ON public.forum_threads
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own threads" ON public.forum_threads
FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own threads" ON public.forum_threads
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Fix forum_comments table policies
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.forum_comments;

CREATE POLICY "Authenticated users can insert comments" ON public.forum_comments
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own comments" ON public.forum_comments
FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own comments" ON public.forum_comments
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Fix friendships table policies
DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can create friendship requests" ON public.friendships;
DROP POLICY IF EXISTS "Users can update friendship status" ON public.friendships;

CREATE POLICY "Users can view their own friendships" ON public.friendships
FOR SELECT USING (requester_id = (SELECT auth.uid()) OR addressee_id = (SELECT auth.uid()));

CREATE POLICY "Users can create friendship requests" ON public.friendships
FOR INSERT WITH CHECK (requester_id = (SELECT auth.uid()));

CREATE POLICY "Users can update friendship status" ON public.friendships
FOR UPDATE USING (addressee_id = (SELECT auth.uid()) OR requester_id = (SELECT auth.uid()));

-- Fix stray_products table policies
DROP POLICY IF EXISTS "Admins can manage products" ON public.stray_products;

CREATE POLICY "Admins can manage products" ON public.stray_products
FOR ALL USING (public.is_admin((SELECT auth.uid())));

-- Fix team_badges table policies
DROP POLICY IF EXISTS "Admins can manage badges" ON public.team_badges;

CREATE POLICY "Admins can manage badges" ON public.team_badges
FOR ALL USING (public.is_admin((SELECT auth.uid())));

-- Fix point_activities table policies
DROP POLICY IF EXISTS "Users can view their own point activities" ON public.point_activities;

CREATE POLICY "Users can view their own point activities" ON public.point_activities
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix rank_levels table policies
DROP POLICY IF EXISTS "Admins can manage rank levels" ON public.rank_levels;

CREATE POLICY "Admins can manage rank levels" ON public.rank_levels
FOR ALL USING (public.is_admin((SELECT auth.uid())));

-- Fix user_roles table policies
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Only admins can manage roles" ON public.user_roles
FOR ALL USING (public.is_admin((SELECT auth.uid())));
