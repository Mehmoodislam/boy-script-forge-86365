import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import GalleryPreview from "@/components/GalleryPreview";
import About from "@/components/About";
import HowToUse from "@/components/HowToUse";
import Stylish from "@/components/Stylish";
import Benefits from "@/components/Benefits";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Stylish Handsome Boy Pic – Trending Gemini AI Photo Prompts | FreeImagePrompt"
        description="Create stylish handsome boy pic using trending Gemini AI photo prompts. Free copy-paste prompts for boy DP, profile pictures & social media."
        canonicalUrl="https://freeimageprompt.com/"
        keywords="AI image prompts, stylish boy DP, cute boy photos, ai boy image prompt, trending boy pic, gemini ai photo prompt"
      />
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
};

export default Index;
