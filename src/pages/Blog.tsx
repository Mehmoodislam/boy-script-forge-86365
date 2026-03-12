import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts as staticPosts } from "@/data/blog-posts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const POSTS_PER_PAGE = 8;

export default function Blog() {
    const [currentPage, setCurrentPage] = useState(1);
    
    const { data: dynamicPosts } = useQuery({
        queryKey: ['blog-posts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('cms_posts' as any)
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });
            if (error) return [];
            return data.map((post: any) => ({
                id: post.slug, 
                title: post.title,
                description: post.excerpt,
                category: "Blog",
                date: new Date(post.created_at).toLocaleDateString(),
                content: post.content
            }));
        }
    });

    const allPosts = [...staticPosts, ...(dynamicPosts || [])];
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4" variant="secondary">Blog</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                            AI Image Prompts Blog
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Tips, tutorials, and inspiration for creating stunning AI-generated stylish boy portraits
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedPosts.map((post) => (
                            <Link key={post.id} to={`/blog/${post.id}`}>
                                <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription className="text-sm line-clamp-3">
                                            {post.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {post.date}
                                                </span>
                                            </div>
                                            <span className="flex items-center gap-1 text-primary text-sm font-medium">
                                                Read More <ArrowRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "bg-primary" : ""}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
