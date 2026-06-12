-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']),
  ('strays', 'strays', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']),
  ('thread-images', 'thread-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']),
  ('activity-images', 'activity-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for strays
DROP POLICY IF EXISTS "Stray images are publicly accessible" ON storage.objects;
CREATE POLICY "Stray images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'strays');

DROP POLICY IF EXISTS "Users can upload stray images" ON storage.objects;
CREATE POLICY "Users can upload stray images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'strays' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can view thread images" ON storage.objects;
CREATE POLICY "Anyone can view thread images" ON storage.objects
FOR SELECT USING (bucket_id = 'thread-images');

DROP POLICY IF EXISTS "Authenticated users can upload thread images" ON storage.objects;
CREATE POLICY "Authenticated users can upload thread images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'thread-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can view activity images" ON storage.objects;
CREATE POLICY "Anyone can view activity images" ON storage.objects
FOR SELECT USING (bucket_id = 'activity-images');

DROP POLICY IF EXISTS "Authenticated users can upload activity images" ON storage.objects;
CREATE POLICY "Authenticated users can upload activity images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'activity-images' AND auth.role() = 'authenticated');