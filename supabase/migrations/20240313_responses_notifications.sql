-- STEP 1 — Create responses table
CREATE TABLE IF NOT EXISTS public.responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id uuid REFERENCES public.complaints(id) ON DELETE CASCADE,
  government_response TEXT NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- STEP 2 — Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  complaint_id uuid REFERENCES public.complaints(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read BOOLEAN DEFAULT false
);

-- Add RLS Policies (Basic version)
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Citizens can read responses for their own complaints
CREATE POLICY "Citizens can read responses for their complaints"
ON public.responses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.complaints
    WHERE public.complaints.id = public.responses.complaint_id
    AND public.complaints.user_id = auth.uid()
  )
);

-- Government can insert responses
CREATE POLICY "Government can insert responses"
ON public.responses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE public.profiles.id = auth.uid()
    AND public.profiles.role = 'government'
  )
);

-- Citizens can read their own notifications
CREATE POLICY "Users can read their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Government can insert notifications
CREATE POLICY "Government can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE public.profiles.id = auth.uid()
    AND public.profiles.role = 'government'
  )
);
