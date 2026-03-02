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
import Benefits from "./components/Benefits";
import FAQs from "./components/FAQs";
import Gallery from "./app/gallery/GalleryContent";
import Packs from "./app/packs/PacksContent";
import YouTubeDownloader from "./app/tools/youtube-downloader/YouTubeContent";
import MockInterview from "./app/tools/mock-interview/MockContent";
import GradeCalculator from "./app/tools/grade-calculator/GradeContent";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import JPGCompressPage from "./pages/JPGCompressPage";
import { ThemeProvider } from "@/hooks/use-theme";

const queryClient = new QueryClient();

const Home = () => (
    <div className="min-h-screen bg-background">
        <Navigation />
        <Hero />
        <GalleryPreview />
        <About />
        <HowToUse />
        <Stylish />
        <Benefits />
        <FAQs />
        <Footer />
    </div>
);

const JPGCompressPageWithParams = () => {
    const { size } = useParams();
    return <JPGCompressPage targetSize={size} />;
};

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
                            <Route path="/tools/youtube-downloader" element={<YouTubeDownloader />} />
                            <Route path="/tools/mock-interview" element={<MockInterview />} />
                            <Route path="/tools/grade-calculator" element={<GradeCalculator />} />
                            <Route path="/tools/jpg-compress" element={<JPGCompressPage />} />
                            <Route path="/tools/compress-jpg-to-5kb" element={<JPGCompressPage targetSize="5kb" />} />
                            <Route path="/tools/compress-jpg-to-:size" element={<JPGCompressPageWithParams />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-services" element={<TermsOfService />} />
                        </Routes>
                    </Router>
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
