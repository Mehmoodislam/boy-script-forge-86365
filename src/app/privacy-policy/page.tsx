"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-foreground">
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-10">Last updated: 23/12/2025</p>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We collect information you provide directly to us...
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
