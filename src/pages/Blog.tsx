import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    id: "best-ai-image-prompts-stylish-boy-dp",
    title: "Best AI Image Prompts for Stylish Boy DP in 2024",
    description: "Discover the top AI prompts to create stunning stylish boy profile pictures. Learn how to craft the perfect prompt for Midjourney, DALL-E, and other AI generators.",
    date: "December 15, 2024",
    author: "FreeImagePrompt Team",
    category: "AI Prompts",
    image: "/placeholder.svg",
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
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
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

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-2xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
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
                      <span className="flex items-center gap-1 text-primary font-medium">
                        Read More <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
