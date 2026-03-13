-- 1. Ensure the bucket is public
UPDATE storage.buckets SET public = true WHERE id = 'complaint-audio';

-- 2. Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Public Access for Complaint Audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload complaint audio" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view complaint audio" ON storage.objects;
DROP POLICY IF EXISTS "Verified users can upload audio" ON storage.objects;

-- 3. Create explicit public SELECT policy for everyone (anon and authenticated)
CREATE POLICY "Anyone can view complaint audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'complaint-audio');

-- 4. Create explicit INSERT policy for authenticated users
CREATE POLICY "Verified users can upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'complaint-audio');

-- 5. Create explicit UPDATE/DELETE policy for users (owning their files) 
-- (Though not strictly needed for basic playback, it helps with data management)
CREATE POLICY "Users can manage their own audio"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'complaint-audio' AND (storage.foldername(name))[1] = auth.uid()::text);
