import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqs = [
    {
      question: "What AI image generators work with these prompts?",
      answer: "Our prompts are designed to work with all major AI image generators including Midjourney, DALL-E 3, Stable Diffusion, Leonardo.ai, and more. The prompts use universal descriptive language that any AI can understand."
    },
    {
      question: "Are these prompts really free to use?",
      answer: "Yes! All prompts on StylePrompts are completely free to use. There are no hidden costs, premium tiers, or subscriptions. Browse, copy, and use as many prompts as you want."
    },
    {
      question: "Can I modify the prompts?",
      answer: "Absolutely! Feel free to customize any prompt to better suit your needs. You can adjust details like clothing, background, lighting, or style to create your perfect image."
    },
    {
      question: "How do I use the prompts?",
      answer: "Simply click on any image in our gallery to view its prompt, hit the copy button, then paste it into your preferred AI image generator. The AI will create an image based on that prompt."
    },
    {
      question: "Why aren't my results identical to the examples?",
      answer: "AI image generators have some randomness built in, so results will vary slightly. However, our prompts are crafted to give consistent, high-quality results across different generations."
    },
    {
      question: "Can I request specific types of prompts?",
      answer: "We're constantly expanding our collection. While we don't take individual requests, we regularly add new styles and variations based on popular demand."
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
              Everything you need to know about using StylePrompts
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
