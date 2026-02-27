import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import GalleryPreview from "@/components/GalleryPreview";
import About from "@/components/About";
import HowToUse from "@/components/HowToUse";
import Stylish from "@/components/Stylish";
import Benefits from "@/components/Benefits";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Stylish Handsome Boy Pic – Trending Gemini AI Photo Prompts | FreeImagePrompt",
    description: "Create stylish handsome boy pic using trending Gemini AI photo prompts. Free copy-paste prompts for boy DP, profile pictures & social media.",
    keywords: "AI image prompts, stylish boy DP, cute boy photos, ai boy image prompt, trending boy pic, gemini ai photo prompt",
};

export default function Home() {
    return (
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
}
