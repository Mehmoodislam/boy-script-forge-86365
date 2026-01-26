import { Sparkles, Target, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Handcrafted AI Prompts",
      description: "Each prompt is manually written and optimized for lighting, realism, facial detail, and composition. We test every prompt before publishing to ensure high-quality output."
    },
    {
      icon: Target,
      title: "Proven Results",
      description: "Our prompts work seamlessly with: Midjourney DALL·E Stable Diffusion You get predictable, professional-looking AI portraits every time."
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "No registration. No subscription. Just copy, paste, and generate."
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="
            font-bold
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            leading-tight
            break-words
            text-center 
          ">
            About{" "}
            <span className="
              bg-gradient-to-r from-primary to-primary-glow
              bg-clip-text text-transparent
            ">
              FreeImagePrompt
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
             FreeImagePrompt is built for creators who want <b>ready-to-use AI photo prompts</b> without wasting time on trial and error.
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
