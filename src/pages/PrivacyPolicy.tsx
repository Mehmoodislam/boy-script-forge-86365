import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          
          <p className="text-muted-foreground mb-8">Last updated: October 28, 2025</p>
          
          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to TrendsPrompt. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may collect, use, store and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Usage Data: Information about how you use our website and services</li>
                <li>Technical Data: IP address, browser type and version, time zone setting</li>
                <li>Analytics Data: Pages visited, time spent on pages, and click patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect in the following ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>To provide and maintain our service</li>
                <li>To improve and optimize our website</li>
                <li>To understand how our users interact with our prompts</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share generic 
                aggregated demographic information not linked to any personal identification information with our 
                partners and affiliates for the purposes outlined above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may use cookies to enhance user experience. You can choose to set your web browser to 
                refuse cookies, or to alert you when cookies are being sent. Note that some parts of the site may 
                not function properly without cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal 
                data. However, please note that no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>The right to access your personal data</li>
                <li>The right to rectification of inaccurate data</li>
                <li>The right to erasure of your personal data</li>
                <li>The right to object to processing of your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
