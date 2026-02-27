"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navigation />
            <main className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
                    <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
                    <Link href="/" className="text-primary underline hover:text-primary/80">
                        Return to Home
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
