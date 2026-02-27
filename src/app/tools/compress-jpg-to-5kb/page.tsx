import { Metadata } from "next";
import JPGCompress from "@/components/tools/JPGCompress";

export const metadata: Metadata = {
    title: "Compress JPG to 5kb Online - Best Free Image Compressor",
    description: "Compress JPG images to under 5kb easily. Our advanced tool uses recursive optimization to hit the perfect file size while preserving as much detail as possible. batch support included.",
    keywords: ["compress jpg to 5kb", "5kb jpg compressor", "reduce image size to 5kb", "online image optimizer"],
};

export default function Compress5kb() {
    return (
        <JPGCompress targetSize="5kb">
            <article className="mt-16 prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Compress JPG To 5kb Online</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Need to compress JPG to 5kb for an online application or document upload? Our precision compressor is designed for high-accuracy results. We understand that some official portals have very strict size limits, which is why we've built a recursive algorithm that ensures your image stays under the 5kb mark while maintaining as much clarity as possible.
                </p>

                <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">How To Compress JPG to 5kb:</h2>
                <ol className="list-decimal list-outside ml-6 space-y-3 text-muted-foreground text-lg mb-8">
                    <li><strong className="text-foreground">Step 1:</strong> Select or drag and drop your JPEG/JPG image into the upload box.</li>
                    <li><strong className="text-foreground">Step 2:</strong> Our tool will automatically process your image with the 5kb target in mind.</li>
                    <li><strong className="text-foreground">Step 3:</strong> Review the result and click "Download" to save your optimized file.</li>
                </ol>

                <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Why SmallJPG for 5kb Compression?</h2>
                <ul className="list-disc list-outside ml-6 space-y-3 text-muted-foreground text-lg mb-8">
                    <li><strong className="text-foreground">Smart Optimization:</strong> Automatically scales dimensions if quality alone isn't enough to hit 5kb.</li>
                    <li><strong className="text-foreground">Privacy First:</strong> Your images never leave your computer. Processing is done entirely in-browser.</li>
                    <li><strong className="text-foreground">Zero Cost:</strong> Compress unlimited images to 5kb without any hidden fees or watermarks.</li>
                </ul>

                <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-6 mb-10">
                    <div>
                        <h4 className="text-xl font-bold text-foreground">Will my image lose quality?</h4>
                        <p className="text-muted-foreground">Compressing to 5kb is a significant reduction. While some quality loss is inevitable, our tool uses advanced logic to preserve as much detail as mathematically possible.</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-foreground">Is batch compression supported?</h4>
                        <p className="text-muted-foreground">Yes! You can upload multiple JPGs at once and our tool will process them all to under 5kb simultaneously.</p>
                    </div>
                </div>
            </article>
        </JPGCompress>
    );
}
