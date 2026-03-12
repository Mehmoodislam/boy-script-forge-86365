
-- CMS Pages table
CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text DEFAULT '',
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CMS Posts table
CREATE TABLE public.cms_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text DEFAULT '',
  featured_image text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CMS Navigation table
CREATE TABLE public.cms_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  path text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_navigation ENABLE ROW LEVEL SECURITY;

-- Public read for published pages
CREATE POLICY "Anyone can view published pages" ON public.cms_pages FOR SELECT USING (is_published = true);
-- Authenticated users full access
CREATE POLICY "Authenticated users can manage pages" ON public.cms_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read for published posts
CREATE POLICY "Anyone can view published posts" ON public.cms_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage posts" ON public.cms_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read for navigation
CREATE POLICY "Anyone can view navigation" ON public.cms_navigation FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage navigation" ON public.cms_navigation FOR ALL TO authenticated USING (true) WITH CHECK (true);
