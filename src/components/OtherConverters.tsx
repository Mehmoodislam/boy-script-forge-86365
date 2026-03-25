import { Link } from "react-router-dom";
import { RefreshCw, ImageIcon, Layers, ArrowDown, ImageDown, ChevronRight } from "lucide-react";

const OtherConverters = () => {
    const converters = [
        { to: "/tools/webp-to-jpg", label: "WebP to JPG", icon: RefreshCw, desc: "Fast & Secure" },
        { to: "/tools/webp-to-png", label: "WebP to PNG", icon: RefreshCw, desc: "Preserve Quality" },
        { to: "/tools/png-to-webp", label: "PNG to WebP", icon: RefreshCw, desc: "Next-Gen Format" },
        { to: "/tools/png-to-jpg", label: "PNG to JPG", icon: RefreshCw, desc: "Universal Export" },
        { to: "/tools/jpg-to-webp", label: "JPG to WebP", icon: RefreshCw, desc: "Modern Compression" },
        { to: "/tools/jpg-compress", label: "JPG Compressor", icon: ImageIcon, desc: "Batch Optimize" },
        { to: "/tools/reduce-jpg-size", label: "Reduce JPG Size", icon: ArrowDown, desc: "Quick Weight Loss" },
        { to: "/tools/increase-jpg-size", label: "Increase JPG Size", icon: Layers, desc: "KB Enlargement" },
    ];

    return (
        <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-[2.5rem] -m-4 blur-xl pointer-events-none" />

            <div className="relative bg-card/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <RefreshCw className="w-32 h-32 text-primary" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 tracking-tight">
                            More Powerful Image Tools
                        </h2>
                        <p className="text-muted-foreground font-medium">
                            Explore our other professional-grade converters and optimization tools.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all active:scale-95"
                    >
                        View All Tools
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {converters.map((tool) => (
                        <Link
                            key={tool.to}
                            to={tool.to}
                            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-accent/5 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary),0.05)] transition-all group scale-100 hover:scale-[1.02] active:scale-95 text-left"
                        >
                            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                <tool.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{tool.label}</h3>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground opacity-60 tracking-wider mt-0.5">{tool.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OtherConverters;
