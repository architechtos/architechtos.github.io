
-- Add missing image_urls column to strays table
ALTER TABLE public.strays 
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Add RLS policies for forum_threads table
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view forum threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Authenticated users can insert forum threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Users can update their own forum threads" ON public.forum_threads;

CREATE POLICY "Anyone can view forum threads" ON public.forum_threads
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert forum threads" ON public.forum_threads
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum threads" ON public.forum_threads
FOR UPDATE USING (auth.uid() = user_id);

-- Add bio column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;
