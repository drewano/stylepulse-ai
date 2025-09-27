-- Fix RLS policies for videos table  
-- The previous policy might not have been applied correctly
DROP POLICY IF EXISTS "Anyone can manage videos" ON public.videos;

-- Create proper RLS policies for videos
CREATE POLICY "Anyone can view videos" 
ON public.videos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert videos" 
ON public.videos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update videos" 
ON public.videos 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete videos" 
ON public.videos 
FOR DELETE 
USING (true);