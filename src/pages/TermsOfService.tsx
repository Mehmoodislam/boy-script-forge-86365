import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="pt-24 pb-16 px-4 container mx-auto max-w-4xl space-y-6 text-muted-foreground">
                <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
                
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Please read these Terms of Service carefully before using our website and tools.</p>
                
                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Use of Services</h2>
                <p>Our platform provides various tools (such as image compression, conversion, etc.). You agree to use these tools only for lawful purposes and in accordance with these Terms.</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You must not use our services for any illegal or unauthorized purpose.</li>
                    <li>You must not upload files that contain viruses or any other malicious code.</li>
                    <li>You are responsible for any activity that occurs under your usage.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Intellectual Property</h2>
                <p>The service and its original content, features, and functionality are and will remain the exclusive property of our operating team and its licensors. You retain all rights and ownership of the files you upload to our service.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
                <p>In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Changes to Terms</h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us.</p>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
