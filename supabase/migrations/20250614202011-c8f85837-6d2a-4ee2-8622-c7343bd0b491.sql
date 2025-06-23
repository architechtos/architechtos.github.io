
-- First, drop any existing conflicting policies more comprehensively
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view forum threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Authenticated users can insert forum threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Users can update their own forum threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Authenticated users can insert threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Users can update their own threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.forum_comments;
DROP POLICY IF EXISTS "Users can view all stray activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can create their own stray activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can update their own stray activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can delete their own stray activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON public.stray_activities;
DROP POLICY IF EXISTS "Users can view all reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can insert reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.stray_products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.stray_products;
DROP POLICY IF EXISTS "Anyone can view team badges" ON public.team_badges;
DROP POLICY IF EXISTS "Only admins can manage badges" ON public.team_badges;
DROP POLICY IF EXISTS "Admins can manage badges" ON public.team_badges;
DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can create friendship requests" ON public.friendships;
DROP POLICY IF EXISTS "Users can update friendship status" ON public.friendships;
DROP POLICY IF EXISTS "Anyone can view strays" ON public.strays;
DROP POLICY IF EXISTS "Authenticated users can insert strays" ON public.strays;
DROP POLICY IF EXISTS "Users can update their own strays" ON public.strays;
DROP POLICY IF EXISTS "Admins can update any stray" ON public.strays;
DROP POLICY IF EXISTS "Users can view all stray actions" ON public.stray_actions;
DROP POLICY IF EXISTS "Authenticated users can insert actions" ON public.stray_actions;
DROP POLICY IF EXISTS "Users can view their own point activities" ON public.point_activities;
DROP POLICY IF EXISTS "System can insert point activities" ON public.point_activities;
DROP POLICY IF EXISTS "Anyone can view rank levels" ON public.rank_levels;
DROP POLICY IF EXISTS "Admins can manage rank levels" ON public.rank_levels;
DROP POLICY IF EXISTS "Users can view all user ranks" ON public.user_ranks;
DROP POLICY IF EXISTS "System can manage user ranks" ON public.user_ranks;

-- Create user roles table for proper admin access control
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = check_user_id 
  ORDER BY CASE role 
    WHEN 'admin' THEN 1 
    WHEN 'moderator' THEN 2 
    WHEN 'user' THEN 3 
  END 
  LIMIT 1;
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;

-- Insert admin roles for existing admin users
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'admin'
FROM public.profiles p
WHERE p.username IN ('admin', 'maria')
ON CONFLICT (user_id, role) DO NOTHING;

-- Enable RLS on all tables that don't have it
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stray_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ranks ENABLE ROW LEVEL SECURITY;

-- PROFILES TABLE POLICIES
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- USER_ROLES TABLE POLICIES
CREATE POLICY "Users can view all roles" ON public.user_roles
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage roles" ON public.user_roles
FOR ALL USING (public.is_admin(auth.uid()));

-- STRAYS TABLE POLICIES
CREATE POLICY "Anyone can view strays" ON public.strays
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert strays" ON public.strays
FOR INSERT WITH CHECK (auth.uid() = registered_by);

CREATE POLICY "Users can update their own strays" ON public.strays
FOR UPDATE USING (auth.uid() = registered_by);

CREATE POLICY "Admins can update any stray" ON public.strays
FOR UPDATE USING (public.is_admin(auth.uid()));

-- STRAY_ACTIVITIES TABLE POLICIES
CREATE POLICY "Users can view all stray activities" ON public.stray_activities
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert activities" ON public.stray_activities
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON public.stray_activities
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" ON public.stray_activities
FOR DELETE USING (auth.uid() = user_id);

-- REPORTS TABLE POLICIES
CREATE POLICY "Users can view all reports" ON public.reports
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reports" ON public.reports
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.reports
FOR UPDATE USING (auth.uid() = user_id);

-- FORUM_THREADS TABLE POLICIES
CREATE POLICY "Anyone can view forum threads" ON public.forum_threads
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert threads" ON public.forum_threads
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads" ON public.forum_threads
FOR UPDATE USING (auth.uid() = user_id);

-- FORUM_COMMENTS TABLE POLICIES
CREATE POLICY "Anyone can view comments" ON public.forum_comments
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON public.forum_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.forum_comments
FOR UPDATE USING (auth.uid() = user_id);

-- FRIENDSHIPS TABLE POLICIES
CREATE POLICY "Users can view their own friendships" ON public.friendships
FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friendship requests" ON public.friendships
FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendship status" ON public.friendships
FOR UPDATE USING (auth.uid() = addressee_id OR auth.uid() = requester_id);

-- STRAY_ACTIONS TABLE POLICIES
CREATE POLICY "Users can view all stray actions" ON public.stray_actions
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert actions" ON public.stray_actions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STRAY_PRODUCTS TABLE POLICIES
CREATE POLICY "Anyone can view active products" ON public.stray_products
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.stray_products
FOR ALL USING (public.is_admin(auth.uid()));

-- TEAM_BADGES TABLE POLICIES
CREATE POLICY "Anyone can view team badges" ON public.team_badges
FOR SELECT USING (true);

CREATE POLICY "Admins can manage badges" ON public.team_badges
FOR ALL USING (public.is_admin(auth.uid()));

-- POINT_ACTIVITIES TABLE POLICIES
CREATE POLICY "Users can view their own point activities" ON public.point_activities
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert point activities" ON public.point_activities
FOR INSERT WITH CHECK (true);

-- RANK_LEVELS TABLE POLICIES
CREATE POLICY "Anyone can view rank levels" ON public.rank_levels
FOR SELECT USING (true);

CREATE POLICY "Admins can manage rank levels" ON public.rank_levels
FOR ALL USING (public.is_admin(auth.uid()));

-- USER_RANKS TABLE POLICIES
CREATE POLICY "Users can view all user ranks" ON public.user_ranks
FOR SELECT USING (true);

CREATE POLICY "System can manage user ranks" ON public.user_ranks
FOR ALL USING (true);
