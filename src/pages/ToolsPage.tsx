import { Link } from "react-router-dom";
import {
  ImageDown, Layers, ArrowDown, RefreshCw, Sparkles, Image as ImageIcon,
  FileImage, ArrowRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AdBannerDouble from "@/components/ads/AdBannerDouble";

const imageCompressors = [
  { to: "/tools/jpg-compress", label: "JPG Compressor", desc: "Batch compress multiple JPG/JPEG images at once" },
  { to: "/tools/compress-jpg-to-5kb", label: "Compress JPG to 5KB", desc: "Ultra-small 5KB compression for strict portals" },
  { to: "/tools/compress-jpg-to-10kb", label: "Compress JPG to 10KB", desc: "10KB target for standard forms" },
  { to: "/tools/compress-jpg-to-15kb", label: "Compress JPG to 15KB", desc: "15KB compression for official documents" },
  { to: "/tools/compress-jpg-to-20kb", label: "Compress JPG to 20KB", desc: "20KB target for exam portals" },
  { to: "/tools/compress-jpg-to-25kb", label: "Compress JPG to 25KB", desc: "25KB compression for uploads" },
  { to: "/tools/compress-jpg-to-30kb", label: "Compress JPG to 30KB", desc: "30KB optimization for applications" },
  { to: "/tools/compress-jpg-to-35kb", label: "Compress JPG to 35KB", desc: "35KB compression for KYC" },
  { to: "/tools/compress-jpg-to-40kb", label: "Compress JPG to 40KB", desc: "40KB target for submissions" },
  { to: "/tools/compress-jpg-to-45kb", label: "Compress JPG to 45KB", desc: "45KB precision compression" },
  { to: "/tools/compress-jpg-to-50kb", label: "Compress JPG to 50KB", desc: "50KB — most common portal limit" },
  { to: "/tools/compress-jpg-to-60kb", label: "Compress JPG to 60KB", desc: "60KB compression for forms" },
  { to: "/tools/compress-jpg-to-70kb", label: "Compress JPG to 70KB", desc: "70KB target for uploads" },
  { to: "/tools/compress-jpg-to-80kb", label: "Compress JPG to 80KB", desc: "80KB compression" },
  { to: "/tools/compress-jpg-to-90kb", label: "Compress JPG to 90KB", desc: "90KB target" },
  { to: "/tools/compress-jpg-to-100kb", label: "Compress JPG to 100KB", desc: "100KB compression" },
  { to: "/tools/compress-jpg-to-150kb", label: "Compress JPG to 150KB", desc: "150KB target" },
  { to: "/tools/compress-jpg-to-200kb", label: "Compress JPG to 200KB", desc: "200KB optimization" },
  { to: "/tools/compress-jpg-to-250kb", label: "Compress JPG to 250KB", desc: "250KB compression" },
  { to: "/tools/compress-jpg-to-300kb", label: "Compress JPG to 300KB", desc: "300KB target" },
  { to: "/tools/compress-jpg-to-400kb", label: "Compress JPG to 400KB", desc: "400KB compression" },
  { to: "/tools/compress-jpg-to-500kb", label: "Compress JPG to 500KB", desc: "500KB target" },
  { to: "/tools/compress-jpg-to-1mb", label: "Compress JPG to 1MB", desc: "1MB compression" },
  { to: "/tools/compress-jpg-to-2mb", label: "Compress JPG to 2MB", desc: "2MB target" },
  { to: "/tools/compress-jpg-to-5mb", label: "Compress JPG to 5MB", desc: "5MB compression" },
];

const sizeTools = [
  { to: "/tools/increase-jpg-size", label: "Increase JPG Size", desc: "Enlarge JPG/PNG to specific KB requirement" },
  { to: "/tools/reduce-jpg-size", label: "Reduce JPG Size", desc: "Quickly reduce JPG to a smaller size" },
];

const converters = [
  { to: "/tools/webp-to-jpg", label: "WebP to JPG", desc: "Convert WebP images to standard JPEG format" },
  { to: "/tools/webp-to-png", label: "WebP to PNG", desc: "Convert WebP images to PNG format" },
  { to: "/tools/png-to-webp", label: "PNG to WebP", desc: "Convert PNG images to WebP format" },
  { to: "/tools/png-to-jpg", label: "PNG to JPG", desc: "Convert PNG images to JPEG format" },
  { to: "/tools/jpg-to-webp", label: "JPG to WebP", desc: "Convert JPEG images to WebP format" },
  { to: "/tools/heic-to-jpg", label: "HEIC to JPG", desc: "Convert iPhone HEIC photos to JPG" },
  { to: "/tools/image-dpi-checker", label: "Image DPI Checker", desc: "Check any image's DPI & print readiness online" },
];

const creativeTools = [
  { to: "/tools/art-prompt-generator", label: "Art Prompt Generator", desc: "Generate unlimited creative art prompts & ideas" },
];

const categories = [
  { id: "compressors", title: "Image Compressors", icon: ImageDown, tools: imageCompressors, color: "rose" },
  { id: "size", title: "Image Size Adjusters", icon: Layers, tools: sizeTools, color: "amber" },
  { id: "converters", title: "Image Format Converters", icon: RefreshCw, tools: converters, color: "blue" },
  { id: "creative", title: "Creative Tools", icon: Sparkles, tools: creativeTools, color: "violet" },
];

const colorMap: Record<string, { badge: string; border: string; hover: string; icon: string; bg: string }> = {
  rose: { badge: "bg-rose-50 text-rose-700 border-rose-200", border: "border-[#E6E2D8]", hover: "hover:border-rose-300", icon: "text-rose-500", bg: "bg-rose-50" },
  amber: { badge: "bg-amber-50 text-amber-700 border-amber-200", border: "border-[#E6E2D8]", hover: "hover:border-amber-300", icon: "text-amber-600", bg: "bg-amber-50" },
  blue: { badge: "bg-blue-50 text-blue-700 border-blue-200", border: "border-[#E6E2D8]", hover: "hover:border-blue-300", icon: "text-blue-500", bg: "bg-blue-50" },
  violet: { badge: "bg-violet-50 text-violet-700 border-violet-200", border: "border-[#E6E2D8]", hover: "hover:border-violet-300", icon: "text-violet-500", bg: "bg-violet-50" },
};

const ToolsPage = () => {
  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
      <SEOHead
        title="All Free Online Tools — Image Compressors, Converters & More | FreeImagePrompt"
        description="Free online image tools: compress JPG to any size, convert between WebP/PNG/JPG/HEIC, increase or reduce image size. 100% free, no upload required."
      />
      <Navigation />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-left mb-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] w-6 bg-rose-500"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-rose-600">
                ALL FREE TOOLS
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-[#1C1917] leading-tight">
              Our Free Online Tools
            </h1>
            <p className="text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed">
              30+ free browser-based tools to compress, convert, and optimize your images. Nothing leaves your device — 100% private and secure.
            </p>
          </div>

          <AdBannerDouble className="mb-12" />

          <div className="space-y-16">
            {categories.map((cat) => {
              const c = colorMap[cat.color];
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-xl ${c.bg}`}>
                      <cat.icon className={`h-5 w-5 ${c.icon}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1C1917]">{cat.title}</h2>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#EFECE6] text-[#6B645C]">
                      {cat.tools.length} tools
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {cat.tools.map((tool) => (
                      <Link
                        key={tool.to}
                        to={tool.to}
                        className={`group flex items-start gap-3 p-4 bg-white border ${c.border} ${c.hover} rounded-xl transition-all hover:shadow-md`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <ArrowRight className={`h-4 w-4 ${c.icon} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1C1917] group-hover:text-rose-600 transition-colors">
                            {tool.label}
                          </p>
                          <p className="text-xs text-[#78716C] mt-0.5 leading-relaxed">{tool.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolsPage;
