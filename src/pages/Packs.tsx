import { useState, useEffect } from "react";
import { X, Download, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";
import {
  fetchCategories,
  fetchPromptsByCategory,
  type Prompt,
  type Category,
} from "@/services/api";

const GALLERY_CATEGORIES = ["cinematic", "futuristic", "shalwar kameez", "luxury", "trending", "wallpaper"];

const Packs = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryImages, setCategoryImages] = useState<Prompt[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Prompt | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        // Filter out the 6 gallery categories
        const packCategories = data.filter(
          (c) => !GALLERY_CATEGORIES.includes(c.name.toLowerCase())
        );
        setCategories(packCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load packs");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setLoadingImages(true);
    try {
      const data = await fetchPromptsByCategory(category.id);
      setCategoryImages(data.data);
    } catch (error) {
      console.error("Error fetching category images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoadingImages(false);
    }
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  const relatedImages = selectedImage
    ? categoryImages.filter((img) => img.id !== selectedImage.id)
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
            {/* Header */}
            {!selectedCategory ? (
              <>
                <header className="text-center space-y-4 mb-10">
                  <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl">
                    Image{" "}
                    <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                      Packs
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                    Explore curated image collections organized by category. Click a pack to browse and download images.
                  </p>
                </header>

                {/* Category Grid */}
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-center text-muted-foreground py-20">No packs available yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-xl aspect-square bg-card"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <span className="text-white font-bold text-lg sm:text-xl drop-shadow-lg group-hover:scale-110 transition-transform">
                            {cat.name}
                          </span>
                        </div>
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Category Detail View */}
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedCategory(null);
                      setCategoryImages([]);
                    }}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Packs
                  </Button>
                </div>

                <header className="text-center space-y-2 mb-8">
                  <h2 className="font-bold text-2xl sm:text-3xl">
                    {selectedCategory.name}{" "}
                    <span className="text-primary">Pack</span>
                  </h2>
                </header>

                {loadingImages ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {categoryImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className="cursor-pointer group rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg"
                      >
                        <img
                          src={img.image_url}
                          alt={img.title}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {categoryImages.length === 0 && !loadingImages && (
                  <p className="text-center text-muted-foreground py-20">
                    No images in this pack yet.
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
                  More from {selectedCategory?.name}
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
