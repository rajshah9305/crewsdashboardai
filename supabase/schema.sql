-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission TEXT NOT NULL,
  result TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS missions_created_at_idx ON missions(created_at DESC);
CREATE INDEX IF NOT EXISTS missions_status_idx ON missions(status);

-- Enable Row Level Security
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth requirements)
CREATE POLICY "Allow all operations" ON missions
  FOR ALL
  USING (true)
  WITH CHECK (true);
