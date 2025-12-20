import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { promptsData } from "@/data/prompts";

const GalleryPreview = () => {
  // Get the latest 6 images (reversed to show newest first)
  const previewImages = [...promptsData].reverse().slice(0, 6);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Latest AI Portraits
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of stunning AI-generated boy portraits with handcrafted prompts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewImages.map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="group block"
              >
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/gallery">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg hover:shadow-xl transition-all group">
                More Images
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
