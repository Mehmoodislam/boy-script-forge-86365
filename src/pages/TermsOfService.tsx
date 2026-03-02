import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="pt-24 pb-16 px-4 container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <p className="mb-4">By using our services, you agree to these terms.</p>
                <p>Detailed terms of service content goes here...</p>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
