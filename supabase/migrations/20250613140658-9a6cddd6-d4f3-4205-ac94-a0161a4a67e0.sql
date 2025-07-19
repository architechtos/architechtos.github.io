
-- Add image support to forum threads
ALTER TABLE forum_threads ADD COLUMN image_urls TEXT[];

-- Create stray_activities table for tracking feeding, medical care, etc.
CREATE TABLE public.stray_activities (
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stray_activities
ALTER TABLE public.stray_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stray_activities
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

-- Create storage bucket for thread images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thread-images', 
  'thread-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage bucket for activity images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'activity-images', 
  'activity-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for thread images
CREATE POLICY "Anyone can view thread images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thread-images');

CREATE POLICY "Authenticated users can upload thread images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'thread-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own thread images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'thread-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own thread images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'thread-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for activity images
CREATE POLICY "Anyone can view activity images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'activity-images');

CREATE POLICY "Authenticated users can upload activity images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'activity-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own activity images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'activity-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own activity images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'activity-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
