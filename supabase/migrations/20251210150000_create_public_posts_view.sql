-- Create a public view for blog posts that:
-- 1. Only exposes public-safe columns (no user_id)
-- 2. Joins author info from profiles
-- 3. Only shows published posts

CREATE OR REPLACE VIEW public.public_posts AS
SELECT 
  p.id,
  p.slug,
  p.title,
  p.summary,
  p.body,
  p.image,
  p.read_time,
  p.created_at,
  COALESCE(pr.first_name, p.author, 'Anonymous') AS author_name,
  pr.avatar_url AS author_avatar
FROM public.posts p
LEFT JOIN public.profiles pr ON pr.id = p.user_id
WHERE p.status = 'published';

-- Grant access to anon and authenticated roles
GRANT SELECT ON public.public_posts TO anon, authenticated;

-- Tighten profiles RLS: only expose profiles for users who have published posts
-- This prevents exposing profile data for users who haven't published anything
DROP POLICY IF EXISTS "Public can view author info" ON public.profiles;

CREATE POLICY "Public can view published authors"
  ON public.profiles FOR SELECT
  USING (
    -- Either the user is viewing their own profile
    auth.uid() = id
    OR
    -- Or this profile belongs to someone with at least one published post
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.user_id = profiles.id 
      AND posts.status = 'published'
    )
  );
