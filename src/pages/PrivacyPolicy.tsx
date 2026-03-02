import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="pt-24 pb-16 px-4 container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="mb-4">Your privacy is important to us. This policy explains how we collect and use your information.</p>
                {/* Add detailed policy here later if needed */}
                <p>Detailed privacy policy content goes here...</p>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
