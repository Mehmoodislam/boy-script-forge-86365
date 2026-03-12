import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

export default function DynamicPage() {
  const { slug } = useParams();

  const { data: page, isLoading } = useQuery({
    queryKey: ['cms-page', slug],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('cms_pages' as any)
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single() as any);
      
      if (error) return null;
      return data;
    },
    enabled: !!slug
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navigation />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist.</p>
        <Link to="/">
          <Button size="lg">Go Home</Button>
        </Link>
        <div className="mt-auto w-full">
            <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={page.meta_title || page.title} 
        description={page.meta_description} 
      />
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">{page.title}</h1>
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
