-- Align types and add FK for PostgREST relationship so joins work
BEGIN;

-- 1) Ensure script_id uses the same type as scripts.id (integer)
ALTER TABLE public.videos 
  ALTER COLUMN script_id TYPE integer USING script_id::integer;

-- 2) Add the foreign key to scripts(id) so we can select scripts!inner(...)
DO $$
BEGIN
  -- Drop existing FK if present to avoid duplicates
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_schema = 'public' AND table_name = 'videos' AND constraint_name = 'videos_script_id_fkey'
  ) THEN
    ALTER TABLE public.videos DROP CONSTRAINT videos_script_id_fkey;
  END IF;
END $$;

ALTER TABLE public.videos
  ADD CONSTRAINT videos_script_id_fkey
  FOREIGN KEY (script_id) REFERENCES public.scripts(id) ON DELETE CASCADE;

-- 3) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_videos_compte_created ON public.videos (compte_id, created_at);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos (status);
CREATE INDEX IF NOT EXISTS idx_videos_script_id ON public.videos (script_id);

COMMIT;