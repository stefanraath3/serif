-- Policy: Public can view author info (first_name and avatar_url) for displaying on published posts
CREATE POLICY "Public can view author info"
  ON public.profiles FOR SELECT
  USING (true);
