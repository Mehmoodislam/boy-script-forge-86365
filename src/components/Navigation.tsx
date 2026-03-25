import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ImageDown, FileText, QrCode, Type, Image as ImageIcon, Layers, ArrowDown, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import logo from "@/assets/nav-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const mediaTools = [
  { to: "/tools/jpg-compress", label: "JPG Compressor", icon: ImageIcon, desc: "Batch image optimization" },
  { to: "/tools/increase-jpg-size", label: "Increase JPG Size", icon: Layers, desc: "Specific KB enlargement" },
  { to: "/tools/reduce-jpg-size", label: "Reduce JPG Size", icon: ArrowDown, desc: "Fast weight reduction" },
  { to: "/tools/compress-jpg-to-5kb", label: "JPG to 5KB", icon: ImageDown, desc: "Ultra small optimization" },
  { to: "/tools/compress-jpg-to-50kb", label: "JPG to 50KB", icon: ImageDown, desc: "Perfect for forms" },
];

const converters = [
  { to: "/tools/webp-to-jpg", label: "WebP to JPG", icon: RefreshCw, desc: "Convert WebP images to JPEG" },
  { to: "/tools/webp-to-png", label: "WebP to PNG", icon: RefreshCw, desc: "Convert WebP images to PNG" },
  { to: "/tools/png-to-webp", label: "PNG to WebP", icon: RefreshCw, desc: "Convert PNG images to WebP" },
  { to: "/tools/png-to-jpg", label: "PNG to JPG", icon: RefreshCw, desc: "Convert PNG images to JPEG" },
  { to: "/tools/jpg-to-webp", label: "JPG to WebP", icon: RefreshCw, desc: "Convert JPEG to WebP format" },
];

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const links = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Image Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const { data: dynamicLinks } = useQuery({
    queryKey: ['navigation-menu'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('cms_navigation' as any)
        .select('label, path') as any)
        .order('order_index', { ascending: true });
      if (error) return [];
      return (data as any[]).map(item => ({ to: item.path, label: item.label }));
    }
  });

  const allLinks = [...links, ...(dynamicLinks || [])];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToolsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setToolsOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="FreeImagePrompt Logo" className="h-10 w-10 rounded-lg group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FreeImagePrompt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {allLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.to
                  ? "text-primary"
                  : "text-foreground/70"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div
              ref={toolsRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith("/tools") ? "text-primary" : "text-foreground/70"
                  }`}
              >
                Tools
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full right-0 mt-2 w-[600px] rounded-xl border border-border bg-popover shadow-lg p-4 z-[100] animate-in fade-in-0 zoom-in-95 duration-200 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Image Tools</h3>
                    <div className="space-y-1">
                      {mediaTools.map((tool) => (
                        <Link
                          key={tool.to}
                          to={tool.to}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <tool.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{tool.label}</p>
                            <p className="text-xs text-muted-foreground">{tool.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Image Converters</h3>
                    <div className="space-y-1">
                      {converters.map((tool) => (
                        <Link
                          key={tool.to}
                          to={tool.to}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <tool.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{tool.label}</p>
                            <p className="text-xs text-muted-foreground">{tool.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-1">
            {allLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-lg ${location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-foreground/70"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Tools Accordion */}
            <button
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
              className={`flex items-center justify-between w-full text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-lg ${location.pathname.startsWith("/tools") ? "text-primary bg-primary/10" : "text-foreground/70"
                }`}
            >
              Tools
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileToolsOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileToolsOpen && (
              <div className="pl-4 space-y-4 mt-2">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Image Tools</h3>
                  <div className="space-y-1">
                    {mediaTools.map((tool) => (
                      <Link
                        key={tool.to}
                        to={tool.to}
                        onClick={() => { setIsOpen(false); setMobileToolsOpen(false); }}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/70 hover:text-primary"
                      >
                        <tool.icon className="h-4 w-4" />
                        <span className="text-sm">{tool.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Image Converters</h3>
                  <div className="space-y-1">
                    {converters.map((tool) => (
                      <Link
                        key={tool.to}
                        to={tool.to}
                        onClick={() => { setIsOpen(false); setMobileToolsOpen(false); }}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/70 hover:text-primary"
                      >
                        <tool.icon className="h-4 w-4" />
                        <span className="text-sm">{tool.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
