import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "No experimentation needed - ready-to-use prompts."
    },
    {
      icon: DollarSign,
      title: "Completely Free",
      description: "All AI prompts are 100% free, forever."
    },
    {
      icon: TrendingUp,
      title: "Professional Quality",
      description: "Generate portraits that look like real studio photoshoots."
    },
    {
      icon: Users,
      title: "Universal Compatibility",
      description: "Works with all major AI image generators."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight break-words ">
            Why Creators Love <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">FreeImagePrompt</span>
          </h2>
          <p className=" text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words text-center">
            Discover the advantages of using our curated prompt library
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
