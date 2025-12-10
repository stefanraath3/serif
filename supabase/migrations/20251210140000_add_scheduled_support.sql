-- Add scheduled_at column
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;

-- Update status check to include 'scheduled'
ALTER TABLE public.posts
  DROP CONSTRAINT IF EXISTS posts_status_check;

ALTER TABLE public.posts
  ADD CONSTRAINT posts_status_check CHECK (status IN ('draft', 'published', 'scheduled'));

-- Public read policy for published posts
-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
CREATE POLICY "Anyone can view published posts"
  ON public.posts FOR SELECT
  USING (status = 'published');
