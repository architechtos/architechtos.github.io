
-- Create table for stray feeder products
CREATE TABLE public.stray_products (
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

-- Only admins can manage products (we'll handle this in the app)
CREATE POLICY "Admins can manage products" ON public.stray_products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      username = 'admin' OR 
      username = 'maria'
    )
  )
);

-- Add address verification fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN address_verified BOOLEAN DEFAULT false,
ADD COLUMN address_verification_document_url TEXT,
ADD COLUMN address_verification_status TEXT DEFAULT 'pending',
ADD COLUMN verification_submitted_at TIMESTAMP WITH TIME ZONE;

-- Create team badges table
CREATE TABLE public.team_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_color TEXT NOT NULL DEFAULT '#ff6b35',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_name)
);

-- Enable RLS for team badges
ALTER TABLE public.team_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team badges" ON public.team_badges
FOR SELECT USING (true);

-- Only specific users can manage badges
CREATE POLICY "Only admins can manage badges" ON public.team_badges
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND username IN ('admin', 'maria')
  )
);

-- Insert default team badges for admin and maria
INSERT INTO public.team_badges (user_id, badge_name, badge_color)
SELECT p.id, 'Ομάδα Adespolis', '#ff6b35'
FROM public.profiles p
WHERE p.username IN ('admin', 'maria')
ON CONFLICT (user_id, badge_name) DO NOTHING;
