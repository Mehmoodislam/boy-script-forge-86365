-- Create tables for CMS

-- 1. Pages table
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Posts table
CREATE TABLE IF NOT EXISTS public.cms_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Navigation table
CREATE TABLE IF NOT EXISTS public.cms_navigation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  parent_id UUID REFERENCES public.cms_navigation(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_navigation ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public read pages" ON public.cms_pages FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public read posts" ON public.cms_posts FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public read navigation" ON public.cms_navigation FOR SELECT USING (true);

-- Policies for authenticated management
CREATE POLICY "Admin manage pages" ON public.cms_pages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage posts" ON public.cms_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage navigation" ON public.cms_navigation FOR ALL TO authenticated USING (true);
