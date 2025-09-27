-- Add missing columns to social_accounts table for TikTok account management

-- Add prompt column for AI content generation
ALTER TABLE public.social_accounts 
ADD COLUMN prompt TEXT;

-- Add personality column for AI character personality
ALTER TABLE public.social_accounts 
ADD COLUMN personality TEXT;

-- Add days in internship tracking
ALTER TABLE public.social_accounts 
ADD COLUMN days_in_internship INTEGER DEFAULT 0;

-- Add TikTok URL
ALTER TABLE public.social_accounts 
ADD COLUMN tiktok_url TEXT;

-- Add total views counter
ALTER TABLE public.social_accounts 
ADD COLUMN total_views INTEGER DEFAULT 0;