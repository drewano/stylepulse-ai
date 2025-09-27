-- Enable RLS on videos_backup table or drop it if not needed
ALTER TABLE public.videos_backup ENABLE ROW LEVEL SECURITY;

-- Create simple policy for backup table
CREATE POLICY "Anyone can manage videos_backup" 
ON public.videos_backup 
FOR ALL 
USING (true)
WITH CHECK (true);