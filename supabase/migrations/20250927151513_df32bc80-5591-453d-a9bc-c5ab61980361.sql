-- Create social_accounts table to match frontend expectations
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR NOT NULL,
  prompt TEXT,
  personality TEXT,
  profile_picture_url TEXT,
  days_in_internship INTEGER DEFAULT 0,
  tiktok_url TEXT,
  total_views BIGINT DEFAULT 0,
  workspace_id UUID DEFAULT gen_random_uuid(),
  platform VARCHAR DEFAULT 'tiktok',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on social_accounts
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for social_accounts (public access for now since no auth)
CREATE POLICY "Anyone can view social_accounts" ON public.social_accounts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert social_accounts" ON public.social_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update social_accounts" ON public.social_accounts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete social_accounts" ON public.social_accounts FOR DELETE USING (true);

-- Create workspaces table to match frontend expectations
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL DEFAULT 'Default Workspace',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workspaces
CREATE POLICY "Anyone can view workspaces" ON public.workspaces FOR SELECT USING (true);
CREATE POLICY "Anyone can insert workspaces" ON public.workspaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update workspaces" ON public.workspaces FOR UPDATE USING (true);

-- Add foreign key constraint
ALTER TABLE public.social_accounts 
ADD CONSTRAINT fk_social_accounts_workspace 
FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- Insert default workspace
INSERT INTO public.workspaces (name) VALUES ('Default Workspace') ON CONFLICT DO NOTHING;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_social_accounts_updated_at
    BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();