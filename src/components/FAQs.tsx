import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqs = [
    {
      question: "Which AI tools support these prompts?",
      answer: "Our prompts are tested on Midjourney, DALL·E, and Stable Diffusion."
    },
    {
      question: "Are these AI prompts really free?",
      answer: "Yes, every AI boy image prompt is 100% free - you can copy, use, and modify them for personal or creative projects."
    },
    {
      question: "Can I use the prompts?",
      answer: "Absolutely. You can tweak lighting, style, emotion, or outfit keywords for custom results."
    },
    {
      question: "Can I use these images for social media?",
      answer: "Yes! AI-generated images and stylish boy dp inspirations are perfect for profiles."
    },
    {
      question: "Why does my result look different?",
      answer: "Each AI model interprets prompts slightly differently. Try using the same seed or version setting in your AI tool for closer results."
    },
    {
      question: "Can I request specific types of prompts?",
      answer: "Yes! Visit our Contact Page to suggest new AI portrait prompt styles like anime, realistic, or cyberpunk."
    }
  ];

  return (
    <section id="faqs" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Frequently Asked <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about using TrendsPrompt
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
