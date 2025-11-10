import { Search, Copy, Wand2, CheckCircle } from "lucide-react";

const HowToUse = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse Gallery",
      description: "Explore our collection of realistic, handsome AI boy prompts. Each example image shows exactly what the AI can generate."
    },
    {
      icon: Copy,
      title: "Copy Prompt",
      description: "Click on any image to view its detailed prompt. Hit the copy button for one-click access."
    },
    {
      icon: Wand2,
      title: "Generate Image",
      description: "Paste the prompt into your chosen AI tool - Midjourney, DALL·E, or Stable Diffusion - and hit generate."
    },
    {
      icon: CheckCircle,
      title: "Enjoy Results",
      description: "Get a high-quality, styled portrait ready for social media, design projects, or creative inspiration."
    }
  ];

  return (
    <section id="how-to-use" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How to <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Use Stunning AI Portraits</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Making AI-generated boy portraits is simple. Follow these steps to create stylish results instantly:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
