-- First, let's create a backup of existing data if any
CREATE TABLE IF NOT EXISTS videos_backup AS SELECT * FROM videos;

-- Drop the existing videos table
DROP TABLE videos;

-- Create the new videos table with classic ID and compte_id link
CREATE TABLE public.videos (
  id SERIAL PRIMARY KEY,
  compte_id INTEGER NOT NULL REFERENCES public.comptes(id) ON DELETE CASCADE,
  script_id BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  video_url TEXT,
  error_message TEXT,
  gcp_operation_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for videos
CREATE POLICY "Anyone can manage videos" 
ON public.videos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();