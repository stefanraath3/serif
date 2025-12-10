-- Remove the permissive public read policy on profiles
-- This prevents direct access to the full profiles table
DROP POLICY IF EXISTS "Public can view published authors" ON public.profiles;

-- Drop the existing views so we can recreate them with security_invoker = false
DROP VIEW IF EXISTS public.public_posts;

-- Recreate public_posts view with security_invoker = false
-- This means the view runs with the OWNER's permissions (bypasses RLS for underlying tables)
-- The view itself still only exposes the columns we define - nothing more
CREATE VIEW public.public_posts 
WITH (security_invoker = false)
AS
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

-- Grant access to the view (this is the ONLY way to access this data publicly)
GRANT SELECT ON public.public_posts TO anon, authenticated;

-- Create public_authors view for cases where we need author info separately
-- Also uses security_invoker = false to bypass RLS on profiles
CREATE VIEW public.public_authors 
WITH (security_invoker = false)
AS
SELECT 
  pr.id,
  pr.first_name AS display_name,
  pr.avatar_url
FROM public.profiles pr
WHERE EXISTS (
  SELECT 1 FROM public.posts 
  WHERE posts.user_id = pr.id 
  AND posts.status = 'published'
);

-- Grant access to anon and authenticated roles
GRANT SELECT ON public.public_authors TO anon, authenticated;

-- Now profiles table has NO public access at all
-- Users can only:
-- 1. View their own profile (via "Users can view own profile" policy)
-- 2. See limited author info through the public_posts or public_authors VIEWS
