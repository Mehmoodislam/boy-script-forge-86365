import { useState, useEffect, useMemo } from "react";
import { Copy, Check, X, Search, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { promptsData, PromptData } from "@/data/prompts";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define categories based on tags
const categories = [
  "All",
  "Luxury",
  "Cinematic",
  "Gangster",
  "Traditional",
  "Nature",
  "Futuristic",
  "Shalwar Kameez",
  "Moody",
  "Trending"
];

interface ImageStats {
  views: number;
  likes: number;
}

const Gallery = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [imageStats, setImageStats] = useState<Record<string, ImageStats>>({});
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  // SEO Setup
  useEffect(() => {
    // Update page title with keywords
    document.title = "Stylish Boy DP Gallery – Cute Boy Photos & AI Image Prompts | FreeImagePrompt";
    
    // Update or create meta description
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaTag('description', 'Browse stylish boy DP gallery with cute boy photos and free AI image prompts. Explore cinematic, luxury, trendy boy portraits for WhatsApp & social profiles.');
    updateMetaTag('keywords', 'AI image prompts, free AI prompts, boy portrait prompts, Whatsapp stylish boy, stylish boy DP, Stable Diffusion prompts, stylish boy portraits, AI art generator prompts, luxury portrait prompts, cinematic portrait prompts, street style AI prompts');
    
    // Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOGTag('og:title', 'Stylish Boy DP Gallery – Cute Boy Photos & AI Image Prompts | FreeImagePrompt');
    updateOGTag('og:description', 'Browse stylish boy DP gallery with cute boy photos and free AI image prompts. Explore cinematic, luxury, trendy boy portraits for WhatsApp & social profiles.');
    updateOGTag('og:type', 'website');
    updateOGTag('og:url', window.location.href);

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = "https://freeimageprompt.com/gallery";


    // Add JSON-LD structured data
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = 'gallery-jsonld';
    jsonLdScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": window.location.href,
          "url": window.location.href,
          "name": "Free AI Image Prompts for Stylish Boy Portraits | FreeImagePrompt",
          "description": "Discover 148+ handcrafted AI image prompts for creating stunning stylish boy portraits. Free prompts for Midjourney, DALL-E, Stable Diffusion.",
          "inLanguage": "en-US",
          "isPartOf": {
            "@type": "WebSite",
            "@id": window.location.origin,
            "name": "FreeImagePrompt",
            "url": window.location.origin
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": window.location.origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Gallery",
              "item": window.location.href
            }
          ]
        },
        {
          "@type": "CollectionPage",
          "name": "AI Image Prompts Gallery",
          "description": "Browse 148+ free AI image prompts for creating stylish boy portraits",
          "numberOfItems": promptsData.length,
          "about": {
            "@type": "CreativeWork",
            "name": "AI Image Generation Prompts",
            "description": "Collection of prompts for Midjourney, DALL-E, and Stable Diffusion"
          }
        }
      ]
    });
    document.head.appendChild(jsonLdScript);

    // Cleanup function
    return () => {
      document.title = "Stylish Boy DP: Cute Boy Pics & Photo for Your Profile";
      const existingScript = document.getElementById('gallery-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Fetch all image stats on mount
  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const { data, error } = await supabase
        .from('image_stats')
        .select('image_id, views, likes');
      
      if (error) throw error;
      
      const statsMap: Record<string, ImageStats> = {};
      data?.forEach((stat) => {
        statsMap[stat.image_id] = {
          views: stat.views || 0,
          likes: stat.likes || 0
        };
      });
      setImageStats(statsMap);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePromptClick = async (item: PromptData) => {
    setSelectedPrompt(item);
    
    // Increment views
    try {
      await supabase.rpc('increment_image_views', { p_image_id: item.id });
      
      // Update local state
      setImageStats(prev => ({
        ...prev,
        [item.id]: {
          views: (prev[item.id]?.views || 0) + 1,
          likes: prev[item.id]?.likes || 0
        }
      }));
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleLike = async (imageId: string) => {
    const isLiked = likedImages.has(imageId);
    
    try {
      const { data, error } = await supabase.rpc('toggle_image_like', {
        p_image_id: imageId,
        p_increment: !isLiked
      });

      if (error) throw error;

      // Update local state
      const newLikedImages = new Set(likedImages);
      if (isLiked) {
        newLikedImages.delete(imageId);
      } else {
        newLikedImages.add(imageId);
      }
      setLikedImages(newLikedImages);

      setImageStats(prev => ({
        ...prev,
        [imageId]: {
          views: prev[imageId]?.views || 0,
          likes: data
        }
      }));

      toast.success(isLiked ? "Like removed!" : "Liked!");
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Failed to update like");
    }
  };

  // Filter prompts based on search and category
  const filteredPrompts = useMemo(() => {
    return promptsData.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === "All" || 
        item.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <header className="text-center space-y-4 mb-8">
              <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-5xl break-words text-center">
                Free AI Image Prompts for <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Stylish Boy Portraits</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed break-words text-center max-w-2xl mx-auto mb-3">
                Discover 148+ handcrafted <Link to="/" className="text-primary hover:underline font-medium">AI image prompts</Link> for creating stunning stylish boy portraits. Perfect for <a href="https://www.midjourney.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Midjourney</a>, <a href="https://openai.com/dall-e-3" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">DALL-E</a>, and <a href="https://stability.ai/stable-image" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Stable Diffusion</a>. Browse by category, copy prompts instantly, and start creating amazing AI art today.
              </p>
              <nav className="text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
                {" • "}
                <a href="/#about" className="hover:text-primary transition-colors font-medium">About</a>
                {" • "}
                <a href="/#how-to-use" className="hover:text-primary transition-colors font-medium">How to Use</a>
                {" • "}
                <a href="/#faqs" className="hover:text-primary transition-colors font-medium">FAQs</a>
              </nav>
            </header>

            {/* Search Bar */}
            <div className="mb-6 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search prompts, titles, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => handlePromptClick(item)}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Stats Display */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                        <Eye className="h-3 w-3" />
                        {imageStats[item.id]?.views || 0}
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                        <Heart className="h-3 w-3" />
                        {imageStats[item.id]?.likes || 0}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedPrompt.image}
                alt={selectedPrompt.title}
                className="w-full aspect-video object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedPrompt(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{selectedPrompt.title}</h2>
                  
                  {/* Stats and Like Button */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-5 w-5" />
                      <span className="font-semibold">{imageStats[selectedPrompt.id]?.views || 0}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(selectedPrompt.id)}
                      className={likedImages.has(selectedPrompt.id) ? "text-red-500" : "text-muted-foreground"}
                    >
                      <Heart 
                        className={`h-5 w-5 ${likedImages.has(selectedPrompt.id) ? "fill-red-500" : ""}`}
                      />
                      <span className="ml-2 font-semibold">{imageStats[selectedPrompt.id]?.likes || 0}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedPrompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                  AI Prompt:
                </label>
                <div className="relative">
                  <div className="p-4 bg-secondary rounded-lg border border-border font-mono text-sm">
                    {selectedPrompt.prompt}
                  </div>
                  <Button
                    onClick={() => handleCopy(selectedPrompt.prompt)}
                    className="absolute top-2 right-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <span className="font-semibold">Tip:</span> Copy this prompt and paste it into any AI image generator 
                  (Midjourney, DALL-E, Gemini Stable Diffusion) to create similar stunning images.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
