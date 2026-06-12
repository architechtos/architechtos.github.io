-- Add missing columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add missing columns to forum_threads
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS image_urls TEXT[];
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing forum_threads to have content if null
UPDATE forum_threads SET content = title WHERE content IS NULL;

-- Make content NOT NULL after setting defaults
ALTER TABLE forum_threads ALTER COLUMN content SET NOT NULL;

-- Create forum_comments table
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on forum_comments
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments" ON public.forum_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.forum_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.forum_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.forum_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Update user_ranks table structure
ALTER TABLE public.user_ranks 
DROP COLUMN IF EXISTS current_rank_id;

ALTER TABLE public.user_ranks 
ADD COLUMN IF NOT EXISTS current_rank_id INTEGER REFERENCES public.rank_levels(id);

-- Create friendships table
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