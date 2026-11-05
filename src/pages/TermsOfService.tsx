import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                title="Terms of Service - FreeImagePrompt"
                description="Review the FreeImagePrompt terms of service that govern your use of our free online image compression and conversion tools."
                canonicalUrl="https://freeimageprompt.com/terms-of-services"
            />
            <Navigation />
            <main className="pt-24 pb-16 px-4 container mx-auto max-w-4xl space-y-6 text-muted-foreground">
                <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
                <p className="text-sm text-muted-foreground/80">Last updated: November 2026</p>

                <p>
                    Welcome to <strong className="text-foreground">FreeImagePrompt</strong> (<a href="https://freeimageprompt.com" className="text-primary underline">https://freeimageprompt.com</a>).
                    By accessing or using our website, services, and online tools, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use our services.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Use of Services & Free Tools</h2>
                <p>
                    FreeImagePrompt provides web-based image manipulation tools including, but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>JPG image compression to targeted file sizes (5KB, 10KB, 20KB, 50KB, 100KB, etc.)</li>
                    <li>Image format converters (WebP to JPG, PNG to JPG, HEIC to JPG, JPG to WebP)</li>
                    <li>Image DPI checking and print-readiness diagnostics</li>
                    <li>Creative prompt generators and inspirational resources</li>
                </ul>
                <p>
                    Our tools are provided completely free of charge for both personal and commercial use. You agree to use these tools only for lawful purposes and in accordance with these Terms.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Intellectual Property & Your Content</h2>
                <p>
                    <strong>You retain 100% full ownership of all images, photos, and files you process through our tools.</strong>
                </p>
                <p>
                    Because all processing is performed entirely client-side inside your own browser session, FreeImagePrompt never copies, stores, transmits, or claims any copyright or intellectual property rights over your uploaded materials.
                </p>
                <p>
                    All website source code, design elements, graphics, logos, trademarks, and documentation provided by FreeImagePrompt remain the exclusive property of FreeImagePrompt.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User Conduct & Prohibited Uses</h2>
                <p>You agree not to use the website or tools:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>In any way that violates any applicable local, national, or international law or regulation.</li>
                    <li>To attempt to reverse engineer, disrupt, tamper with, or compromise the stability of the website infrastructure.</li>
                    <li>To distribute malware, trojans, viruses, or other malicious payloads.</li>
                    <li>To automatically scrape or spam the website in a manner that degrades performance for other users.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Disclaimer of Warranties</h2>
                <p>
                    The tools and services on FreeImagePrompt are provided on an "AS IS" and "AS AVAILABLE" basis, without any warranties of any kind, either express or implied.
                </p>
                <p>
                    While we strive for absolute precision and maximum visual fidelity in our compression algorithms, FreeImagePrompt does not guarantee that file outputs will meet the strict or shifting requirements of every external portal, exam board, or application form. Always double-check your compressed files prior to formal submission.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by applicable law, in no event shall FreeImagePrompt, its developers, or its affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, our tools or website.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Third-Party Links & Advertisements</h2>
                <p>
                    Our website may contain links to third-party websites or services (including advertisements served by Google AdSense) that are not owned or controlled by FreeImagePrompt. We assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Changes to Terms</h2>
                <p>
                    We reserve the right to revise or replace these Terms of Service at any time. Changes will become effective immediately upon posting on this page.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Contact Information</h2>
                <p>
                    If you have questions or inquiries regarding these Terms of Service, please reach out to us:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Email: <strong className="text-foreground">mehmoodislam10@gmail.com</strong></li>
                    <li>Contact Page: <Link to="/contact" className="text-primary underline">https://freeimageprompt.com/contact</Link></li>
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
