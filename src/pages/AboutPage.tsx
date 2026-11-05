import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ShieldCheck, Zap, Sparkles, CheckCircle2, Lock, Cpu, Globe2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                title="About Us – FreeImagePrompt"
                description="Learn about FreeImagePrompt: our mission, privacy-first client-side image tools, and how we help users compress, resize, and convert images for free."
                canonicalUrl="https://freeimageprompt.com/about"
            />
            <Navigation />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-4xl space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                            OUR MISSION & STORY
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                            About FreeImagePrompt
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            A privacy-first suite of fast, lightweight, and completely free online utilities built to solve everyday image problems.
                        </p>
                    </div>

                    {/* Story / Mission */}
                    <div className="space-y-6 text-muted-foreground leading-relaxed text-base md:text-lg border-y border-border py-8">
                        <p>
                            <strong className="text-foreground">FreeImagePrompt</strong> was founded with a straightforward goal: eliminate the frustration of uploading personal documents and photographs to slow, ad-choked remote servers just to resize or change an image format.
                        </p>
                        <p>
                            Whether you are applying for a competitive exam that enforces a strict 20KB limit, submitting official government KYC paperwork that rejects 50KB+ files, or converting iPhone HEIC photos into universally compatible JPEGs, our tools get the job done in seconds — completely inside your web browser.
                        </p>
                        <p>
                            We believe that basic digital utilities should be <strong className="text-foreground">free, private, and frictionless</strong>. No accounts, no email signups, no hidden paywalls, and absolutely no watermarks on your photos.
                        </p>
                    </div>

                    {/* Core Pillars */}
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                            Our Core Principles
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 pt-4">
                            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">100% Client-Side Privacy</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Your files never touch our servers. Every byte of compression and conversion runs entirely on your local device CPU/GPU using modern WebAssembly.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">Zero Queue, Instant Speed</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Because there are no network round-trips for image data, processing is instantaneous even on low-bandwidth or unstable cellular connections.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">Accurate Presets</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We provide calibrated target presets (5KB, 10KB, 20KB, 50KB, 100KB) engineered specifically around common portal requirements.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How We Operate */}
                    <div className="p-8 rounded-3xl bg-secondary/30 border border-border space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">
                            How FreeImagePrompt Works Under the Hood
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Traditional converter sites upload your image to their cloud servers, process it with backend software, and then send a download link back. This introduces privacy risks, high server latency, and bandwidth consumption.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            FreeImagePrompt takes full advantage of modern web browser standards. Using HTML5 Canvas, the JavaScript File and Blob APIs, and client-side libraries like <code className="text-xs bg-muted px-1.5 py-0.5 rounded">browser-image-compression</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded">heic2any</code>, your browser executes the compression algorithm locally. Your confidential documents, signatures, and personal photos remain strictly on your own hardware.
                        </p>
                    </div>

                    {/* Editorial & Maintenance commitment */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">
                            Continuous Curation & Reliability
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our engineering team continuously tests and updates the platform to ensure compatibility across all major operating systems (Windows, macOS, Linux, iOS, Android) and browsers (Chrome, Safari, Firefox, Edge).
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                            {[
                                "Regular browser compatibility audits",
                                "Continuous updates to compression algorithms",
                                "Zero retention of user files or metadata",
                                "Dedicated guides and tutorials on format standards",
                                "Free, unrestricted community access",
                                "Rapid response to user bug reports"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact CTA */}
                    <div className="text-center pt-8 border-t border-border space-y-4">
                        <h3 className="text-xl font-bold text-foreground">Have Questions or Suggestions?</h3>
                        <p className="text-sm text-muted-foreground">
                            We're always looking to improve our tools. If you encounter an issue or have a feature request, we'd love to hear from you.
                        </p>
                        <div className="flex justify-center gap-4 pt-2">
                            <Link to="/contact">
                                <Button className="gap-2">
                                    Contact Us <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/tools">
                                <Button variant="outline">
                                    Explore All Tools
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;

