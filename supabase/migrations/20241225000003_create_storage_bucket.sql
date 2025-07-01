-- Create storage bucket for experience images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('experience-images', 'experience-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view experience images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload experience images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own experience images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own experience images" ON storage.objects;

-- Set up storage policies for experience images bucket
CREATE POLICY "Anyone can view experience images" ON storage.objects
  FOR SELECT USING (bucket_id = 'experience-images');

CREATE POLICY "Authenticated users can upload experience images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'experience-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own experience images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'experience-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own experience images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'experience-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  ); 