
-- Create the reports storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reports',
  'reports', 
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
);

-- Create storage policy for reports bucket
CREATE POLICY "Anyone can upload report images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reports');

CREATE POLICY "Anyone can view report images" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports');
