import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import GalleryPreview from "@/components/GalleryPreview";
import About from "@/components/About";
import HowToUse from "@/components/HowToUse";
import Stylish from "@/components/Stylish";
import Benefits from "@/components/Benefits";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";

const Index = () => {
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
};

export default Index;
