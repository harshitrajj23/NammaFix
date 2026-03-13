-- Add latitude and longitude columns to complaints table
ALTER TABLE public.complaints 
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Update RLS policies if necessary (not needed here as standard columns are covered by existing table policies)
