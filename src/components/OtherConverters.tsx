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
        <div className="mt-16 pt-10 border-t border-[#E6E2D8] text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold font-sans text-[#1C1917] tracking-tight">
                        More Image Converters & Tools
                    </h2>
                    <p className="text-xs text-[#78716C] mt-0.5">
                        Explore our full collection of browser-based utilities.
                    </p>
                </div>
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                >
                    View All Tools
                    <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {converters.map((tool) => (
                    <Link
                        key={tool.to}
                        to={tool.to}
                        className="p-4 rounded-xl border border-[#E6E2D8] bg-white hover:border-[#1C1917] transition-all group block text-left shadow-sm"
                    >
                        <span className="text-[9px] font-mono uppercase tracking-widest text-rose-500 block mb-1">
                            {tool.desc}
                        </span>
                        <h3 className="text-xs font-bold text-[#1C1917] group-hover:text-rose-600 transition-colors">
                            {tool.label}
                        </h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default OtherConverters;
