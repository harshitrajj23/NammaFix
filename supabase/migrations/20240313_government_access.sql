-- Allow government/authenticated users to read all complaints
-- This assumes public.complaints is the table name
CREATE POLICY "Government can read complaints"
ON public.complaints
FOR SELECT
USING (true);
