-- Enable RLS on the mentors table if not already enabled
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.mentors;

-- Create new policy for insertions
CREATE POLICY "Allow insert for authenticated users"
ON public.mentors
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Optional: Add a policy for users to view their own data
CREATE POLICY "Allow users to view own data"
ON public.mentors
FOR SELECT
USING (auth.uid() = user_id);