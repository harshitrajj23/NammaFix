-- Add votes count to complaints table
ALTER TABLE public.complaints 
ADD COLUMN IF NOT EXISTS votes integer DEFAULT 0;

-- Create table to track unique user votes per complaint
CREATE TABLE IF NOT EXISTS public.complaint_votes (
    id uuid primary key default uuid_generate_v4(),
    complaint_id uuid references public.complaints(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamptz default now(),
    unique(complaint_id, user_id)
);

-- Enable RLS for complaint_votes
ALTER TABLE public.complaint_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can vote once per complaint"
ON public.complaint_votes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can see vote records"
ON public.complaint_votes
FOR SELECT
USING (true);

-- Function to update votes count and severity in complaints table
CREATE OR REPLACE FUNCTION update_complaint_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- Update votes count
    UPDATE public.complaints 
    SET votes = (
        SELECT count(*) 
        FROM public.complaint_votes 
        WHERE complaint_id = NEW.complaint_id
    )
    WHERE id = NEW.complaint_id;

    -- Update severity based on new votes count
    -- 0-5: No change or keep original
    -- 6-15: Escalate to High if not critical
    -- 16+: Escalate to Critical
    UPDATE public.complaints 
    SET severity = CASE 
        WHEN votes >= 16 THEN 'critical'
        WHEN votes >= 6 AND severity NOT IN ('critical') THEN 'high'
        ELSE severity
    END
    WHERE id = NEW.complaint_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for complaint_votes
DROP TRIGGER IF EXISTS tr_on_vote ON public.complaint_votes;
CREATE TRIGGER tr_on_vote
AFTER INSERT ON public.complaint_votes
FOR EACH ROW
EXECUTE FUNCTION update_complaint_votes();
