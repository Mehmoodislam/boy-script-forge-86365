import { Sparkles, Facebook, Instagram, Youtube, Video } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#F2EFF7]/40 border-t border-[#E6E2D8] text-left">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="space-y-3 md:col-span-1">
            <span className="font-bold text-lg text-[#1C1917] font-sans">
              FreeImagePrompt
            </span>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Fast, free & browser-based image conversion tools. No uploads required.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C1917] mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C1917] mb-3">Popular Converters</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/heic-to-jpg" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  HEIC to JPG
                </Link>
              </li>
              <li>
                <Link to="/tools/png-to-jpg" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  PNG to JPG
                </Link>
              </li>
              <li>
                <Link to="/tools/jpg-to-webp" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  JPG to WebP
                </Link>
              </li>
              <li>
                <Link to="/tools/png-to-webp" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  PNG to WebP
                </Link>
              </li>
              <li>
                <Link to="/tools/image-dpi-checker" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Image DPI Checker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C1917] mb-3">JPG Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/compress-jpg-to-20kb" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Compress JPG to 20KB
                </Link>
              </li>
              <li>
                <Link to="/tools/compress-jpg-to-50kb" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Compress JPG to 50KB
                </Link>
              </li>
              <li>
                <Link to="/tools/compress-jpg-to-100kb" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Compress JPG to 100KB
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C1917] mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-services" className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors">
                  Terms of Services
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E6E2D8] text-center">
          <p className="text-xs text-[#78716C]">
            © 2025 FreeImagePrompt. All rights reserved. 100% Client-side Free Utilities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
