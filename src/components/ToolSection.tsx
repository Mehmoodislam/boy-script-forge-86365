import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Zap, Shield, Sparkles, ImageDown, Image as ImageIcon, Layers, ArrowDown, RefreshCw } from "lucide-react";

export const mediaTools = [
  { to: "/tools/jpg-compress", label: "JPG Compressor", icon: ImageIcon, desc: "Batch image optimization" },
  { to: "/tools/increase-jpg-size", label: "Increase JPG Size", icon: Layers, desc: "Specific KB enlargement" },
  { to: "/tools/reduce-jpg-size", label: "Reduce JPG Size", icon: ArrowDown, desc: "Fast weight reduction" },
  { to: "/tools/compress-jpg-to-5kb", label: "JPG to 5KB", icon: ImageDown, desc: "Ultra small optimization" },
  { to: "/tools/compress-jpg-to-50kb", label: "JPG to 50KB", icon: ImageDown, desc: "Perfect for forms" },
];

export const converters = [
  { to: "/tools/webp-to-jpg", label: "WebP to JPG", icon: RefreshCw, desc: "Convert WebP images to JPEG" },
  { to: "/tools/webp-to-png", label: "WebP to PNG", icon: RefreshCw, desc: "Convert WebP images to PNG" },
  { to: "/tools/png-to-web-p", label: "PNG to WebP", icon: RefreshCw, desc: "Convert PNG images to WebP" },
  { to: "/tools/png-to-jpg", label: "PNG to JPG", icon: RefreshCw, desc: "Convert PNG images to JPEG" },
  { to: "/tools/jpg-to-webp", label: "JPG to WebP", icon: RefreshCw, desc: "Convert JPEG to WebP format" },
];

const ToolSection = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-glow/5 blur-[150px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Content Side */}
                        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">New Performance Tool</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Optimize Your Images <br />
                                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                                    In Seconds, Not Minutes
                                </span>
                            </h2>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Take full control over your image file sizes with our powerful **JPG Compressor**.
                                Whether you need to reduce a photo for a website or increase its size for a portal
                                requirement, our browser-based tools handle everything locally and securely.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 transition-all hover:bg-secondary/80">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">Ultra Fast</h4>
                                        <p className="text-xs text-muted-foreground">Compression happens instantly in your browser.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 transition-all hover:bg-secondary/80">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">100% Private</h4>
                                        <p className="text-xs text-muted-foreground">Your files never leave your device.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link to="/tools/jpg-compress">
                                    <Button size="lg" className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-transform shadow-xl shadow-primary/20 group">
                                        Start Compressing
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="flex-1 relative group animate-in fade-in slide-in-from-right-8 duration-1000">
                            {/* Decorative glow behind image */}
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <Link to="/tools/jpg-compress" className="block relative">
                                <div className="relative rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl transition-all duration-500 group-hover:translate-y--2 group-hover:rotate-1">
                                    <img
                                        src="/assets/jpg_compressor_mockup.png"
                                        alt="JPG Compressor Tool Mockup"
                                        className="w-full h-auto object-cover"
                                    />

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-background/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-primary/30 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                            <span className="font-black text-primary flex items-center gap-2">
                                                OPEN TOOL <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    FREE ALWAYS
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* NEW TOOLS GRID */}
                <div className="max-w-6xl mx-auto mt-32 relative z-10" id="tools">
                   <div className="text-center mb-12">
                       <h3 className="text-3xl font-black mb-4">All Our Free Tools</h3>
                       <p className="text-muted-foreground max-w-2xl mx-auto">Explore our collection of 100% free online tools designed to make your daily tasks easier and faster.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...mediaTools, ...converters].map((tool, idx) => (
                          <Link key={idx} to={tool.to} className="group p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/80 transition-all hover:-translate-y-1 hover:shadow-xl">
                              <div className="flex items-center gap-4 mb-4">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                      <tool.icon className="h-6 w-6" />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-lg">{tool.label}</h4>
                                  </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{tool.desc}</p>
                          </Link>
                      ))}
                   </div>
                </div>
            </div>
        </section>
    );
};

export default ToolSection;
