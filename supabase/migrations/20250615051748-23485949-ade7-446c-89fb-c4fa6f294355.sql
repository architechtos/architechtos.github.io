
-- Drop existing policies that have performance issues
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own point activities" ON public.point_activities;
DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can create friendship requests" ON public.friendships;
DROP POLICY IF EXISTS "Users can update friendship status" ON public.friendships;
DROP POLICY IF EXISTS "Authenticated users can insert strays" ON public.strays;
DROP POLICY IF EXISTS "Users can update their own strays" ON public.strays;
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Authenticated users can insert reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can insert threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Users can update their own threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Authenticated users can insert actions" ON public.stray_actions;

-- Recreate policies with optimized subqueries for better performance

-- PROFILES TABLE POLICIES
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (id = (SELECT auth.uid()));

-- STRAYS TABLE POLICIES
CREATE POLICY "Authenticated users can insert strays" ON public.strays
FOR INSERT WITH CHECK (registered_by = (SELECT auth.uid()));

CREATE POLICY "Users can update their own strays" ON public.strays
FOR UPDATE USING (registered_by = (SELECT auth.uid()));

-- STRAY_ACTIVITIES TABLE POLICIES
CREATE POLICY "Authenticated users can insert activities" ON public.stray_activities
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own activities" ON public.stray_activities
FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own activities" ON public.stray_activities
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- REPORTS TABLE POLICIES
CREATE POLICY "Authenticated users can insert reports" ON public.reports
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own reports" ON public.reports
FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- FORUM_THREADS TABLE POLICIES
CREATE POLICY "Authenticated users can insert threads" ON public.forum_threads
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own threads" ON public.forum_threads
FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- FORUM_COMMENTS TABLE POLICIES
CREATE POLICY "Authenticated users can insert comments" ON public.forum_comments
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own comments" ON public.forum_comments
FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- FRIENDSHIPS TABLE POLICIES
CREATE POLICY "Users can view their own friendships" ON public.friendships
FOR SELECT USING (requester_id = (SELECT auth.uid()) OR addressee_id = (SELECT auth.uid()));

CREATE POLICY "Users can create friendship requests" ON public.friendships
FOR INSERT WITH CHECK (requester_id = (SELECT auth.uid()));

CREATE POLICY "Users can update friendship status" ON public.friendships
FOR UPDATE USING (addressee_id = (SELECT auth.uid()) OR requester_id = (SELECT auth.uid()));

-- STRAY_ACTIONS TABLE POLICIES
CREATE POLICY "Authenticated users can insert actions" ON public.stray_actions
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

-- POINT_ACTIVITIES TABLE POLICIES
CREATE POLICY "Users can view their own point activities" ON public.point_activities
FOR SELECT USING (user_id = (SELECT auth.uid()));
