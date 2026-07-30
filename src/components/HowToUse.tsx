import { Upload, Sliders, Download, ShieldCheck } from "lucide-react";

const HowToUse = () => {
  const steps = [
    {
      icon: Upload,
      title: "Drop Your Image",
      description: "Open any tool and drag your photo into the upload area - JPG, PNG, WebP, or HEIC all work."
    },
    {
      icon: Sliders,
      title: "Adjust or Convert",
      description: "Pick a target size or format. Tools are preset for common requirements like 50KB, 20KB, or converting HEIC to JPG."
    },
    {
      icon: Download,
      title: "Download Instantly",
      description: "Hit the download button and your processed file is saved to your device in seconds."
    },
    {
      icon: ShieldCheck,
      title: "Stays Private",
      description: "Everything runs in your browser. Your image never leaves your device - nothing uploaded, nothing stored."
    }
  ];

  return (
    <section id="how-to-use" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight break-words text-center">
            How to <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Compress or Convert Images</span>
          </h2>
          <p className="text-lg text-muted-foreground">
             Using FreeImagePrompt takes just a few seconds:
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
