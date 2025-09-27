-- Create storyboards and generated_videos tables

-- Create storyboards table
CREATE TABLE public.storyboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    social_account_id UUID NOT NULL REFERENCES public.social_accounts(id),
    user_prompt TEXT NOT NULL,
    enriched_prompt TEXT,
    scenes JSONB,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_videos table
CREATE TABLE public.generated_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    storyboard_id UUID NOT NULL REFERENCES public.storyboards(id),
    video_url TEXT,
    status TEXT NOT NULL DEFAULT 'generating',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for storyboards
ALTER TABLE public.storyboards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own storyboards" ON public.storyboards FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.social_accounts sa
        WHERE sa.id = storyboards.social_account_id
    ));
CREATE POLICY "Users can insert own storyboards" ON public.storyboards FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.social_accounts sa
        WHERE sa.id = storyboards.social_account_id
    ));

-- Add RLS policies for generated_videos
ALTER TABLE public.generated_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own generated videos" ON public.generated_videos FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.storyboards s
        JOIN public.social_accounts sa ON sa.id = s.social_account_id
        WHERE s.id = generated_videos.storyboard_id
    ));
CREATE POLICY "Users can insert own generated videos" ON public.generated_videos FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.storyboards s
        JOIN public.social_accounts sa ON sa.id = s.social_account_id
        WHERE s.id = generated_videos.storyboard_id
    ));