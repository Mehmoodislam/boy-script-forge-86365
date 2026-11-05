import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                title="Privacy Policy – FreeImagePrompt"
                description="Read the FreeImagePrompt privacy policy to understand how we collect, use, and protect your information, including cookies and advertising policies."
                canonicalUrl="https://freeimageprompt.com/privacy-policy"
            />
            <Navigation />
            <main className="pt-24 pb-16 px-4 container mx-auto max-w-4xl space-y-6 text-muted-foreground">
                <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground/80">Last updated: November 2026</p>

                <p>
                    At <strong className="text-foreground">FreeImagePrompt</strong> (accessible from{" "}
                    <a href="https://freeimageprompt.com" className="text-primary underline">https://freeimageprompt.com</a>),
                    one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by FreeImagePrompt and how we use it.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. 100% Client-Side Image Processing & File Privacy</h2>
                <p>
                    We respect your privacy above all else. When you use our image compression, resizing, conversion (such as WebP to JPG, HEIC to JPG, PNG to JPG), or DPI checker tools:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Your files are never uploaded to our servers.</strong> All image manipulations are executed locally inside your web browser using HTML5 Canvas, WebAssembly, and JavaScript client-side APIs.</li>
                    <li>We do not store, view, copy, or retain any images, documents, or graphics you process on our website.</li>
                    <li>Once you close or refresh your browser tab, the temporary in-memory objects are instantly discarded by your own device.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Information We Collect Automatically (Log Files)</h2>
                <p>
                    Like most standard website operators, FreeImagePrompt follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Internet Protocol (IP) addresses</li>
                    <li>Browser type and version</li>
                    <li>Internet Service Provider (ISP)</li>
                    <li>Date and time stamp</li>
                    <li>Referring and exit pages</li>
                    <li>Number of clicks and navigational paths</li>
                </ul>
                <p>
                    These logs are not linked to any personally identifiable information. The purpose of this information is to analyze trends, administer the site, track users' movement on the website, and gather broad demographic insights.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Cookies and Web Beacons</h2>
                <p>
                    FreeImagePrompt uses cookies to store information about visitors' preferences, record user-specific information on which pages the visitor accesses or visits, and customize web page content based on visitors' browser type or other information that the visitor sends via their browser.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Google AdSense & DoubleClick DART Cookies</h2>
                <p>
                    Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <strong className="text-foreground">www.freeimageprompt.com</strong> and other sites on the internet.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.
                    </li>
                    <li>
                        Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.
                    </li>
                    <li>
                        Users may opt out of personalized advertising by visiting Google's{" "}
                        <a
                            href="https://adssettings.google.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline font-medium"
                        >
                            Ads Settings
                        </a>.
                    </li>
                    <li>
                        Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{" "}
                        <a
                            href="https://www.aboutads.info/choices/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline font-medium"
                        >
                            www.aboutads.info
                        </a>.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Third-Party Privacy Policies</h2>
                <p>
                    FreeImagePrompt's Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                </p>
                <p>
                    You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
                <p>Under the California Consumer Privacy Act (CCPA), California consumers have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Request that a business disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                    <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                    <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data. (Note: FreeImagePrompt does not sell personal information).</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. GDPR Data Protection Rights</h2>
                <p>We want to ensure you are fully aware of all of your data protection rights under the EU General Data Protection Regulation (GDPR):</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                    <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
                    <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                    <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Children's Information</h2>
                <p>
                    Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. FreeImagePrompt does not knowingly collect any Personal Identifiable Information from children under the age of 13.
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9. Contact Us</h2>
                <p>
                    If you have any questions or suggestions about our Privacy Policy or data protection practices, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Email: <strong className="text-foreground">support@freeimageprompt.com</strong></li>
                    <li>Website: <a href="https://freeimageprompt.com/contact" className="text-primary underline">https://freeimageprompt.com/contact</a></li>
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
