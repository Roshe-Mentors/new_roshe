-- Create mentors table
CREATE TABLE public.mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    bio TEXT,
    expertise TEXT[],
    profile_image_url TEXT,
    user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on the mentors table
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Create policies for the mentors table
CREATE POLICY "Mentors are viewable by everyone" 
    ON public.mentors FOR SELECT USING (true);

CREATE POLICY "Mentors can be edited by the owner" 
    ON public.mentors FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Mentors can be deleted by the owner" 
    ON public.mentors FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Mentors can be inserted by authenticated users" 
    ON public.mentors FOR INSERT WITH CHECK (auth.uid() = user_id);


