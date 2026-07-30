import { useState } from "react";
import { Image as ImageIcon, Upload, Download, FileJson, CheckCircle2, AlertCircle, Trash2, ArrowRight, X, Layers, List } from "lucide-react";
import imageCompression from "browser-image-compression";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import OtherCompressionSizes from "@/components/OtherCompressionSizes";

interface CompressedResult {
    id: string;
    originalName: string;
    originalSize: number;
    compressedSize: number;
    compressedFile: File;
    previewUrl: string;
    status: "compressing" | "completed" | "error";
    error?: string;
    progress: number;
}

interface JPGCompress5kbProps {
    children?: React.ReactNode;
}

const JPGCompress5kb = ({ children }: JPGCompress5kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 5KB
    const pageTitle = "Compress JPG to 5KB Online - Free, Fast & Precise";
    const metaDescription = "Compress JPG to exactly 5KB online for free using Free Image Prompt. Perfect for government forms, exam portals, and job applications. No signup, browser-based, zero quality compromise.";
    const h1Title = "Compress JPG to 5KB - Instant, Accurate & Completely Free";
    const subTitle = "Struggling with a portal that refuses your image because it exceeds 5KB? You're not alone. Government exam portals and digital KYC forms routinely enforce a strict 5KB upload limit.";

    const getTargetSizeMB = () => {
        return 5 / 1024; // Target: 5KB
    };


    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);
        const validFiles = newFiles.filter(file => file.type.match(/image\/jpe?g/));

        if (validFiles.length < newFiles.length) {
            toast.error(`${newFiles.length - validFiles.length} file(s) skipped (not JPG/JPEG).`);
        }

        if (validFiles.length === 0) return;

        setIsOverallProcessing(true);

        const initialResults: CompressedResult[] = validFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            originalName: file.name,
            originalSize: file.size,
            compressedSize: 0,
            compressedFile: file as File, // placeholder
            previewUrl: "",
            status: "compressing",
            progress: 0,
        }));

        setResults(prev => [...prev, ...initialResults]);

        // Process each file
        for (const item of initialResults) {
            const fileToProcess = validFiles.find(f => f.name === item.originalName);
            if (!fileToProcess) continue;

            try {
                const targetSizeMB = getTargetSizeMB();

                // Ultra-small target needs aggressive initial dimension reduction
                let initialDimensions = 400; // < 20KB target

                let options = {
                    maxSizeMB: targetSizeMB,
                    maxWidthOrHeight: initialDimensions,
                    useWebWorker: true,
                    onProgress: (percent: number) => {
                        setResults(prev => prev.map(r => r.id === item.id ? { ...r, progress: percent } : r));
                    },
                };

                let compressedFile = await imageCompression(fileToProcess, options);

                // Iterative compression to hit the target size precisely (within 2% tolerance)
                const targetSizeBytes = targetSizeMB * 1024 * 1024;
                let attempts = 0;

                while (compressedFile.size > targetSizeBytes * 1.02 && attempts < 3) {
                    attempts++;
                    // Progressively reduce maxSizeMB and dimensions to force the library to compress further
                    const reductionFactor = 0.9 - (attempts * 0.1);

                    try {
                        compressedFile = await imageCompression(compressedFile as File, {
                            ...options,
                            maxSizeMB: targetSizeMB * reductionFactor,
                            maxWidthOrHeight: Math.max(160, initialDimensions * reductionFactor),
                        });
                    } catch (retryErr) {
                        console.warn(`Compression attempt ${attempts} failed, sticking with current result`, retryErr);
                        break;
                    }
                }

                const previewUrl = URL.createObjectURL(compressedFile);

                setResults(prev => prev.map(r => r.id === item.id ? {
                    ...r,
                    compressedSize: compressedFile.size,
                    compressedFile: new File([compressedFile], item.originalName, { type: "image/jpeg" }),
                    previewUrl: previewUrl,
                    status: "completed",
                    progress: 100,
                } : r));

            } catch (err: any) {
                console.error("Compression Error Details:", err);
                const errorMessage = err?.message || (err instanceof Event ? "Browser event error" : String(err));

                setResults(prev => prev.map(r => r.id === item.id ? {
                    ...r,
                    status: "error",
                    error: errorMessage
                } : r));
                toast.error(`Failed: ${item.originalName} - ${errorMessage}`);
            }
        }

        setIsOverallProcessing(false);
        toast.success("Batch compression complete!");
    };

    const downloadImage = (result: CompressedResult) => {
        const link = document.createElement("a");
        link.href = result.previewUrl;
        link.download = `compressed_${result.originalName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAll = () => {
        const completed = results.filter(r => r.status === "completed");
        if (completed.length === 0) return;

        completed.forEach((result, index) => {
            setTimeout(() => {
                downloadImage(result);
            }, index * 300);
        });
        toast.info("Downloading all images...");
    };

    const removeResult = (id: string) => {
        setResults(prev => {
            const item = prev.find(r => r.id === id);
            if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
            return prev.filter(r => r.id !== id);
        });
    };

    const clearAll = () => {
        results.forEach(r => {
            if (r.previewUrl) URL.revokeObjectURL(r.previewUrl);
        });
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead title={pageTitle} description={metaDescription} />
            <Navigation />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-left mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-[1px] w-6 bg-rose-500"></span>
                            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-rose-600">
                                FREE TOOL · RUNS IN YOUR BROWSER
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-[#1C1917] leading-tight">
                            {h1Title}
                        </h1>
                        <p className="text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed mb-6">
                            {subTitle}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["100% FREE", "NO SIGNUP", "NO WATERMARK", "FILES NEVER UPLOADED", "UNLIMITED CONVERSIONS"].map((b) => (
                                <span key={b} className="text-[10px] font-mono font-semibold tracking-wider px-3 py-1.5 rounded-full bg-[#EFECE6] text-[#6B645C]">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-10 shadow-sm mb-12 text-center">
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-muted/50 rounded-[2rem] cursor-pointer hover:bg-accent/5 hover:border-primary/50 transition-all group relative z-10"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="mb-4 text-rose-500">
                                    <svg className="w-10 h-10 mx-auto stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                    </svg>
                                </div>
                                <p className="text-lg font-bold text-[#1C1917] mb-1">
                                    Drop your JPG images here
                                </p>
                                <p className="text-sm text-[#78716C] mb-6 font-mono">
                                    Supports batch upload (JPG/JPEG only)
                                </p>
                                <span className="px-6 py-2.5 rounded-lg bg-[#1C1917] text-white text-sm font-semibold hover:bg-black transition-colors shadow-sm">
                                    Choose Photos
                                </span>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg"
                                multiple
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>

                    {results.length > 0 && (
                        <div className="space-y-6 mb-16">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#F5F3ED] p-4 rounded-xl border border-[#E6E2D8]">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-mono font-bold px-3 py-1 bg-[#F5F3ED] text-[#1C1917] rounded-full">
                                        {results.length} Files Selected
                                    </span>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        onClick={clearAll}
                                        disabled={isOverallProcessing}
                                        className="flex-1 sm:flex-none text-xs"
                                    >
                                        Clear All
                                    </Button>
                                    <Button
                                        onClick={downloadAll}
                                        disabled={isOverallProcessing || results.filter(r => r.status === "completed").length === 0}
                                        className="flex-1 sm:flex-none gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download All
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#FAF9F5] border-b border-[#E6E2D8]">
                                            <tr>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">Preview</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">File Info</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] hidden md:table-cell">Size (Before)</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] hidden md:table-cell">Size (After)</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">Status</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E6E2D8]">
                                            {results.map((result) => (
                                                <tr key={result.id} className="group hover:bg-[#FAF9F5] transition-colors">
                                                    <td className="p-4">
                                                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E6E2D8] bg-[#F5F3ED] flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs text-[#1C1917]">
                                                            {result.originalName}
                                                        </p>
                                                        <p className="text-xs text-[#78716C]">{formatSize(result.originalSize)} original</p>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <span className="text-sm font-semibold text-emerald-700">{formatSize(result.compressedSize)}</span>
                                                        ) : (
                                                            <span className="text-xs text-[#78716C] italic">Processing...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-emerald-700">{formatSize(result.compressedSize)}</span>
                                                                <span className="text-[10px] font-bold uppercase text-emerald-600">
                                                                    Saved {Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-[#78716C] italic">Processing...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {result.status === "compressing" && (
                                                            <div className="w-24 space-y-2">
                                                                <Progress value={result.progress} className="h-1.5" />
                                                            </div>
                                                        )}
                                                        {result.status === "completed" && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase border border-emerald-200">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Success
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right space-x-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => removeResult(result.id)}
                                                            className="h-8 w-8 p-0 rounded-lg text-[#78716C] hover:text-rose-600"
                                                            title="Remove"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-lg font-bold text-[#1C1917]">Bulk Processing</h3>
                            <p className="text-[#6B645C] text-sm">
                                Save time by uploading hundreds of images at once. Our engine handles multi-file compression with ease.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-lg font-bold text-[#1C1917]">100% Client-Side</h3>
                            <p className="text-[#6B645C] text-sm">
                                Your privacy is our priority. Images never leave your device. All processing happens locally in your browser.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-lg font-bold text-[#1C1917]">Quality Preservation</h3>
                            <p className="text-[#6B645C] text-sm">
                                Our smart algorithms reduce file size while keeping your photos looking sharp and professional.
                            </p>
                        </div>
                    </div>

                    <div className="prose-editorial text-left space-y-10 border-t border-[#E6E2D8] pt-12">
                        {/* Why section */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Why Do Portals Demand Images as Small as 5KB?</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed">
                                        A 5KB limit is among the strictest file size requirements you'll encounter online. Portals enforce it for very specific reasons - server efficiency, database storage optimization, and standardized document processing.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Digital signature file for competitive exams like SSC CGL, UPSC, NEET, or state-level PSC boards.",
                                            "Bank account verification systems and KYC forms.",
                                            "Cooperative society membership and registration forms.",
                                            "University student ID and profile registration portals."
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex items-center justify-center">
                                    <p className="text-lg font-medium text-center italic text-primary/80">
                                        "Understanding this helps you trust that our tool isn't just making your image smaller — it's making it compliant."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How to compress (Steps) */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8">How to Compress JPG to 5KB - Step-by-Step</h2>
                            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                                {[
                                    { title: "Open Tool", text: "Go to Free Image Prompt — no login or account creation needed." },
                                    { title: "Upload Image", text: "Upload your JPG or JPEG file directly from your device, phone gallery, or cloud storage." },
                                    { title: "Select 5KB Preset", text: "Select the '5KB' preset from the target size options on the interface." },
                                    { title: "Adjust Quality", text: "Fine-tune settings if your image contains critical detail like text or signatures." },
                                    { title: "Click Compress", text: "Process everything inside your browser instantly and preview the result." },
                                    { title: "Ready to Use", text: "Download your 5KB-compliant image, ready for any portal submission." }
                                ].map((step, i) => (
                                    <div key={i} className="relative p-6 rounded-2xl bg-white border border-[#E6E2D8] hover:border-[#1C1917] transition-colors">
                                        <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg">
                                            {i + 1}
                                        </span>
                                        <h3 className="font-bold mb-2 mt-2">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Features */}
                        <div>
                            <h2 className="text-3xl font-bold mb-12 text-center">Key Features That Make Free Image Prompt the Best Choice</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { title: "Complete Browser-Side Privacy", text: "Your image never leaves your device. We process everything locally for maximum safety.", icon: <Upload className="h-6 w-6" /> },
                                    { title: "Pinpoint 5KB Targeting", text: "Our iterative algorithm homes in on exactly 5KB, meeting precise requirements every time.", icon: <Layers className="h-6 w-6" /> },
                                    { title: "Unlimited Free Compressions", text: "No daily limits, no paywalls. Compress as many images as you need, completely free.", icon: <CheckCircle2 className="h-6 w-6" /> },
                                    { title: "Works on Any Device", text: "Runs perfectly in any modern browser on Android, iOS, Windows, or Mac without app installation.", icon: <ImageIcon className="h-6 w-6" /> }
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-6 p-6 rounded-3xl bg-card border border-border hover:shadow-lg transition-all">
                                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-2">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center">Pro Tips for the Best 5KB Output</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { t: "Start small", d: "A 150x180 pixel portrait compresses to 5KB far more cleanly than a 2MB smartphone photo. Always try to use smaller dimensions initially." },
                                    { t: "Scan smart", d: "If you're compressing a signature, scan it on a white background to reduce color data and preserve line clarity." },
                                    { t: "Verify preview", d: "Always use Free Image Prompt's preview zoom feature to verify results meet your visual standards before submission." },
                                    { t: "Avoid JPG-to-JPG", d: "Upload the original high-resolution version instead of an already compressed one for the cleanest final 5KB output." }
                                ].map((tip, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-card border border-border border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
                                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                            <span className="text-primary">Tip {i + 1}:</span> {tip.t}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
                            <div className="bg-primary px-8 py-6">
                                <h2 className="text-2xl font-bold text-primary-foreground">Free Image Prompt vs Alternatives - 5KB Precision</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="p-5 font-bold border-b border-border">Feature</th>
                                            <th className="p-5 font-bold border-b border-border text-primary">Free Image Prompt</th>
                                            <th className="p-5 font-bold border-b border-border">Common Tools</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            { f: "Precise 5KB Limit", a: "✅ Guaranteed", b: "❌ Approximate" },
                                            { f: "Signature Optimization", a: "✅ Yes", b: "❌ No" },
                                            { f: "Zero Server Upload", a: "✅ Yes", b: "❌ No" },
                                            { f: "Iterative Engine", a: "✅ Yes", b: "❌ No" },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-accent/5 transition-colors">
                                                <td className="p-5 font-medium">{row.f}</td>
                                                <td className="p-5 text-primary font-bold">{row.a}</td>
                                                <td className="p-5 text-muted-foreground">{row.b}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Different Sizes */}
                        <div className="bg-primary/5 p-8 md:p-12 rounded-[2.5rem] border border-primary/10 text-center">
                            <h2 className="text-3xl font-bold mb-6">Compress JPG to Any KB - High Precision</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { s: "10KB", d: "Standard Forms", p: "/tools/compress-jpg-to-10kb" },
                                    { s: "20KB", d: "SSC/PSC Exams", p: "/tools/compress-jpg-to-20kb" },
                                    { s: "50KB", d: "Financial KYC", p: "/tools/compress-jpg-to-50kb" },
                                    { s: "100KB", d: "Official Portal", p: "/tools/compress-jpg-to-100kb" }
                                ].map((size, i) => (
                                    <a key={i} href={size.p} className="p-4 rounded-2xl bg-white border border-[#E6E2D8] hover:border-[#1C1917] hover:shadow-lg transition-all group">
                                        <div className="font-black text-xl text-primary group-hover:scale-110 transition-transform">{size.s}</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mt-1">{size.d}</div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div className="text-center space-y-6 py-10">
                            <h2 className="text-3xl font-bold font-black tracking-tight">THE SMARTEST WAY TO HIT 5KB</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto italic">
                                "Whether it's for a government exam or a bank document, we make hitting that strict 5KB limit effortless."
                            </p>
                            <p className="text-primary font-bold text-2xl uppercase tracking-tighter">
                                PRIVACY-FIRST. PRECISION-DRIVEN. 100% FREE.
                            </p>
                        </div>
                    </div>

                    <OtherCompressionSizes />

                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JPGCompress5kb;
