-- Create strays table
CREATE TABLE IF NOT EXISTS public.strays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  animal_type TEXT NOT NULL DEFAULT 'dog',
  registered_by UUID NOT NULL,
  registerer_username TEXT,
  image_url TEXT,
  image_urls TEXT[],
  age INTEGER,
  birth_year INTEGER,
  gender TEXT,
  fur_colors TEXT,
  coat_colors_tags TEXT[],
  characteristics TEXT[],
  location_description TEXT,
  story TEXT,
  is_neutered BOOLEAN DEFAULT false,
  neutering_date DATE,
  neutering_vet TEXT,
  possible_relatives TEXT,
  relative_animals_tags TEXT[],
  expenses_paid_by TEXT,
  available_for_adoption BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on strays
ALTER TABLE public.strays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view strays" ON public.strays
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert strays" ON public.strays
  FOR INSERT WITH CHECK (auth.uid() = registered_by);

CREATE POLICY "Users can update their own strays" ON public.strays
  FOR UPDATE USING (auth.uid() = registered_by);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  animal_type TEXT NOT NULL,
  description TEXT NOT NULL,
  condition TEXT NOT NULL,
  location_lat NUMERIC,
  location_lng NUMERIC,
  location_description TEXT,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reports" ON public.reports
  FOR SELECT USING (true);

CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON public.reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Create rank_levels table
CREATE TABLE IF NOT EXISTS public.rank_levels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  min_points INTEGER NOT NULL,
  badge_color TEXT NOT NULL DEFAULT '#4CAF50',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default rank levels
INSERT INTO public.rank_levels (name, min_points, badge_color) VALUES
  ('Beginner', 0, '#9E9E9E'),
  ('Helper', 100, '#4CAF50'),
  ('Active Helper', 300, '#2196F3'),
  ('Expert', 600, '#FF9800'),
  ('Master', 1000, '#9C27B0')
ON CONFLICT (name) DO NOTHING;

-- Create point_activities table
CREATE TABLE IF NOT EXISTS public.point_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  activity_type TEXT NOT NULL,
  points INTEGER NOT NULL,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on point_activities
ALTER TABLE public.point_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own point activities" ON public.point_activities
  FOR SELECT USING (auth.uid() = user_id);

-- Create stray_activities table
CREATE TABLE IF NOT EXISTS public.stray_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stray_id UUID NOT NULL REFERENCES strays(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('feeding', 'medical', 'grooming', 'vaccination', 'other')),
  activity_description TEXT NOT NULL,
  notes TEXT,
  quantity NUMERIC,
  unit TEXT,
  cost NUMERIC(10,2),
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_urls TEXT[],
  location_lat NUMERIC,
  location_lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stray_activities
ALTER TABLE public.stray_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all stray activities" 
  ON public.stray_activities 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own stray activities" 
  ON public.stray_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stray activities" 
  ON public.stray_activities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stray activities" 
  ON public.stray_activities 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create stray_products table
CREATE TABLE IF NOT EXISTS public.stray_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_urls TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for products (public read access)
ALTER TABLE public.stray_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.stray_products
  FOR SELECT USING (is_active = true);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view roles" ON public.user_roles
  FOR SELECT USING (true);