import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const blogPosts: Record<string, {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  content: string;
}> = {
  "best-ai-image-prompts-stylish-boy-dp": {
    title: "Best AI Image Prompts for Stylish Boy DP in 2025",
    description: "Discover the top AI prompts to create stunning stylish boy profile pictures. Learn how to craft the perfect prompt for Midjourney, DALL-E, and other AI generators.",
    date: "December 15, 2024",
    author: "FreeImagePrompt Team",
    category: "AI Prompts",
    content: `
      <h2>Introduction to AI-Generated Stylish Boy DPs</h2>
      <p>In today's digital world, having a unique and stylish profile picture (DP) sets you apart from the crowd. AI image generators like Midjourney, DALL-E, and Stable Diffusion have revolutionized how we create stunning portraits. In this guide, we'll explore the best prompts for creating stylish boy DPs.</p>
      
      <h2>Why Use AI for Profile Pictures?</h2>
      <p>AI-generated images offer several advantages:</p>
      <ul>
        <li><strong>Uniqueness:</strong> Every image is one-of-a-kind</li>
        <li><strong>Customization:</strong> You control the style, mood, and aesthetic</li>
        <li><strong>Quality:</strong> High-resolution, professional-looking results</li>
        <li><strong>Privacy:</strong> No need to use your real photo</li>
      </ul>
      
      <h2>Top Prompt Styles for Stylish Boy DPs</h2>
      
      <h3>1. Luxury Style</h3>
      <p>Create sophisticated, high-end looking portraits with prompts focusing on luxury fashion, elegant settings, and refined aesthetics. Include elements like designer clothing, gold accessories, and premium backgrounds.</p>
      
      <h3>2. Cinematic Look</h3>
      <p>Achieve movie-poster quality images with dramatic lighting, depth of field, and professional color grading. Use terms like "cinematic lighting," "bokeh," and "film grain" in your prompts.</p>
      
      <h3>3. Street Style</h3>
      <p>Urban, trendy looks with casual fashion, graffiti backgrounds, and street photography aesthetics. Perfect for a modern, cool vibe.</p>
      
      <h3>4. Anime/Artistic Style</h3>
      <p>For those who prefer illustrated looks, anime-style prompts can create beautiful, artistic profile pictures with vibrant colors and unique character designs.</p>
      
      <h2>Tips for Better AI Prompts</h2>
      <ol>
        <li><strong>Be Specific:</strong> Include details about clothing, background, lighting, and mood</li>
        <li><strong>Use Quality Terms:</strong> Add "8K," "ultra detailed," "masterpiece" for higher quality</li>
        <li><strong>Specify Aspect Ratio:</strong> Use "portrait orientation" or specific ratios like 3:4</li>
        <li><strong>Include Style References:</strong> Mention specific art styles or photographers</li>
      </ol>
      
      <h2>Where to Find More Prompts</h2>
      <p>Visit our <a href="/gallery">Gallery page</a> to browse 170+ ready-to-use prompts. Simply click to copy and paste into your favorite AI image generator!</p>
      
      <h2>Conclusion</h2>
      <p>Creating the perfect stylish boy DP is now easier than ever with AI. Experiment with different prompts, styles, and generators to find your perfect look. Remember, the key is to be creative and specific with your prompts!</p>
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-12 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Article Header */}
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

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div 
            className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Stylish DP?</h2>
          <p className="text-muted-foreground mb-6">Browse our collection of 170+ free AI prompts</p>
          <Link to="/gallery">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow">
              Explore Gallery
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
