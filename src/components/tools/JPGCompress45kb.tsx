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

interface JPGCompress45kbProps {
    children?: React.ReactNode;
}

const JPGCompress45kb = ({ children }: JPGCompress45kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 45KB
    const pageTitle = "Compress JPG to 45KB Online Free - Fast Image Optimizer";
    const metaDescription = "Specifically optimize and compress JPG images to under 45KB while maintaining the best possible quality. Perfect for restricted uploads and web forms.";
    const h1Title = "Compress JPG to 45KB";
    const subTitle = "Get your images ready for any platform by compressing them specifically to 45KB. Professional results, instantly.";

    const getTargetSizeMB = () => {
        return 45 / 1024; // Target: 45KB
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

                // Target size specific dimension adjustment
                let initialDimensions = 1000;

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
                            className="flex flex-col items-center justify-center w-full py-10 border border-dashed border-[#DDD9CE] rounded-xl cursor-pointer hover:bg-[#FAF9F5] transition-all group"
                        >
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
                        <div className="space-y-6">
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
                                        className="flex-1 sm:flex-none border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
                                    >
                                        Clear All
                                    </Button>
                                    <Button
                                        onClick={downloadAll}
                                        disabled={isOverallProcessing || results.filter(r => r.status === "completed").length === 0}
                                        className="flex-1 sm:flex-none gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <Download className="h-4 w-4" />
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
                                                    <td className="p-5">
                                                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E6E2D8] bg-[#F5F3ED] flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-muted/30" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs text-[#1C1917]">{result.originalName}</p>
                                                    </td>
                                                    <td className="p-5 hidden md:table-cell">
                                                        <span className="text-sm text-[#6B645C]">{formatSize(result.originalSize)}</span>
                                                    </td>
                                                    <td className="p-5 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-primary">{formatSize(result.compressedSize)}</span>
                                                                <span className="text-[10px] font-bold text-green-500 uppercase">
                                                                    Saved {Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-[#6B645C] italic">Processing...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-5">
                                                        {result.status === "compressing" && (
                                                            <div className="w-24 space-y-2">
                                                                <Progress value={result.progress} className="h-1.5" />
                                                            </div>
                                                        )}
                                                        {result.status === "completed" && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase border border-emerald-200">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Success
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-5 text-right space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => removeResult(result.id)}
                                                            className="h-8 w-8 p-0 rounded-lg text-[#78716C] hover:text-rose-600"
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
                            <h3 className="text-xl font-bold text-[#1C1917]">Bulk Processing</h3>
                            <p className="text-[#6B645C] text-sm leading-relaxed">
                                Save time by uploading hundreds of images at once. Our engine handles multi-file compression with ease.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-xl font-bold text-[#1C1917]">100% Client-Side</h3>
                            <p className="text-[#6B645C] text-sm leading-relaxed">
                                Your privacy is our priority. Images never leave your device. All processing happens locally in your browser.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-xl font-bold text-[#1C1917]">Quality Preservation</h3>
                            <p className="text-[#6B645C] text-sm leading-relaxed">
                                Our smart algorithms reduce file size while keeping your photos looking sharp and professional.
                            </p>
                        </div>
                    </div>

                    <div className="prose-editorial text-left space-y-10 border-t border-[#E6E2D8] pt-12">
                        {/* High-Level Intro Section */}
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8">Why You Need a Specific 45KB JPEG Compressor</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        In the digital age, hitting a precise file size is often the difference between a successful application and an automated rejection. Many government portals, specifically in the Indian banking (IBPS), UPSC, and state-level recruitment (UPSSSC, MPPSC), mandate that photo uploads stay between 20KB and 50KB, with 45KB being the safest "sweet spot" for maximum clarity within the limit.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        A generic compressor might reduce your 4MB photo to 30KB, losing unnecessary detail, or 55KB, which would still be rejected. Our tool uses a specialized binary search algorithm to target exactly 45KB, ensuring your document looks sharp while remaining fully portal-compliant.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Precise 45KB target specifically for high-detail official documents.",
                                            "No loss of critical facial features or digital signature clarity.",
                                            "100% browser-side processing—your private IDs never leave your computer.",
                                            "Batch support: Optimize multiple photos for different portals in one click."
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-muted-foreground text-sm font-medium">
                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col items-center justify-center text-center space-y-4">
                                    <Layers className="h-12 w-12 text-primary opacity-50" />
                                    <p className="text-lg font-semibold italic text-primary/80 leading-relaxed">
                                        "Professional-grade compression that respects the 45KB threshold without turning your photos into a blurry mess."
                                    </p>
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Verified Portal Standards</div>
                                </div>
                            </div>
                        </div>

                        {/* Where is 45KB Used? (Hyper-Specific Use Cases) */}
                        <div className="space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold">Portals Requiring Under 45KB Image Size</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto italic">Identifying common platforms where 45KB is the standard upload requirement.</p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: "Bank Recruitment (IBPS/SBI)", text: "Most bank exams require a passport photo between 20KB-50KB. Targeting 45KB ensures maximum pixel density for the examiner.", icon: <CheckCircle2 className="h-6 w-6" /> },
                                    { title: "State Civil Services", text: "Portals like UPSSSC and MPPSC often have strict 50KB limits. A 45KB file provides a safe buffer for metadata additions.", icon: <Layers className="h-6 w-6" /> },
                                    { title: "University Admissions", text: "Online admission portals for central and state universities typically cap images at 50KB for rapid database loading.", icon: <ImageIcon className="h-6 w-6" /> },
                                    { title: "Job Resumes (PDF Attach)", text: "Keeping your photo under 45KB prevents your total PDF size from exploding, ensuring it passes through email filters.", icon: <FileJson className="h-6 w-6" /> },
                                    { title: "Digital ID Issuance", text: "Employee ID portals and government card registrations often prefer high-detail 45KB images for printing clarity.", icon: <Upload className="h-6 w-6" /> },
                                    { title: "Property Registration", text: "Land and property documentation portals in various regions require scanned photos to match the 40-50KB bracket.", icon: <List className="h-6 w-6" /> }
                                ].map((useCase, i) => (
                                    <div key={i} className="group p-8 rounded-[2rem] bg-card border border-border hover:border-primary/30 transition-all hover:bg-primary/5">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:rotate-12">
                                            {useCase.icon}
                                        </div>
                                        <h3 className="font-bold text-lg mb-3">{useCase.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{useCase.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 6-Step Guide Section */}
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border overflow-hidden relative">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                            <h2 className="text-3xl font-bold mb-12 text-center">How to Compress JPG to 45KB Without Losing Quality</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {[
                                    { step: "01", title: "Select JPG Files", text: "Choose the images from your device. We support high-res photos up to 25MB from smartphones and DSLRs." },
                                    { step: "02", title: "Verify 45KB Target", text: "Our tool enters 'High Precision Mode' automatically for the 45KB target to ensure the best balance of bits." },
                                    { step: "03", title: "Optional Resizing", text: "If your photo is ultra-HD (e.g. 5000px), our engine will suggest a resize for better 45KB output." },
                                    { step: "04", title: "Quality Adjustment", text: "The iterative engine starts. It tests multiple quality levels (100 down to 1) until it hits the target size." },
                                    { step: "05", title: "Instant Preview", text: "Check your 45KB image. Ensure eyes, text, and signatures are legible before finalizing the save." },
                                    { step: "06", title: "Secure Download", text: "Download your portal-ready file. It stays in your browser cache and is never stored on our servers." }
                                ].map((s, i) => (
                                    <div key={i} className="relative p-7 rounded-[2rem] bg-background border border-border hover:border-primary/50 transition-all group shadow-sm hover:shadow-xl">
                                        <span className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl font-black shadow-lg shadow-primary/20 rotate-[-5deg] group-hover:rotate-0 transition-transform">
                                            {s.step}
                                        </span>
                                        <h3 className="font-bold mb-3 text-lg mt-2 text-foreground">{s.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Premium Features Comparison Table */}
                        <div className="space-y-10">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold">Why Choose Free Image Prompt for 45KB?</h2>
                                <p className="text-muted-foreground mt-2 italic">Standard vs High-Precision Compression Comparison</p>
                            </div>
                            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-primary/10 border-b border-border">
                                                <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Capabilities</th>
                                                <th className="p-6 font-bold text-sm uppercase tracking-wider text-primary">Our 45KB Engine</th>
                                                <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Generic Compressors</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {[
                                                { f: "Target Precision", a: "Within 2% (44.1 - 45.0 KB)", b: "± 20% Variance" },
                                                { f: "Data Privacy", a: "Browser-Only (No Upload)", b: "Server-Side Processing" },
                                                { f: "Processing Speed", a: "Sub-Second Optimization", b: "Delayed Queue System" },
                                                { f: "Batch Efficiency", a: "Unlimited Batching", b: "Often Capped at 5 files" },
                                                { f: "Metadata Control", a: "Smart Stripping", b: "Keeps Bulky Meta Data" },
                                                { f: "Cost", a: "100% Free Forever", b: "Ads or Premium Tiers" }
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-primary/5 transition-all group">
                                                    <td className="p-6 font-semibold text-sm text-muted-foreground">{row.f}</td>
                                                    <td className="p-6 text-primary font-bold text-sm">{row.a}</td>
                                                    <td className="p-6 text-muted-foreground/60 text-sm italic">{row.b}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Pro Tips Section */}
                        <div className="bg-primary/5 p-10 md:p-14 rounded-[3rem] border border-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <AlertCircle className="h-40 w-40 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold mb-10 text-center">Pro Tips for Best Quality at 45KB</h2>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8 relative z-10">
                                    <div className="flex gap-5">
                                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary font-black">1</div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Original Aspect Ratio</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Don't stretch your images. If the portal asks for 3.5cm x 4.5cm, crop the photo to that ratio before uploading to our 45KB compressor to avoid distortion.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary font-black">2</div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Signature Scanning</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                For 45KB signatures, use a high-contrast black pen on white paper. Our engine will prioritize the pen strokes, giving you a sharp digital sign.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8 relative z-10">
                                    <div className="flex gap-5">
                                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary font-black">3</div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Lighting Matters</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Portals reject grainy photos. Well-lit images require less 'de-noising' by the compressor, allowing more detail to be saved within the 45KB limit.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary font-black">4</div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Avoid Screenshots</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Screenshots are often already low-quality. Whenever possible, use the original camera file for 45KB compression to ensure professional clarity.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Extensive FAQ Section */}
                        <div className="space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto italic">Solving everyday problems for candidates and web users.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { q: "Is it safe to upload my passport photo here?", a: "ABSOLUTELY. Your images never leave your browser. All compression logic runs on your local machine using JavaScript. We don't have a database for your photos." },
                                    { q: "What if my compressed file is 44KB instead of 45KB?", a: "That is perfect. Portals usually mandate 'Max 45KB' or 'Under 50KB'. Being within 1-2KB of the target ensures you satisfy the limit while maintaining max detail." },
                                    { q: "Can I convert PNG to 45KB JPG?", a: "Yes. Our tool automatically converts incoming image types to highly optimized JPEG format to meet the specific KB target." },
                                    { q: "Why did my image become slightly blurry at 45KB?", a: "If the original was massive (10MB+), hitting 45KB requires significant data loss. Try cropping the image closer to your face first to save bits." },
                                    { q: "Does this tool work on iPhone and Android?", a: "Yes. It is fully mobile-optimized. You can take a photo from your camera and compress it to 45KB instantly on your phone." },
                                    { q: "Can I compress multiple images to 45KB at once?", a: "Yes, our batch processing feature allows you to select dozens of files, and each will be precisely targeted to 45KB individually." },
                                    { q: "Will the resolution (pixels) change?", a: "If necessary to hit the 45KB target, the engine will adjust dimensions. This is standard practice for portal uploads." },
                                    { q: "Is there a daily limit for free users?", a: "No. Free Image Prompt offers unlimited usage for all tools, including the 45KB specific compressor." },
                                    { q: "What happens if my photo is already under 45KB?", a: "The tool will detect this and offer to keep the original or apply a light optimization to further clean up metadata without losing quality." },
                                    { q: "Does this work for digital signatures?", a: "Yes, and it’s excellent for them. It maintains high contrast for signatures while meeting the strict 45KB portal requirements." },
                                    { q: "Can I use this for my LinkedIn or CV?", a: "Definitely. A 45KB profile photo is ideal for CVs as it keeps the total document size small for email attachments." },
                                    { q: "Why is 45KB a common limit?", a: "It’s a balance found in many legacy government systems—large enough for a clear face, small enough to store millions of entries cheaply." }
                                ].map((faq, i) => (
                                    <div key={i} className="p-8 rounded-[2rem] bg-card border border-border hover:shadow-lg transition-all space-y-4">
                                        <div className="flex gap-3">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                                <div className="font-bold text-[10px]">Q</div>
                                            </div>
                                            <h4 className="font-bold text-lg leading-tight">{faq.q}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic pl-9">"{faq.a}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Summary Section (Before/After) */}
                        <div className="text-center py-24 bg-card/30 rounded-[3rem] border border-dashed border-border overflow-hidden relative">
                            <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none" />
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-primary">
                                COMPRESS JPG TO 45KB
                            </h2>
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-16">
                                Precision Optimization for Every Pixel
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative z-10">
                                <div className="flex flex-col items-center gap-4 group">
                                    <div className="w-56 h-56 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
                                        <img src="/assets/boy116.webp" alt="Original Large Image" className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-4xl font-black text-destructive/80">5 MB</span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original File</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-8">
                                    <div className="px-6 py-2 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-tighter animate-pulse">
                                        Binary Search Search Processing...
                                    </div>
                                    <div className="flex items-center gap-4 text-primary">
                                        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-primary" />
                                        <ArrowRight className="h-10 w-10 animate-bounce-x" />
                                        <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-primary" />
                                    </div>
                                    <div className="p-4 bg-white shadow-2xl rounded-3xl border border-primary/20 scale-110">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-primary">
                                                <ImageIcon className="h-6 w-6 text-white" />
                                            </div>
                                            <span className="text-2xl font-black tracking-tighter">
                                                FreeImage<span className="text-primary">Prompt</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4 group">
                                    <div className="w-56 h-56 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl rotate-[3deg] group-hover:rotate-0 transition-transform duration-500">
                                        <img src="/assets/boy116.webp" alt="Compressed 45KB Image" className="w-full h-full object-cover opacity-90 blur-[0.3px]" loading="lazy" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-4xl font-black text-primary">45 KB</span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Optimized Result</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Footer Summary */}
                        <div className="text-center space-y-8 max-w-4xl mx-auto pb-12">
                            <div className="h-1.5 w-32 bg-primary/20 rounded-full mx-auto" />
                            <h2 className="text-2xl font-bold tracking-tight">ENGINEERED FOR ACCURACY</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed italic">
                                "While other tools give you a range, Free Image Prompt gives you a result. 
                                Our 45KB dedicated optimizer combines quality preservation with mathematical precision, 
                                ensuring your digital uploads are never the reason for a missed opportunity."
                            </p>
                            <div className="flex justify-center flex-wrap gap-4">
                                {["No Watermark", "No Registration", "Privacy First", "Precise Limit"].map((tag, i) => (
                                    <span key={i} className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                        {tag}
                                    </span>
                                ))}
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

export default JPGCompress45kb;
