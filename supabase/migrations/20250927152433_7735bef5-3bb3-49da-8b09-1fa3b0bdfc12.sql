-- Add missing columns to comptes table
ALTER TABLE public.comptes 
ADD COLUMN IF NOT EXISTS days_in_internship integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS platform character varying DEFAULT 'tiktok';

-- Create trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS update_comptes_updated_at ON public.comptes;
CREATE TRIGGER update_comptes_updated_at
    BEFORE UPDATE ON public.comptes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Drop the redundant tables
DROP TABLE IF EXISTS public.social_accounts CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;