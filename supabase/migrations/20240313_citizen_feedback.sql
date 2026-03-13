-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id uuid REFERENCES public.complaints(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Citizens can insert their own feedback" 
ON public.feedback FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Government can read all feedback" 
ON public.feedback FOR SELECT 
TO authenticated 
USING (true); -- Assuming any authenticated user for now, but in production we should check role
