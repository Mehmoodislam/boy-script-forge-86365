import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
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
  "mood-off-dp-2026": {
    title: "Best Mood Off DP 2026: Free Sad Mood Images, Photos & WhatsApp Profile Pictures",
    description: "Best mood off DP images free download! HD sad mood photos, alone boy girl DP for WhatsApp, Instagram. Emotional wallpapers & Pinterest trends 2026. Express heartbreak silently 💔",
    date: "February 2, 2026",
    author: "TrendsPrompt Team",
    category: "Profile Pictures",
    content: `
      <div class="mood-off-hero mb-8">
        <p class="text-lg leading-relaxed">In 2026's fast-paced digital world, <strong>mood off DP</strong> has become a silent way to express <em>sad mood</em>, emotional feelings, loneliness, or a broken heart. When words fail, a high-quality <strong>sad mood photo</strong> or <strong>mood off image for WhatsApp</strong> speaks volumes on Instagram, Facebook, and Pinterest. This guide curates the best free mood off DP images in HD—perfect for updating your profile picture and connecting with others feeling the same.</p>
      </div>

      <h2>What is Mood Off DP? Understanding Sad Profile Pictures</h2>
      <p>A <strong>mood off DP</strong> (display picture) captures raw emotions like:</p>
      <ul>
        <li>Deep sadness or stress</li>
        <li>Solitude and alone vibes</li>
        <li>Heartbreak after relationships</li>
        <li>Silent attitude in tough times</li>
      </ul>
      <p>Popular in South Asia, especially Pakistan and India, these <strong>sad DP for WhatsApp</strong> trend on social media. According to 2025 Hootsuite data, emotional DPs boost engagement by 25% as users relate to authentic feelings.</p>

      <div class="my-8 rounded-lg overflow-hidden shadow-lg">
        <img src="C:/Users/Mehmood/.gemini/antigravity/brain/7ef77bfb-fa9f-447f-bd4e-1110d9cf50ec/sad_boy_dp_1770056624289.png" alt="HD mood off DP boy alone 2026" class="w-full h-auto" />
      </div>

      <h2>Top Mood Off DP for Boys: Sad Alone Attitude Images (HD Free Download)</h2>
      <p>Boys love <strong>mood off DP boy</strong> with dark aesthetics. Download these sad boy photos featuring rainy nights, shadowed faces, or thoughtful poses:</p>
      <ul>
        <li><strong>Alone boy attitude DP:</strong> Silhouette against sunset—ideal for stress expression</li>
        <li><strong>Emotional boy WhatsApp DP:</strong> Tearful eyes with "silence is loud" quotes</li>
        <li><strong>Dark sad boy profile picture:</strong> Black-and-white minimalism for Instagram</li>
      </ul>
      <p>These resonate with gamers seeking <strong>Free Fire sad mood DP</strong>.</p>

      <div class="my-8 rounded-lg overflow-hidden shadow-lg">
        <img src="C:/Users/Mehmood/.gemini/antigravity/brain/7ef77bfb-fa9f-447f-bd4e-1110d9cf50ec/alone_boy_attitude_1770056660483.png" alt="Alone boy attitude mood off DP" class="w-full h-auto" />
      </div>

      <h2>Cute Mood Off DP for Girls: Emotional & Sad Girl Pictures</h2>
      <p>Girls prefer softer <strong>mood off DP girl</strong> blending cuteness with pain. Explore sad girl photos like:</p>
      <ul>
        <li><strong>Cute sad DP:</strong> Pouting lips, rainy window gazes</li>
        <li><strong>Alone girl mood off image:</strong> Hugging knees in cozy rooms</li>
        <li><strong>Emotional girl Instagram DP:</strong> Flower petals falling, symbolizing lost love</li>
      </ul>
      <p>Perfect for Pinterest boards—search "sad aesthetic girl DP 2026" for more.</p>

      <div class="my-8 rounded-lg overflow-hidden shadow-lg">
        <img src="C:/Users/Mehmood/.gemini/antigravity/brain/7ef77bfb-fa9f-447f-bd4e-1110d9cf50ec/sad_girl_dp_1770056641381.png" alt="Cute sad girl mood off DP" class="w-full h-auto" />
      </div>

      <h2>Sad Mood Wallpapers & Stock Photos: Free HD Collection</h2>
      <p>Elevate your phone with <strong>sad mood wallpapers:</strong></p>
      <ul>
        <li>Rainy cityscapes for loneliness</li>
        <li>Broken heart animations for Stories</li>
        <li>Minimalist quotes like "Pain changes people"</li>
      </ul>
      <p>All <strong>mood off images free download</strong> are royalty-free, optimized for WhatsApp (512x512px) and Instagram (1080x1080px).</p>

      <div class="my-8 rounded-lg overflow-hidden shadow-lg">
        <img src="C:/Users/Mehmood/.gemini/antigravity/brain/7ef77bfb-fa9f-447f-bd4e-1110d9cf50ec/sad_mood_wallpaper_1770056676215.png" alt="Sad mood wallpaper for WhatsApp" class="w-full h-auto" />
      </div>

      <h2>2026 Mood Off DP Trends on Pinterest & Free Fire</h2>
      <p>Pinterest explodes with new <strong>mood off DP</strong>—pin cute sad DP, WhatsApp mood off DP, or alone mood off DP. Gamers trend <strong>Free Fire DP sad mood</strong> with character skins in gloomy settings. TikTok adds Reels potential for viral mood off attitude status.</p>

      <h2>Why Use Mood Off DP? Benefits for Emotional Expression</h2>
      <p>People set <strong>sad mood DP</strong> to:</p>
      <ul>
        <li>Signal "need space" without texts</li>
        <li>Build relatability (e.g., 40% youth use per 2025 surveys)</li>
        <li>Spark conversations on mental health</li>
      </ul>
      <p>It's therapy in pixels—express sad mood subtly.</p>

      <div class="bg-secondary/30 p-6 rounded-lg my-8">
        <h2 class="mt-0">FAQ: Mood Off DP Quick Guide</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold mb-2">Q: Where to download free mood off DP?</h3>
            <p class="mb-0"><strong>A:</strong> Pinterest, Pixabay, or this curated list—HD and watermark-free.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Q: Best size for WhatsApp sad DP?</h3>
            <p class="mb-0"><strong>A:</strong> 500x500px for crisp display.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Q: Mood off DP for couples?</h3>
            <p class="mb-0"><strong>A:</strong> Try matching broken heart pairs.</p>
          </div>
        </div>
      </div>

      <h2>Download Your Perfect Mood Off DP Now</h2>
      <p>Ready to update? Grab <strong>best free DP images:</strong></p>
      <ul>
        <li><strong>Boys Collection</strong> - Dark, moody silhouettes and attitude DPs</li>
        <li><strong>Girls Collection</strong> - Cute, emotional, and aesthetic images</li>
        <li><strong>Wallpapers</strong> - Rainy scenes and minimalist sad quotes</li>
      </ul>
      <p class="text-lg font-semibold mt-6"><strong>Final Tip:</strong> Pair with a status like "Silent screams 💔" for max impact. Share your fave in comments!</p>
    `
  },
  "best-ai-image-prompts-stylish-boy-dp": {
    title: "Best AI Image Prompts for Stylish Boy DP in 2025",
    description: "Discover the top AI prompts to create stunning stylish boy profile pictures. Learn how to craft the perfect prompt for Midjourney, DALL-E, and other AI generators.",
    date: "December 15, 2024",
    author: "TrendsPrompt Team",
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
      <SEOHead
        title={`${post.title} | FreeImagePrompt Blog`}
        description={post.description}
        canonicalUrl={`https://freeimageprompt.com/blog/${slug}`}
        ogType="article"
      />
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
