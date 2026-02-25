import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Youtube, ImageDown, FileText, QrCode, Type, Calculator, Brain, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import logo from "@/assets/nav-logo.png";

const mediaTools = [
  { to: "/tools/youtube-downloader", label: "YouTube Downloader", icon: Youtube, desc: "Download videos easily" },
  { to: "/tools/jpg-compress", label: "JPG Compress", icon: ImageIcon, desc: "Compress JPG images" },
  { to: "/tools/compress-jpg-to-5kb", label: "JPG Compress to 5KB", icon: ImageIcon, desc: "Specific 5KB optimization" },
];

const studentTools = [
  { to: "/tools/grade-calculator", label: "Grade Calculator", icon: Calculator, desc: "Calculate GPA & weighted grades" },
  { to: "/tools/mock-interview", label: "Mock Interview", icon: Brain, desc: "AI-powered interview practice" },
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
            {links.map((link) => (
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
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Media Tools</h3>
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
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Student Tools</h3>
                    <div className="space-y-1">
                      {studentTools.map((tool) => (
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
            {links.map((link) => (
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
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Media Tools</h3>
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
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Student Tools</h3>
                  <div className="space-y-1">
                    {studentTools.map((tool) => (
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
