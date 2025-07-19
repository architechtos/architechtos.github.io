
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can insert strays" ON public.strays;
DROP POLICY IF EXISTS "Users can update their own strays" ON public.strays;
DROP POLICY IF EXISTS "Anyone can view strays" ON public.strays;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- First, let's create storage buckets with proper policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']),
  ('strays', 'strays', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies for avatars bucket (drop existing first)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policies for strays bucket (drop existing first)
DROP POLICY IF EXISTS "Stray images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload stray images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own stray images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own stray images" ON storage.objects;

CREATE POLICY "Stray images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'strays');

CREATE POLICY "Users can upload stray images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'strays' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own stray images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'strays' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own stray images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'strays' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add registerer_username column to strays table to store the username
ALTER TABLE public.strays 
ADD COLUMN IF NOT EXISTS registerer_username TEXT;

-- Add RLS policies for strays table
ALTER TABLE public.strays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view strays" ON public.strays
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert strays" ON public.strays
FOR INSERT WITH CHECK (auth.uid() = registered_by);

CREATE POLICY "Users can update their own strays" ON public.strays
FOR UPDATE USING (auth.uid() = registered_by);

-- Add RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Add friends functionality
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  addressee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

-- RLS for friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friendships" ON public.friendships
FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friendship requests" ON public.friendships
FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendship status" ON public.friendships
FOR UPDATE USING (auth.uid() = addressee_id OR auth.uid() = requester_id);
