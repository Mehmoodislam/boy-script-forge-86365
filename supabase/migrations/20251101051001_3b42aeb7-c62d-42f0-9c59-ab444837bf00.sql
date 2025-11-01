-- Fix search_path for increment_image_views function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix search_path for toggle_image_like function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;