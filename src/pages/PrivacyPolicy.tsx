import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="pt-24 pb-16 px-4 container mx-auto max-w-4xl space-y-6 text-muted-foreground">
                <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
                
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>At our website, your privacy is extremely important to us. This Privacy Policy outlines the types of personal information that is received and collected and how it is used.</p>
                
                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
                <p>We only collect information that is necessary to provide you with our services. This may include:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Usage data, such as IP addresses, browser types, and referring pages.</li>
                    <li>Uploaded files and images for processing.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
                <p>The information we collect is used in the following ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To provide, operate, and maintain our site.</li>
                    <li>To improve, personalize, and expand our site.</li>
                    <li>To understand and analyze how you use our site.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. File Uploads and Processing</h2>
                <p>When you use our image conversion or compression tools, the files you upload are processed securely. We do not claim ownership of any files you upload. We prioritize your privacy and ensure that processed files are handled safely.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Cookies</h2>
                <p>We may use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Changes to This Privacy Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
                <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
