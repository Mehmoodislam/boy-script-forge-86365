import { useState, useEffect } from "react";
import { X, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";
import {
  fetchCategories,
  fetchPrompts,
  type Prompt,
  type Category,
} from "@/services/api";

const ITEMS_PER_LOAD = 21;
const GALLERY_CATEGORY_NAMES = ["cinematic", "futuristic", "shalwar kameez", "luxury", "trending", "wallpaper"];

const Packs = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<Prompt | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        // Filter out gallery categories from the category buttons
        const filtered = data.filter(c => !GALLERY_CATEGORY_NAMES.includes(c.name.toLowerCase()));
        setCategories(filtered);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Load prompts
  useEffect(() => {
    const loadPrompts = async () => {
      setLoading(true);
      try {
        const data = await fetchPrompts(1, ITEMS_PER_LOAD);
        setPrompts(data.data);
        setHasMore(data.current_page < data.last_page);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching prompts:", error);
        toast.error("Failed to load images");
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
      setPrompts((prev) => [...prev, ...data.data]);
      setCurrentPage(nextPage);
      setHasMore(data.current_page < data.last_page);
    } catch (error) {
      console.error("Error loading more:", error);
      toast.error("Failed to load more images");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const filename = `${title.replace(/\s+/g, "-").toLowerCase()}.webp`;
      const proxyUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
      const a = document.createElement("a");
      a.href = proxyUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  // Filter
  const filteredPrompts = prompts.filter((item) => {
    // Exclude gallery categories from packs page
    const isGalleryCategory = GALLERY_CATEGORY_NAMES.includes(item.category.name.toLowerCase());
    if (isGalleryCategory) return false;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      item.category.name.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Related images for popup
  const relatedImages = selectedImage
    ? filteredPrompts.filter(
      (img) =>
        img.id !== selectedImage.id &&
        img.category.name === selectedImage.category.name
    )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Image Packs – Free AI Boy Portrait Collections | FreeImagePrompt"
        description="Browse curated image packs of AI-generated boy portraits. Download free stylish boy photos organized by category."
        canonicalUrl="https://freeimageprompt.com/packs"
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <header className="text-center space-y-4 mb-8">
              <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl">
                Image{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Packs
                </span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Explore all curated image collections. Browse by category, search, and download your favorites.
              </p>
            </header>

            {/* Search Bar */}
            <div className="mb-6 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search images or categories..."
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
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={selectedCategory === cat.name ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                {/* Image Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrompts.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className="cursor-pointer group rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-xl bg-card"
                    >
                      <img
                        src={img.image_url}
                        alt={img.title}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {/* Load More */}
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
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}

                {filteredPrompts.length === 0 && !loading && (
                  <p className="text-center text-muted-foreground py-20">
                    No images found matching your criteria.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="w-full max-h-[60vh] object-contain rounded-t-2xl bg-black"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <Button
                onClick={() => handleDownload(selectedImage.image_url, selectedImage.title)}
                className="absolute top-3 left-3 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 gap-2"
                size="sm"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            {/* Related Images */}
            {relatedImages.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  More from {selectedImage.category.name}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {relatedImages.slice(0, 8).map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className="cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
                    >
                      <img
                        src={img.image_url}
                        alt={img.title}
                        className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Packs;
