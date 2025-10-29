import { Sparkles, Target, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Handcrafted Prompts",
      description: "Each prompt is carefully crafted to generate stunning, professional-quality images with consistent results."
    },
    {
      icon: Target,
      title: "Proven Results",
      description: "All prompts are tested and verified to work perfectly with major AI image generators like Midjourney, DALL-E, and Stable Diffusion."
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Simply browse, click, copy, and paste. No sign-up required. Start creating amazing images in seconds."
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            About <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">StylePrompts</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Your ultimate resource for creating stunning AI-generated portraits. We provide professionally crafted prompts 
            that help you generate stylish, high-quality images consistently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
