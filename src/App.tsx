import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { Analytics } from "@vercel/analytics/react";

import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Packs from "./pages/Packs";
import Contact from "./pages/Contact";
import Blog from "./pages/blog";
import BlogPost from "./pages/blog/BlogPost";
import MoodOffDp2026 from "./pages/blog/MoodOffDp2026";
import AttitudeBoyDp2026 from "./pages/blog/AttitudeBoyDp2026";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import YouTubeDownloader from "./pages/YouTubeDownloader";
import GradeCalculator from "./pages/GradeCalculator";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { analytics } from "./firebase";

const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {
    if (analytics) {
      console.log("✅ Firebase Analytics initialized");
    }
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/packs" element={<Packs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/whatsapp-dp-attitude-boy-2026" element={<AttitudeBoyDp2026 />} />
              <Route path="/blog/mood-off-dp-2026" element={<MoodOffDp2026 />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-services" element={<TermsConditions />} />
              <Route path="/tools/youtube-downloader" element={<YouTubeDownloader />} />
              <Route path="/tools/grade-calculator" element={<GradeCalculator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

          {/* Vercel Analytics OK */}
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
