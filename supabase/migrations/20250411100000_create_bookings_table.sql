CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL,
  user_id UUID NOT NULL,
  booking_date TEXT NOT NULL, -- Format: "18 Jan"
  booking_time TEXT NOT NULL, -- Format: "6:00pm"
  session_type TEXT NOT NULL, -- "Mentorship" or "Coaching"
  meeting_id TEXT NOT NULL,
  meeting_url TEXT NOT NULL,
  meeting_password TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT fk_mentor
    FOREIGN KEY(mentor_id)
    REFERENCES mentors(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create index for faster lookup
CREATE INDEX idx_bookings_mentor_id ON bookings(mentor_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, booking_time);

-- Add RLS policies for security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for mentors to view bookings where they are the mentor
CREATE POLICY "Mentors can view their assigned bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM mentors WHERE id = mentor_id
  ));

-- Policy for inserting bookings (all authenticated users can create bookings)
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();