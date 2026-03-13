-- Add UPDATE policy for complaints table
DROP POLICY IF EXISTS "Users can update their own complaints" ON public.complaints;

CREATE POLICY "Users can update their own complaints"
ON public.complaints
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
