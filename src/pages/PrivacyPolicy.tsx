import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy | FreeImagePrompt"
        description="Learn how FreeImagePrompt collects, uses, and protects your personal data. Read our privacy policy for details."
        canonicalUrl="https://freeimageprompt.com/privacy-policy"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-foreground">

          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: 23/12/2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, such as when you create an account,
              upload prompts, or interact with our services. This may include your email address,
              username, and any content you choose to share.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To personalize your experience on our platform</li>
              <li>To communicate with you about our services</li>
              <li>To ensure the security and integrity of our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Google AdSense and Third-Party Advertising</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use <strong>Google AdSense</strong> to display advertisements on our website.
              Google AdSense and other third-party advertising partners may place cookies on your browser,
              use web beacons, or collect your IP address to serve personalized advertisements based on
              your interests and browsing behavior.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              These third parties may be placing and reading cookies on your browser, or using web beacons
              or IP addresses to collect information in the process of ad serving on our website.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              For more information about how Google uses your data when you use our website,
              please visit: <strong>How Google uses data when you use our partners' sites or apps</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may opt out of personalized advertising by visiting
              <strong>Google Ads Settings</strong>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service
              and store certain information. You can instruct your browser to refuse all cookies
              or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service may contain links to other websites that are not operated by us.
              We strongly advise you to review the Privacy Policy of every site you visit,
              as we have no control over their content or practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted
              on this page along with an updated "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Children’s Privacy (COPPA)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not directed to children under the age of 13. We do not knowingly
              collect personally identifiable information from children under 13. If we become
              aware that such data has been collected without parental consent, we will take
              steps to remove it from our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">EU User Consent and GDPR</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              For users located in the European Union, we comply with the
              <strong>General Data Protection Regulation (GDPR)</strong> and obtain appropriate
              consent for data processing and personalized advertising.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your personal information and to
              withdraw consent for data processing at any time. Please contact us to exercise
              these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through
              our website or via email.
            </p>
          </section>

        </div>
      </main>


      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
