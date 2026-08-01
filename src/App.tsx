import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import About from "./components/About";
import HowToUse from "./components/HowToUse";
import Stylish from "./components/Stylish";
import GalleryPreview from "./components/GalleryPreview";
import ToolSection from "./components/ToolSection";
import Benefits from "./components/Benefits";
import FAQs from "./components/FAQs";
import Gallery from "./app/gallery/GalleryContent";
import Packs from "./app/packs/PacksContent";
import WebpToJpgPage from "./pages/WebpToJpgPage";
import WebpToPngPage from "./pages/WebpToPngPage";
import PngToWebpPage from "./pages/PngToWebpPage";
import PngToJpgPage from "./pages/PngToJpgPage";
import JpgToWebpPage from "./pages/JpgToWebpPage";
import HeicToJpgPage from "./pages/HeicToJpgPage";
import ImageDpiCheckerPage from "./pages/ImageDpiCheckerPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import JPGCompressPage from "./pages/JPGCompressPage";
import JPGCompress5kbPage from "./pages/JPGCompress5kbPage";
import JPGIncreaseSizePage from "./pages/JPGIncreaseSizePage";
import JPGReducePage from "./pages/JPGReducePage";
import JPGCompress10kbPage from "./pages/JPGCompress10kbPage";
import JPGCompress15kbPage from "./pages/JPGCompress15kbPage";
import JPGCompress20kbPage from "./pages/JPGCompress20kbPage";
import JPGCompress25kbPage from "./pages/JPGCompress25kbPage";
import JPGCompress30kbPage from "./pages/JPGCompress30kbPage";
import JPGCompress35kbPage from "./pages/JPGCompress35kbPage";
import JPGCompress40kbPage from "./pages/JPGCompress40kbPage";
import JPGCompress45kbPage from "./pages/JPGCompress45kbPage";
import JPGCompress50kbPage from "./pages/JPGCompress50kbPage";
import JPGCompress60kbPage from "./pages/JPGCompress60kbPage";
import JPGCompress70kbPage from "./pages/JPGCompress70kbPage";
import JPGCompress80kbPage from "./pages/JPGCompress80kbPage";
import JPGCompress90kbPage from "./pages/JPGCompress90kbPage";
import JPGCompress100kbPage from "./pages/JPGCompress100kbPage";
import JPGCompress150kbPage from "./pages/JPGCompress150kbPage";
import JPGCompress200kbPage from "./pages/JPGCompress200kbPage";
import JPGCompress250kbPage from "./pages/JPGCompress250kbPage";
import JPGCompress300kbPage from "./pages/JPGCompress300kbPage";
import JPGCompress400kbPage from "./pages/JPGCompress400kbPage";
import JPGCompress500kbPage from "./pages/JPGCompress500kbPage";
import JPGCompress1mbPage from "./pages/JPGCompress1mbPage";
import JPGCompress2mbPage from "./pages/JPGCompress2mbPage";
import JPGCompress5mbPage from "./pages/JPGCompress5mbPage";
import ArtPromptGeneratorPage from "./pages/ArtPromptGeneratorPage";
import ToolsPage from "./pages/ToolsPage";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PageManager from "./pages/admin/PageManager";
import PostManager from "./pages/admin/PostManager";
import NavManager from "./pages/admin/NavManager";
import DynamicPage from "./pages/DynamicPage";
import { ThemeProvider } from "@/hooks/use-theme";

const queryClient = new QueryClient();

const Home = () => (
    <div className="min-h-screen bg-background">
        <Navigation />
        <Hero />
        {/* <GalleryPreview /> */}
        <ToolSection />
        <About />
        <HowToUse />
        {/* <Stylish /> */}
        <Benefits />
        <FAQs />
        <Footer />
    </div>
);


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <TooltipProvider>
                    <Toaster />
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/packs" element={<Packs />} />
                            <Route path="/tools" element={<ToolsPage />} />
                            <Route path="/tools/webp-to-jpg" element={<WebpToJpgPage />} />
                            <Route path="/tools/webp-to-png" element={<WebpToPngPage />} />
                            <Route path="/tools/png-to-webp" element={<PngToWebpPage />} />
                            <Route path="/tools/png-to-jpg" element={<PngToJpgPage />} />
                            <Route path="/tools/jpg-to-webp" element={<JpgToWebpPage />} />
                            <Route path="/tools/heic-to-jpg" element={<HeicToJpgPage />} />
                            <Route path="/tools/image-dpi-checker" element={<ImageDpiCheckerPage />} />
                            <Route path="/tools/jpg-compress" element={<JPGCompressPage />} />
                            <Route path="/tools/reduce-jpg-size" element={<JPGReducePage />} />
                            <Route path="/tools/increase-jpg-size" element={<JPGIncreaseSizePage />} />
                            <Route path="/tools/compress-jpg-to-5kb" element={<JPGCompress5kbPage />} />
                            <Route path="/tools/compress-jpg-to-10kb" element={<JPGCompress10kbPage />} />
                            <Route path="/tools/compress-jpg-to-15kb" element={<JPGCompress15kbPage />} />
                            <Route path="/tools/compress-jpg-to-20kb" element={<JPGCompress20kbPage />} />
                            <Route path="/tools/compress-jpg-to-25kb" element={<JPGCompress25kbPage />} />
                            <Route path="/tools/compress-jpg-to-30kb" element={<JPGCompress30kbPage />} />
                            <Route path="/tools/compress-jpg-to-35kb" element={<JPGCompress35kbPage />} />
                            <Route path="/tools/compress-jpg-to-40kb" element={<JPGCompress40kbPage />} />
                            <Route path="/tools/compress-jpg-to-45kb" element={<JPGCompress45kbPage />} />
                            <Route path="/tools/compress-jpg-to-50kb" element={<JPGCompress50kbPage />} />
                            <Route path="/tools/compress-jpg-to-60kb" element={<JPGCompress60kbPage />} />
                            <Route path="/tools/compress-jpg-to-70kb" element={<JPGCompress70kbPage />} />
                            <Route path="/tools/compress-jpg-to-80kb" element={<JPGCompress80kbPage />} />
                            <Route path="/tools/compress-jpg-to-90kb" element={<JPGCompress90kbPage />} />
                            <Route path="/tools/compress-jpg-to-100kb" element={<JPGCompress100kbPage />} />
                            <Route path="/tools/compress-jpg-to-150kb" element={<JPGCompress150kbPage />} />
                            <Route path="/tools/compress-jpg-to-200kb" element={<JPGCompress200kbPage />} />
                            <Route path="/tools/compress-jpg-to-250kb" element={<JPGCompress250kbPage />} />
                            <Route path="/tools/compress-jpg-to-300kb" element={<JPGCompress300kbPage />} />
                            <Route path="/tools/compress-jpg-to-400kb" element={<JPGCompress400kbPage />} />
                            <Route path="/tools/compress-jpg-to-500kb" element={<JPGCompress500kbPage />} />
                            <Route path="/tools/compress-jpg-to-1mb" element={<JPGCompress1mbPage />} />
                            <Route path="/tools/compress-jpg-to-2mb" element={<JPGCompress2mbPage />} />
                            <Route path="/tools/compress-jpg-to-5mb" element={<JPGCompress5mbPage />} />
                            <Route path="/tools/art-prompt-generator" element={<ArtPromptGeneratorPage />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-services" element={<TermsOfService />} />
                            
                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/pages" element={<PageManager />} />
                            <Route path="/admin/posts" element={<PostManager />} />
                            <Route path="/admin/navigation" element={<NavManager />} />

                            {/* Dynamic CMS Pages (Catch-all) */}
                            <Route path="/:slug" element={<DynamicPage />} />
                        </Routes>
                    </Router>
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
