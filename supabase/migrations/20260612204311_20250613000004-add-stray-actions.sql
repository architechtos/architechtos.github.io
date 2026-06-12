-- Create stray_actions table (for timeline)
CREATE TABLE IF NOT EXISTS public.stray_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stray_id UUID NOT NULL REFERENCES strays(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  action_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stray_actions
ALTER TABLE public.stray_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all stray actions" ON public.stray_actions
  FOR SELECT USING (true);

CREATE POLICY "Users can create stray actions" ON public.stray_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add address verification columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS address_verification_document_url TEXT,
ADD COLUMN IF NOT EXISTS address_verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add missing columns to team_badges
ALTER TABLE public.team_badges 
ADD COLUMN IF NOT EXISTS badge_color TEXT DEFAULT '#ff6b35';

-- Add policies for forum_THREADS delete
DROP POLICY IF EXISTS "Users can delete their own threads" ON public.forum_threads;
CREATE POLICY "Users can delete their own threads" ON public.forum_threads
FOR DELETE USING (user_id = auth.uid());