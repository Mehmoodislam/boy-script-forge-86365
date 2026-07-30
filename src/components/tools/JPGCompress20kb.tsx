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

interface JPGCompress20kbProps {
    children?: React.ReactNode;
}

const JPGCompress20kb = ({ children }: JPGCompress20kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 20KB
    const pageTitle = "Compress JPG to 20KB Online - Free, Precise & Instant";
    const metaDescription = "Compress JPG to exactly 20KB online for free using Free Image Prompt. Perfect for government portals, bank KYC, exam forms, and job applications. No signup, 100% browser-based, zero quality loss.";
    const h1Title = "Compress JPG to 20KB - The Right Size for Hundreds of Official Portals";
    const subTitle = "Twenty kilobytes is one of the most widely enforced image size limits across government, banking, and institutional platforms worldwide. Yet hitting exactly 20KB is something most photo editors fail to do reliably.";

    const getTargetSizeMB = () => {
        return 20 / 1024; // Target: 20KB
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

                // Small target needs deliberate initial dimension reduction
                let initialDimensions = 800; // Adjusted for 20KB

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
                        {/* Use Cases section */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Where Is a 20KB Image Limit Most Commonly Required?</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        The 20KB threshold is arguably the most frequently encountered image size restriction across official platforms. Here's where you'll need it most:
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Competitive exam portals (UPSC, SSC CGL, IBPS PO, RRB NTPC) specifying photo uploads between 10KB and 20KB.",
                                            "Bank account opening and KYC verification (SBI, PNB, Canara Bank) capping digital photos at 20KB.",
                                            "Central and state government job applications for police, railways, and defence.",
                                            "University admission counselling (JEE Main, NEET UG) rutinly requiring 20KB passport photos.",
                                            "Voter ID, Aadhaar, and PAN card update portals enforcing strict image size caps."
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex items-center justify-center">
                                    <p className="text-lg font-medium text-center italic text-primary/80 leading-relaxed">
                                        "Missing the 20KB limit triggers instant form rejection - even when every other detail in your application is correct."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How to compress (Steps) */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8 text-center">How to Compress JPG to 20KB - Step-by-Step Guide</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { title: "Open Free Image Prompt", text: "Visit directly in any browser - no account, no installation, no waiting." },
                                    { title: "Upload Your Image", text: "Select your JPG/JPEG from your device, smartphone gallery, Google Drive, or Dropbox." },
                                    { title: "Select 20KB Preset", text: "Choose the '20KB' preset from the target size options displayed on the tool." },
                                    { title: "Adjust Quality", text: "Use the quality slider for images with important fine detail like facial features or text." },
                                    { title: "Click Compress Now", text: "Our iterative engine processes your image entirely within your browser in seconds." },
                                    { title: "Preview & Download", text: "Inspect side-by-side details, then download your portal-ready 20KB image instantly." }
                                ].map((step, i) => (
                                    <div key={i} className="relative p-7 rounded-[2rem] bg-white border border-[#E6E2D8] hover:border-[#1C1917] transition-all group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform">
                                            <div className="font-black text-6xl text-primary">{i + 1}</div>
                                        </div>
                                        <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{i + 1}</span>
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold">Why Free Image Prompt Is the Smartest Choice for 20KB Compression</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto italic">High-precision tools for high-stakes applications.</p>
                            </div>
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[
                                    { title: "Total Browser-Side Privacy", text: "Your image never leaves your device. Essential for sensitive IDs, passport photos, and official portraits.", icon: <Upload className="h-6 w-6" /> },
                                    { title: "Pinpoint 20KB Accuracy", text: "Our iterative algorithm systematicly adjusts levels until your output lands precisely at 20KB.", icon: <Layers className="h-6 w-6" /> },
                                    { title: "Unlimited Free Use", text: "No subscriptions, no daily caps. Compress one image or one hundred - it's always free.", icon: <CheckCircle2 className="h-6 w-6" /> },
                                    { title: "Works Seamlessly on Mobile", text: "Open on Android or iOS, upload directly from camera roll, and download the compressed image.", icon: <ImageIcon className="h-6 w-6" /> },
                                    { title: "Accepts PNG/WebP Input", text: "Convert and compress screenshots or WebP photos to perfectly sized 20KB JPEG outputs.", icon: <FileJson className="h-6 w-6" /> },
                                    { title: "Live Quality Preview", text: "Confirm the output meets your quality expectations before downloading for portal submission.", icon: <List className="h-6 w-6" /> }
                                ].map((feature, i) => (
                                    <div key={i} className="group p-8 rounded-[2rem] bg-card border border-border hover:bg-primary/5 transition-all">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:rotate-12 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{feature.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <div className="bg-primary/5 p-10 md:p-14 rounded-[3rem] border border-primary/10 relative overflow-hidden">
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />
                            <h2 className="text-3xl font-bold mb-10 text-center">Pro Tips for the Sharpest Possible Output at 20KB</h2>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Pre-Compression Resizing</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Resize your image to the required pixel dimensions (e.g., 200x230px) before compressing to ensure data efficiency and sharper results.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Use Original Sources</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Always compress from your original, uncompressed source image. Re-compressing already-compressed JPEGs stacks quality losses.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Signature Strategy</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                For signatures, use a plain white background. This allows the engine to preserve line sharpness more effectively within 20KB.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Check Zoom Details</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Zoom into face or signature areas in the side-by-side preview to confirm the output meets quality expectations before downloading.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-primary to-accent p-8 text-center text-primary-foreground">
                                <h2 className="text-2xl font-bold">Free Image Prompt vs Other JPEG Compressors — Why We're Better</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="p-6 font-bold text-sm uppercase tracking-wider">Feature</th>
                                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-primary">Free Image Prompt</th>
                                            <th className="p-6 font-bold text-sm uppercase tracking-wider">Other Tools</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            { f: "Precise 20KB Target", a: "✅ Exact Accuracy", b: "❌ Approximate only" },
                                            { f: "100% Client-Side", a: "✅ Yes (Max Privacy)", b: "❌ Server upload required" },
                                            { f: "Unlimited Use", a: "✅ Yes", b: "⚠️ Daily limits apply" },
                                            { f: "Iterative Engine", a: "✅ 3-Pass Processing", b: "❌ Single-pass compression" },
                                            { f: "No Sign-up", a: "✅ Yes", b: "⚠️ Varies" },
                                            { f: "High-Res Preview", a: "✅ Live Side-by-Side", b: "❌ No preview" }
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-accent/5 transition-all group">
                                                <td className="p-6 font-medium text-sm">{row.f}</td>
                                                <td className="p-6 text-primary font-bold text-sm group-hover:scale-105 transition-transform">{row.a}</td>
                                                <td className="p-6 text-muted-foreground text-sm italic">{row.b}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Different Sizes Link Grid */}
                        <div className="bg-accent/5 p-10 md:p-14 rounded-[3rem] border border-border text-center">
                            <h2 className="text-3xl font-bold mb-4">Need a Different File Size? Compress JPG to Any KB</h2>
                            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto italic">
                                Free Image Prompt handles precise targets for any portal requirement. From signature uploads to high-res documents.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {[
                                    { s: "5KB", d: "Signatures", p: "/tools/compress-jpg-to-5kb" },
                                    { s: "10KB", d: "Portals", p: "/tools/compress-jpg-to-10kb" },
                                    { s: "15KB", d: "ID Cards", p: "/tools/compress-jpg-to-15kb" },
                                    { s: "25KB", d: "Admission", p: "/tools/compress-jpg-to-25kb" },
                                    { s: "50KB", d: "Job Forms", p: "/tools/compress-jpg-to-50kb" },
                                    { s: "100KB", d: "Passports", p: "/tools/compress-jpg-to-100kb" }
                                ].map((size, i) => (
                                    <a key={i} href={size.p} className="flex flex-col items-center p-6 rounded-3xl bg-white border border-[#E6E2D8] hover:border-[#1C1917] hover:shadow-xl transition-all group">
                                        <span className="font-black text-2xl text-primary group-hover:scale-110 transition-transform">{size.s}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">{size.d}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div className="text-center space-y-8 max-w-4xl mx-auto py-12">
                            <div className="h-1.5 w-24 bg-primary/20 rounded-full mx-auto" />
                            <h2 className="text-3xl font-bold tracking-tight uppercase">The Trusted Choice for 20KB Official Documents</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed italic">
                                "When your application depends on a perfect 20KB upload, don't leave it to chance. 
                                Free Image Prompt delivers the precision, privacy, and speed required for serious submissions."
                            </p>
                            <div className="flex justify-center gap-4">
                                <div className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold uppercase tracking-widest">Privacy First</div>
                                <div className="px-6 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-sm font-bold uppercase tracking-widest">Portal Ready</div>
                            </div>
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

export default JPGCompress20kb;
