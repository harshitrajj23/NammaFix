-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    title text,
    category text,
    description text,
    location text,
    image_url text,
    audio_url text,
    status text default 'submitted',
    created_at timestamptz default now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- 3. Add policies so users can access their own complaints
-- Drop existing ones if any to avoid conflicts
DROP POLICY IF EXISTS "Users can insert complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can view their complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can insert their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can view their own complaints" ON public.complaints;

CREATE POLICY "Users can insert complaints"
ON public.complaints
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their complaints"
ON public.complaints
FOR SELECT
USING (auth.uid() = user_id);

-- 4. Storage Setup (Create bucket for images)
-- Note: inserting directly into storage.buckets is common in migration scripts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('complaint-images', 'complaint-images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS Policies for complaint-images
-- Allow public access to view images
CREATE POLICY "Public Access for Complaint Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'complaint-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload complaint images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'complaint-images' 
    AND auth.role() = 'authenticated'
);

-- (Optional) Create bucket and policies for audio if needed
INSERT INTO storage.buckets (id, name, public) 
VALUES ('complaint-audio', 'complaint-audio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for Complaint Audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'complaint-audio');

CREATE POLICY "Authenticated users can upload complaint audio"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'complaint-audio' 
    AND auth.role() = 'authenticated'
);

