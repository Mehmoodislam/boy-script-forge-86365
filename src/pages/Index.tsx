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
        title="Free Image Prompt Stylish Boy DP: Cute Boy Pics & Photo for Your Profile | FreeImagePrompt"
        description="Discover 170+ free AI image prompts for creating stunning stylish boy portraits. Perfect for Midjourney, DALL-E, and Stable Diffusion."
        canonicalUrl="https://freeimageprompt.com/"
        keywords="AI image prompts, stylish boy DP, cute boy photos, AI art generator, Midjourney prompts, DALL-E prompts"
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
