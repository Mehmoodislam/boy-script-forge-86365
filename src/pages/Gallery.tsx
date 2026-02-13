import { useState, useEffect } from "react";
import { Copy, Check, X, Search, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { 
  fetchCategories, 
  fetchPrompts, 
  likePrompt, 
  copyPrompt,
  type Prompt,
  type Category 
} from "@/services/api";

const ITEMS_PER_LOAD = 21;
const GALLERY_CATEGORY_NAMES = ["cinematic", "futuristic", "shalwar kameez", "luxury", "trending", "wallpaper"];

const Gallery = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  
  // API data states
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPrompts, setTotalPrompts] = useState(0);

  // SEO Setup
  useEffect(() => {
    document.title = "Stylish Boy DP Gallery – Cute Boy Photos & AI Image Prompts | FreeImagePrompt";
    
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

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = "https://freeimageprompt.com/gallery";

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
          "description": "Discover handcrafted AI image prompts for creating stunning stylish boy portraits. Free prompts for Midjourney, DALL-E, Stable Diffusion.",
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
          "description": "Browse free AI image prompts for creating stylish boy portraits",
          "numberOfItems": totalPrompts,
          "about": {
            "@type": "CreativeWork",
            "name": "AI Image Generation Prompts",
            "description": "Collection of prompts for Midjourney, DALL-E, and Stable Diffusion"
          }
        }
      ]
    });
    document.head.appendChild(jsonLdScript);

    return () => {
      document.title = "Stylish Boy DP: Cute Boy Pics & Photo for Your Profile";
      const existingScript = document.getElementById('gallery-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [totalPrompts]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        const filtered = data.filter(c => GALLERY_CATEGORY_NAMES.includes(c.name.toLowerCase()));
        setCategories(filtered);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Fetch prompts on mount and when filters change
  useEffect(() => {
    const loadPrompts = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        const data = await fetchPrompts(1, ITEMS_PER_LOAD);
        setPrompts(data.data);
        setHasMore(data.current_page < data.last_page);
        setTotalPrompts(data.total);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        toast.error("Failed to load prompts");
      } finally {
        setLoading(false);
      }
    };
    loadPrompts();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await fetchPrompts(nextPage, ITEMS_PER_LOAD);
      setPrompts(prev => [...prev, ...data.data]);
      setCurrentPage(nextPage);
      setHasMore(data.current_page < data.last_page);
    } catch (error) {
      console.error('Error loading more prompts:', error);
      toast.error("Failed to load more prompts");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCopy = async (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    
    // Track copy via API
    try {
      await copyPrompt(prompt.id);
      // Update local copy count
      setPrompts(prev => prev.map(p => 
        p.id === prompt.id ? { ...p, copy_count: p.copy_count + 1 } : p
      ));
      if (selectedPrompt?.id === prompt.id) {
        setSelectedPrompt(prev => prev ? { ...prev, copy_count: prev.copy_count + 1 } : null);
      }
    } catch (error) {
      console.error('Error tracking copy:', error);
    }
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePromptClick = (item: Prompt) => {
    setSelectedPrompt(item);
    // View count is handled by API when fetching single prompt
  };

  const handleLike = async (promptId: number) => {
    const isLiked = likedImages.has(promptId);
    
    try {
      await likePrompt(promptId);

      // Update local state
      const newLikedImages = new Set(likedImages);
      if (isLiked) {
        newLikedImages.delete(promptId);
      } else {
        newLikedImages.add(promptId);
      }
      setLikedImages(newLikedImages);

      // Update likes count
      setPrompts(prev => prev.map(p => 
        p.id === promptId 
          ? { ...p, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 } 
          : p
      ));

      if (selectedPrompt?.id === promptId) {
        setSelectedPrompt(prev => prev ? { 
          ...prev, 
          likes_count: isLiked ? prev.likes_count - 1 : prev.likes_count + 1 
        } : null);
      }

      toast.success(isLiked ? "Like removed!" : "Liked!");
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Failed to update like");
    }
  };

  // Filter prompts based on search, category, and gallery-only categories
  const filteredPrompts = prompts.filter((item) => {
    // Only show images from the 6 gallery categories
    const isGalleryCategory = GALLERY_CATEGORY_NAMES.includes(item.category.name.toLowerCase());
    if (!isGalleryCategory) return false;

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === "All" || 
      item.category.name.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

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
                Discover {totalPrompts}+ handcrafted <Link to="/" className="text-primary hover:underline font-medium">AI image prompts</Link> for creating stunning stylish boy portraits. Perfect for <a href="https://www.midjourney.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Midjourney</a>, <a href="https://openai.com/dall-e-3" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">DALL-E</a>, and <a href="https://stability.ai/stable-image" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Stable Diffusion</a>. Browse by category, copy prompts instantly, and start creating amazing AI art today.
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
                  placeholder="Search prompts, titles, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("All")}
                className={selectedCategory === "All" ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={selectedCategory === category.name ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrompts.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer"
                      onClick={() => handlePromptClick(item)}
                    >
                      <div className="relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Stats Display */}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                            <Eye className="h-3 w-3" />
                            {item.views_count}
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                            <Heart className="h-3 w-3" />
                            {item.likes_count}
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm text-white">
                            {item.category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && selectedCategory === "All" && searchQuery === "" && (
                  <div className="flex justify-center mt-10">
                    <Button
                      size="lg"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
                    >
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Loading...
                        </>
                      ) : (
                        `Load More`
                      )}
                    </Button>
                  </div>
                )}

                {/* No results message */}
                {filteredPrompts.length === 0 && !loading && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No prompts found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
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
                src={selectedPrompt.image_url}
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
                      <span className="font-semibold">{selectedPrompt.views_count}</span>
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
                      <span className="ml-2 font-semibold">{selectedPrompt.likes_count}</span>
                    </Button>
                  </div>
                </div>
                
                <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                  {selectedPrompt.category.name}
                </span>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                  AI Prompt:
                </label>
                <div className="relative">
                  <div className="p-4 bg-secondary rounded-lg border border-border font-mono text-sm">
                    {selectedPrompt.prompt_text}
                  </div>
                  <Button
                    onClick={() => handleCopy(selectedPrompt)}
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
