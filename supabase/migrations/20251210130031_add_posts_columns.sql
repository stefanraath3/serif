-- Add new columns to posts table
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS body text,
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS author text,
  ADD COLUMN IF NOT EXISTS read_time integer;

-- Migrate data from content to body if content column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'content'
  ) THEN
    UPDATE public.posts
    SET body = content
    WHERE body IS NULL AND content IS NOT NULL;
    
    -- Drop the old content column
    ALTER TABLE public.posts DROP COLUMN IF EXISTS content;
  END IF;
END $$;
