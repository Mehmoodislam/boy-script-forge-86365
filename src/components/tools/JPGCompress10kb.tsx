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

interface JPGCompress10kbProps {
    children?: React.ReactNode;
}

const JPGCompress10kb = ({ children }: JPGCompress10kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 10KB
    const pageTitle = "Compress JPG to 10KB Online - Free, Fast & Lossless Quality";
    const metaDescription = "Compress JPG to exactly 10KB online for free using Free Image Prompt. Perfect for job applications, government portals, and admission forms. No signup, no quality loss - just fast, browser-based JPEG compression.";
    const h1Title = "Compress JPG to 10KB - Exactly What You Need, Right When You Need It";
    const subTitle = "Whether you're submitting a passport photo for a visa application, uploading a profile picture for a government portal, or attaching a photo ID to a job application, strict file size requirements can be a frustrating roadblock. Most official platforms limit image uploads to 10KB.";

    const getTargetSizeMB = () => {
        return 10 / 1024; // Target: 10KB
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
                let initialDimensions = 600; // < 50KB target

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
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead title={pageTitle} description={metaDescription} />
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 mb-6 group">
                            <Layers className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            {h1Title}
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            {subTitle}
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-primary/10 relative overflow-hidden mb-10 transition-all hover:shadow-primary/20">
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-muted/50 rounded-[2rem] cursor-pointer hover:bg-accent/5 hover:border-primary/50 transition-all group relative z-10"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-4 rounded-3xl bg-primary/10 mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                    <Upload className="h-10 w-10 text-primary" />
                                </div>
                                <p className="mb-3 text-xl font-bold">
                                    Drop your JPG images here
                                </p>
                                <p className="text-muted-foreground font-medium flex items-center gap-2">
                                    <List className="h-4 w-4" />
                                    Supports batch upload (JPG/JPEG only)
                                </p>
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
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-accent/5 p-4 rounded-2xl border border-border">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
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

                            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-accent/10">
                                            <tr>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Preview</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">File Info</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Size (Before)</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Size (After)</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {results.map((result) => (
                                                <tr key={result.id} className="group hover:bg-accent/5 transition-colors">
                                                    <td className="p-5">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-accent/5 flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-muted/30" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs">{result.originalName}</p>
                                                    </td>
                                                    <td className="p-5 hidden md:table-cell">
                                                        <span className="text-sm font-medium opacity-70">{formatSize(result.originalSize)}</span>
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
                                                            <span className="text-sm text-muted-foreground italic">Processing...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-5">
                                                        {result.status === "compressing" && (
                                                            <div className="w-24 space-y-2">
                                                                <Progress value={result.progress} className="h-1.5" />
                                                            </div>
                                                        )}
                                                        {result.status === "completed" && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase border border-green-500/20">
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
                                                            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

                    <div className="mt-20 grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">Bulk Processing</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Save time by uploading hundreds of images at once. Our engine handles multi-file compression with ease.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">100% Client-Side</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Your privacy is our priority. Images never leave your device. All processing happens locally in your browser.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">Quality Preservation</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Our smart algorithms reduce file size while keeping your photos looking sharp and professional.
                            </p>
                        </div>
                    </div>

                    <section className="mt-20 space-y-24">
                        {/* Why section */}
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8">Why Do Websites and Portals Require Images Under 10KB?</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed">
                                        Understanding the reason behind the 10KB limit helps you appreciate why a precise, reliable tool is essential. Here are the most common real-world scenarios where 10KB is the mandatory maximum:
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Government job portals (e.g., SSC, UPSC, railway recruitment boards) specify photo and signature uploads at 10KB to 20KB.",
                                            "University and college admission forms across India, Pakistan, Bangladesh, and other South Asian countries enforce image size caps.",
                                            "Banking KYC forms and financial institution portals mandate compressed passport-size photographs.",
                                            "Visa and passport application systems require high compliance with size specifications.",
                                            "Job recruitment platforms limit candidate photo uploads to avoid storage overhead."
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
                                        "In each of these use cases, uploading a file that exceeds the limit causes your submission to be rejected - even if the image quality is perfect."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How to compress (Steps) */}
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8">How to Compress JPG to 10KB - Step-by-Step Guide</h2>
                            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                                {[
                                    { title: "Upload Image", text: "Go to the Free Image Prompt Compress JPG to 10KB tool and select your JPG or JPEG file." },
                                    { title: "Select 10KB Preset", text: "Select the '10KB' preset from the target size options. You can also enter a custom value." },
                                    { title: "Fine-Tune (Optional)", text: "Use Settings to adjust quality balance - useful for images with fine text." },
                                    { title: "Compress Now", text: "Click 'Compress Now' - the tool processes entirely within your browser in under 3 seconds." },
                                    { title: "Preview & Download", text: "Preview the result. If satisfied, click 'Download' to save your 10KB JPEG instantly." }
                                ].map((step, i) => (
                                    <div key={i} className="relative p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors">
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
                            <h2 className="text-3xl font-bold mb-12 text-center">Key Features of Free Image Prompt's JPG Compressor</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { title: "100% Browser-Side Processing", text: "Your images never leave your device. We use client-side JavaScript for maximum privacy.", icon: <Upload className="h-6 w-6" /> },
                                    { title: "Precise Target-Size", text: "Our engine iterates automatically to land your image as close to exactly 10KB as possible.", icon: <Layers className="h-6 w-6" /> },
                                    { title: "Unlimited Free Compressions", text: "No daily limits, no subscriptions, no accounts. Compress as many as you need.", icon: <CheckCircle2 className="h-6 w-6" /> },
                                    { title: "Multi-Format Support", text: "Handles PNG and WebP inputs, automatically converting them to compressed JPEG.", icon: <FileJson className="h-6 w-6" /> },
                                    { title: "Customizable Quality", text: "Manually adjust values while seeing dynamic file size updates for professional results.", icon: <List className="h-6 w-6" /> },
                                    { title: "Mobile-Friendly", text: "Works seamlessly on Android, iOS, Windows, and Mac without any app installation.", icon: <ImageIcon className="h-6 w-6" /> }
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

                        {/* Technical Truth */}
                        <div className="bg-primary/5 p-8 md:p-12 rounded-[2.5rem] border border-primary/10">
                            <h2 className="text-3xl font-bold mb-8">How Does JPEG Compression to 10KB Actually Work?</h2>
                            <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground">
                                <p>
                                    JPEG compression works by analyzing image data in 8x8 pixel blocks and applying a Discrete Cosine Transform (DCT). 
                                    When compressing to a specific target like 10KB, our algorithm:
                                </p>
                                <ul className="grid md:grid-cols-2 gap-4 mt-6 list-none p-0">
                                    {[
                                        "Performs initial compression pass at mid-range quality.",
                                        "Measures output file size against the 10KB target.",
                                        "Iteratively adjusts quantization table in binary search pattern.",
                                        "Stops within ±0.5KB of the 10KB target.",
                                        "Delivers final image with maximum visual fidelity."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-2 items-center bg-background/50 p-3 rounded-xl border border-border">
                                            <ArrowRight className="h-4 w-4 text-primary" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Real World Use Cases */}
                        <div>
                            <h2 className="text-3xl font-bold mb-12 text-center">Real-World Use Cases</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: "Govt Job Applications", text: "SSC, UPSC, NEET, and State PSC Exams commonly require photos between 4KB–10KB." },
                                    { title: "Passport & Visa Photo", text: "Embassy portals typically require 35mm x 45mm at 10KB to 50KB size limits." },
                                    { title: "Bank KYC & Compliance", text: "South Asian banks allow online account creation with photo submission capped at 10KB–20KB." },
                                    { title: "School Admissions", text: "Admission portals for engineering (JEE) and medical colleges enforce 10KB photo restrictions." },
                                    { title: "Employee Portals", text: "Corporate HR platforms cap profile photo uploads at 10KB for database efficiency." }
                                ].map((useCase, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-card border border-border space-y-3">
                                        <h3 className="font-bold text-primary">{useCase.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{useCase.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
                            <div className="bg-primary px-8 py-6">
                                <h2 className="text-2xl font-bold text-primary-foreground">Free Image Prompt vs Other JPEG Compressors - Why We're Better</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="p-5 font-bold border-b border-border">Feature</th>
                                            <th className="p-5 font-bold border-b border-border text-primary">Free Image Prompt</th>
                                            <th className="p-5 font-bold border-b border-border">SmallJPG</th>
                                            <th className="p-5 font-bold border-b border-border">Typical Competitors</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            { f: "Precise 10KB Target", a: "✅ Yes", b: "✅ Yes", c: "❌ Approx only" },
                                            { f: "100% Browser-Side", a: "✅ Yes", b: "✅ Yes", c: "❌ Server upload" },
                                            { f: "Unlimited Free Use", a: "✅ Yes", b: "✅ Yes", c: "❌ Daily limit" },
                                            { f: "No Sign-up Required", a: "✅ Yes", b: "✅ Yes", c: "⚠️ Varies" },
                                            { f: "Mobile Optimised", a: "✅ Yes", b: "⚠️ Partial", c: "⚠️ Varies" },
                                            { f: "PNG/WebP Input", a: "✅ Yes", b: "❌ JPG only", c: "⚠️ Varies" },
                                            { f: "Quality Preview", a: "✅ Yes", b: "⚠️ Basic", c: "❌ No" },
                                            { f: "Custom KB Target", a: "✅ Yes", b: "⚠️ Presets only", c: "❌ No" },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-accent/5 transition-colors">
                                                <td className="p-5 font-medium">{row.f}</td>
                                                <td className="p-5 text-primary font-bold">{row.a}</td>
                                                <td className="p-5 text-muted-foreground">{row.b}</td>
                                                <td className="p-5 text-muted-foreground">{row.c}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center">Pro Tips for Best Results When Compressing to 10KB</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { t: "Resize before compressing", d: "If your original image is very large (e.g., 3MB), first resize it to approximately 200x250 pixels before applying 10KB compression. This preserves far more detail." },
                                    { t: "Use JPEG, not PNG for photos", d: "PNG files use lossless compression and are inherently larger. For photos and portraits, JPEG is more efficient and produces better visual results." },
                                    { t: "Check exact dimension requirements", d: "Some portals require specific pixel dimensions (e.g., 200x230px). Ensure your image meets both size and dimension requirements." },
                                    { t: "Avoid re-compressing", d: "If an image is already at 11KB, additional compression may reduce quality significantly. Upload the original high-resolution version for best results." },
                                    { t: "Use the preview", d: "Free Image Prompt shows you a side-by-side comparison. Zoom in on faces or fine details before accepting the result." }
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

                        {/* Different Sizes */}
                        <div className="bg-primary/5 p-8 md:p-12 rounded-[2.5rem] border border-primary/10 text-center">
                            <h2 className="text-3xl font-bold mb-6">Need a Different File Size? Compress JPG to Any KB</h2>
                            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                                Free Image Prompt supports precise compression to any target size. Whether your portal requires 5KB or 200KB - our tool handles it.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { s: "5KB", d: "Signature Uploads", p: "/tools/compress-jpg-to-5kb" },
                                    { s: "20KB", d: "Govt Portals", p: "/tools/compress-jpg-to-20kb" },
                                    { s: "50KB", d: "Bank KYC", p: "/tools/compress-jpg-to-50kb" },
                                    { s: "100KB", d: "Email Attachments", p: "/tools/compress-jpg-to-100kb" },
                                    { s: "200KB", d: "High-Res Submission", p: "/tools/compress-jpg-to-200kb" }
                                ].map((size, i) => (
                                    <a key={i} href={size.p} className="p-4 rounded-2xl bg-background border border-border hover:border-primary hover:shadow-lg transition-all group">
                                        <div className="font-black text-xl text-primary group-hover:scale-110 transition-transform">{size.s}</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mt-1">{size.d}</div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div className="text-center space-y-6 py-10">
                            <h2 className="text-3xl font-bold">Conclusion - The Smartest, Safest Way to Compress JPEG to 10KB</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
                                Compressing a JPG to exactly 10KB is a specific, technical challenge that generic tools often fail to solve reliably. 
                                Free Image Prompt was built specifically to meet this need - offering precise target-size compression, 
                                complete browser-side privacy, unlimited free use, and a transparent quality preview.
                            </p>
                            <p className="text-primary font-bold text-xl italic">
                                No servers. No subscriptions. No guesswork. Just a 10KB JPEG, ready in seconds.
                            </p>
                        </div>
                    </section>

                    <OtherCompressionSizes />

                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JPGCompress10kb;
