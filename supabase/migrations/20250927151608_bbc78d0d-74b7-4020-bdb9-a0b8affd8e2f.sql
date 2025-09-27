-- Enable RLS on all existing tables
ALTER TABLE public.comptes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entreprise ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for existing tables (public access for now since no auth)
-- Comptes table policies
CREATE POLICY "Anyone can view comptes" ON public.comptes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comptes" ON public.comptes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update comptes" ON public.comptes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete comptes" ON public.comptes FOR DELETE USING (true);

-- Entreprise table policies
CREATE POLICY "Anyone can view entreprise" ON public.entreprise FOR SELECT USING (true);
CREATE POLICY "Anyone can insert entreprise" ON public.entreprise FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update entreprise" ON public.entreprise FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete entreprise" ON public.entreprise FOR DELETE USING (true);

-- Scripts table policies
CREATE POLICY "Anyone can view scripts" ON public.scripts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert scripts" ON public.scripts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update scripts" ON public.scripts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete scripts" ON public.scripts FOR DELETE USING (true);

-- Posts table policies
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete posts" ON public.posts FOR DELETE USING (true);

-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;