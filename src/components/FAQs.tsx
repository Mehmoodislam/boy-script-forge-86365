import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqs = [
    {
      question: "Are these tools completely free to use?",
      answer: "Yes, every tool on FreeImagePrompt is 100% free to use. There are no hidden fees, subscriptions, or watermarks."
    },
    {
      question: "Do I need to install any software or app?",
      answer: "Not at all! All our utilities work directly within your web browser without requiring any downloads or installations."
    },
    {
      question: "Are my images and files secure?",
      answer: "Absolutely. Our image compression and resizing tools process your files locally in your browser. This means your files never leave your device and are never uploaded to our servers."
    },
    {
      question: "What devices are supported?",
      answer: "Our website is fully responsive, meaning you can comfortably use our tools on your smartphone, tablet, or desktop computer."
    },
    {
      question: "Is there a daily limit on tool usage?",
      answer: "No, we do not impose any daily limits. You can compress, resize, and use our calculators as many times as you need."
    },
    {
      question: "Can I suggest a new tool for the website?",
      answer: "We love feedback! Please visit our Contact Page to suggest any new tools or utilities you would like to see added."
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
              Everything you need to know about using FreeImagePrompt
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
