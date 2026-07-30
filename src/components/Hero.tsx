import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/10 to-background" />

      {/* Animated Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10 mt-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">100% Free · Runs In Your Browser</span>
          </div>
          <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-7xl break-words text-center">
            Free Online <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent"> Image Tools </span>

            <br className="hidden sm:block" />
            <span className="text-foreground">
              For  Compressing, <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent"> Converting & Resizing</span>
            </span>
          </h1>

          <p className=" text-base sm:text-lg md:text-xl text-muted-foreground max-w-5xl mx-auto leading-relaxed break-words text-center">
           Compress JPGs to an exact KB size, convert between PNG, WebP, JPG and HEIC, and resize images - all instantly, all free, all without uploading a single file to a server.
          </p>

          <p className=" text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words text-center">
            No limitations, no watermarks, completely free to use directly inside your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#tools">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg hover:shadow-xl transition-all group">
                Explore All Tools
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary">
              Learn How It Works
            </Button>
          </div>

          <div className=" pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto text-center ">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                10+
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Free Tools
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Free to Use
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Fast & Secure
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Local Processing
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
