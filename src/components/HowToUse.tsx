import { Search, Copy, Wand2, CheckCircle } from "lucide-react";

const HowToUse = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse Gallery",
      description: "Explore our collection of handsome boy prompts. Each image shows the exact result you can achieve."
    },
    {
      icon: Copy,
      title: "Copy Prompt",
      description: "Click on any image to view its prompt. Hit the copy button to instantly copy it to your clipboard."
    },
    {
      icon: Wand2,
      title: "Generate Image",
      description: "Paste the prompt into your favorite AI image generator (Midjourney, DALL-E, Stable Diffusion, etc.)."
    },
    {
      icon: CheckCircle,
      title: "Enjoy Results",
      description: "Watch as the AI creates a stunning, stylish portrait based on our professionally crafted prompt."
    }
  ];

  return (
    <section id="how-to-use" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How to <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Use</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Creating stunning AI portraits is just four simple steps away
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
