import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/data/blog-posts";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import AdBannerDouble from "@/components/ads/AdBannerDouble";

export default function BlogPost() {
    const { slug } = useParams();
    const staticPost = blogPosts.find(p => p.id === slug);

    const { data: dynamicPost, isLoading } = useQuery({
        queryKey: ['blog-post', slug],
        queryFn: async () => {
            if (staticPost) return null;
            const { data, error } = await (supabase
                .from('cms_posts' as any)
                .select('*')
                .eq('slug', slug)
                .single() as any);
            if (error) return null;
            const postData = data as any;
            return {
                title: postData.title,
                description: postData.excerpt,
                category: "Blog",
                date: new Date(postData.created_at).toLocaleDateString(),
                author: "Admin",
                content: postData.content,
                metaTitle: postData.meta_title as string | undefined,
                metaDescription: postData.meta_description as string | undefined,
                schema: postData.schema as object | undefined
            };
        },
        enabled: !!slug && !staticPost
    });

    const post = staticPost || dynamicPost;

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
                <Link to="/blog">
                    <Button>Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                title={`${post.metaTitle || post.title} | FreeImagePrompt`}
                description={post.metaDescription || post.description}
                canonicalUrl={`https://freeimageprompt.com/blog/${slug}`}
                schema={post.schema as object}
            />
            <Navigation />

            <section className="pt-24 pb-8 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>
                        <Badge className="mb-4" variant="secondary">{post.category}</Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {post.title}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            {post.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <article className="py-12">
                <div className="container mx-auto px-4">
                    <div
                        className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            <div className="container mx-auto px-4 max-w-3xl pb-8">
                <AdBannerDouble />
            </div>

            <Footer />
        </div>
    );
}
