-- Create table for image stats
CREATE TABLE IF NOT EXISTS public.image_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id TEXT NOT NULL UNIQUE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.image_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view image stats" 
  ON public.image_stats 
  FOR SELECT 
  USING (true);

-- Create policies for public insert/update (for views and likes)
CREATE POLICY "Anyone can insert image stats" 
  ON public.image_stats 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update image stats" 
  ON public.image_stats 
  FOR UPDATE 
  USING (true);

-- Create function to increment views
CREATE OR REPLACE FUNCTION public.increment_image_views(p_image_id TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO public.image_stats (image_id, views, likes)
  VALUES (p_image_id, 1, 0)
  ON CONFLICT (image_id) 
  DO UPDATE SET 
    views = image_stats.views + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to toggle like
CREATE OR REPLACE FUNCTION public.toggle_image_like(p_image_id TEXT, p_increment BOOLEAN)
RETURNS INTEGER AS $$
DECLARE
  new_likes INTEGER;
BEGIN
  INSERT INTO public.image_stats (image_id, views, likes)
  VALUES (p_image_id, 0, CASE WHEN p_increment THEN 1 ELSE 0 END)
  ON CONFLICT (image_id) 
  DO UPDATE SET 
    likes = CASE 
      WHEN p_increment THEN image_stats.likes + 1 
      ELSE GREATEST(image_stats.likes - 1, 0)
    END,
    updated_at = now()
  RETURNING likes INTO new_likes;
  
  RETURN new_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;