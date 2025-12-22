import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FileText } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms & Conditions | FreeImagePrompt"
        description="Read the terms and conditions for using FreeImagePrompt. Understand your rights and responsibilities when using our AI prompts."
        canonicalUrl="https://freeimageprompt.com/terms-conditions"
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          </div>
          
          <p className="text-muted-foreground mb-8">Last updated: October 28, 2025</p>
          
          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using FreeImagePrompt, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                FreeImagePrompt provides AI prompts for generating stylish portraits. You agree to use the service only for lawful purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>You will not use the service for any illegal or unauthorized purpose</li>
                <li>You will not violate any laws in your jurisdiction</li>
                <li>You will not transmit any malicious code or viruses</li>
                <li>You will respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The prompts, designs, images, and content on FreeImagePrompt are provided for personal and commercial use. 
                You are free to use the prompts to generate your own images. However, you may not redistribute or resell 
                the prompts themselves without proper attribution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When using our prompts with AI image generators, you are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Complying with the terms of service of the AI platform you use</li>
                <li>Ensuring generated content does not infringe on anyone's rights</li>
                <li>Using the generated images ethically and legally</li>
                <li>Not creating harmful, offensive, or misleading content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                FreeImagePrompt is provided "as is" without any warranties, expressed or implied. We do not guarantee 
                that the service will be uninterrupted, secure, or error-free. The prompts are provided as suggestions 
                and results may vary depending on the AI platform used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                FreeImagePrompt and its creators shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service. This includes any images 
                generated using our prompts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Content Accuracy</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to provide high-quality prompts, we make no guarantees about the accuracy or quality 
                of images generated using our prompts. Results depend on the AI platform and settings used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Modifications to Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or discontinue the service at any time without notice. We shall not 
                be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may revise these terms at any time. By continuing to use FreeImagePrompt after changes are posted, 
                you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws, without regard 
                to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
