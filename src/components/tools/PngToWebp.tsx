import { useState } from "react";
import { Image as ImageIcon, Upload, Download, FileJson, CheckCircle2, AlertCircle, Trash2, ArrowRight, X, Layers, List, Replace } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import OtherCompressionSizes from "@/components/OtherCompressionSizes";
import OtherConverters from "@/components/OtherConverters";

interface ConvertedResult {
    id: string;
    originalName: string;
    originalSize: number;
    convertedSize: number;
    convertedFile: File;
    previewUrl: string;
    status: "converting" | "completed" | "error";
    error?: string;
    progress: number;
}

const PngToWebp = () => {
    const [results, setResults] = useState<ConvertedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    const pageTitle = "Convert PNG to WebP Free | Fast & No Quality Loss";
    const metaDescription = "Convert PNG to WebP online free without losing quality. Fast, secure, no signup needed. Optimize images for speed & SEO instantly.";
    const h1Title = "Convert PNG to WebP (Free, Fast & Without Losing Quality)";
    const subTitle = "Struggling with image rejected, file too large, or frustrating upload errors when submitting forms or optimizing your website? You’re not alone. Many platforms today require lighter, faster-loading images—and that’s exactly where you need to convert PNG to WebP.";

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
        const validFiles = newFiles.filter(file => file.type.match(/image\/png/));

        if (validFiles.length < newFiles.length) {
            toast.error(`${newFiles.length - validFiles.length} file(s) skipped (not PNG).`);
        }

        if (validFiles.length === 0) return;

        setIsOverallProcessing(true);

        const initialResults: ConvertedResult[] = validFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            originalName: file.name,
            originalSize: file.size,
            convertedSize: 0,
            convertedFile: file as File, // placeholder
            previewUrl: "",
            status: "converting",
            progress: 10,
        }));

        setResults(prev => [...prev, ...initialResults]);

        // Process each file via Canvas API
        for (const item of initialResults) {
            const fileToProcess = validFiles.find(f => f.name === item.originalName);
            if (!fileToProcess) continue;

            const objectUrl = URL.createObjectURL(fileToProcess);
            const img = new Image();

            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");

                    if (!ctx) throw new Error("Could not get canvas context");

                    // Clear canvas for transparency
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFileName = item.originalName.replace(/\.[^/.]+$/, "") + ".webp";
                            const convertedFile = new File([blob], newFileName, { type: "image/webp" });
                            const previewUrl = URL.createObjectURL(blob);

                            setResults(prev => prev.map(r => r.id === item.id ? {
                                ...r,
                                convertedSize: blob.size,
                                convertedFile,
                                previewUrl,
                                status: "completed",
                                progress: 100,
                            } : r));
                        } else {
                            throw new Error("Canvas blob creation failed");
                        }
                    }, "image/webp", 0.8); // 80% quality for good balance
                } catch (err: any) {
                    setResults(prev => prev.map(r => r.id === item.id ? {
                        ...r,
                        status: "error",
                        error: err.message || "Conversion failed"
                    } : r));
                    toast.error(`Failed: ${item.originalName}`);
                } finally {
                    URL.revokeObjectURL(objectUrl);
                }
            };

            img.onerror = () => {
                setResults(prev => prev.map(r => r.id === item.id ? {
                    ...r,
                    status: "error",
                    error: "Failed to load image"
                } : r));
                toast.error(`Failed to load: ${item.originalName}`);
                URL.revokeObjectURL(objectUrl);
            };

            img.src = objectUrl;
        }

        setIsOverallProcessing(false);
        toast.success("Batch conversion complete!");
    };

    const downloadImage = (result: ConvertedResult) => {
        const link = document.createElement("a");
        link.href = result.previewUrl;
        link.download = result.originalName.replace(/\.[^/.]+$/, "") + ".webp";
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
                            <Replace className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
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
                                    Drop your PNG images here
                                </p>
                                <p className="text-muted-foreground font-medium flex items-center gap-2">
                                    <List className="h-4 w-4" />
                                    Supports secure local batch conversion
                                </p>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".png,image/png"
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
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Output File</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Size</th>
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
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-muted/30" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs">{result.originalName.replace(/\.png$/i, ".webp")}</p>
                                                    </td>
                                                    <td className="p-5 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-primary">{formatSize(result.convertedSize)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground italic">Converting...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-5">
                                                        {result.status === "converting" && (
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
                                                        {result.status === "completed" && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => downloadImage(result)}
                                                                className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                                title="Download Image"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => removeResult(result.id)}
                                                            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

                    <div className="mt-20 grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">100% Free & Unlimited</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                No credit cards, no hidden limits, and absolutely no watermarks ever applied to your converted images.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">Browser Privacy</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                We utilize HTML5 Canvas to convert images entirely within your browser offline. They never hit our servers.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">Lightning Fast</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Drag, drop, and convert hundreds of PNG photos into optimized WebP format almost instantly with batch processing.
                            </p>
                        </div>
                    </div>

                    <section className="mt-20 space-y-24">
                        {/* Intro Section */}
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-6">What is PNG to WebP Conversion?</h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed">
                                    PNG to WebP conversion means changing your image format from PNG (Portable Network Graphics) to WebP, a modern format developed by Google.
                                </p>
                                <div className="mt-8 overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="p-4 border border-border text-left">Feature</th>
                                                <th className="p-4 border border-border text-left">PNG</th>
                                                <th className="p-4 border border-border text-left">WebP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-4 border border-border">File Size</td>
                                                <td className="p-4 border border-border text-red-500">Large</td>
                                                <td className="p-4 border border-border text-green-500 font-bold">Much smaller</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-border">Quality</td>
                                                <td className="p-4 border border-border">High</td>
                                                <td className="p-4 border border-border font-bold">High (optimized)</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-border">Transparency</td>
                                                <td className="p-4 border border-border">Supported</td>
                                                <td className="p-4 border border-border">Supported</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-border">Compression</td>
                                                <td className="p-4 border border-border">Lossless</td>
                                                <td className="p-4 border border-border font-bold">Lossy + Lossless</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-border">Web Performance</td>
                                                <td className="p-4 border border-border text-red-500">Slower</td>
                                                <td className="p-4 border border-border text-green-500 font-bold">Faster</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-6 text-muted-foreground italic">
                                    WebP is widely supported across modern browsers and is recommended by developers for website optimization and improving Core Web Vitals.
                                </p>
                            </div>
                        </div>

                        {/* Why You Need Section */}
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-4">Why You Need to Convert PNG to WebP</h2>
                                <p className="text-muted-foreground">Converting images isn’t just technical—it solves real problems.</p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: "Website Speed Optimization", desc: "Heavy PNG files slow down websites. WebP images load faster, improving SEO rankings and user experience." },
                                    { title: "Job Portals & Applications", desc: "Many job sites reject large files. Converting PNG to WebP ensures smooth uploads." },
                                    { title: "Government & KYC Forms", desc: "Passport uploads or ID verification often fail due to size limits. WebP helps you meet requirements easily." },
                                    { title: "Blogging & Content Creation", desc: "Faster-loading images improve engagement and reduce bounce rate." },
                                    { title: "E-commerce & Portfolios", desc: "Optimized images mean faster browsing and better conversions." }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                                        <div className="text-primary font-bold mb-2">0{i + 1}. {item.title}</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How to Convert Section */}
                        <div className="bg-primary/5 p-8 md:p-12 rounded-[2.5rem] border border-primary/10">
                            <h2 className="text-3xl font-bold mb-8 text-center">How to Convert PNG to WebP (Step-by-Step Guide)</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { step: "1", title: "Upload Your PNG Image", desc: "Select your file from your device." },
                                    { step: "2", title: "Click Convert", desc: "Our tool instantly processes your image." },
                                    { step: "3", title: "Download WebP File", desc: "Save the optimized image in seconds." }
                                ].map((item, i) => (
                                    <div key={i} className="relative p-6 rounded-2xl bg-card border border-border text-center">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                            {item.step}
                                        </div>
                                        <h3 className="font-bold mb-2 mt-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features & Benefits */}
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <CheckCircle2 className="text-primary h-6 w-6" />
                                    Features of Our PNG to WebP Converter
                                </h2>
                                <ul className="space-y-3">
                                    {["Free unlimited conversions", "No login required", "Fast processing", "Supports transparency", "Bulk conversion supported", "Secure & private"].map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Layers className="text-primary h-6 w-6" />
                                    Benefits of Converting PNG to WebP
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { title: "Smaller File Size", desc: "Reduce image size by up to 80% without noticeable loss." },
                                        { title: "Faster Website Speed", desc: "Improves loading times and boosts performance." },
                                        { title: "Better SEO Rankings", desc: "Search engines reward faster websites." }
                                    ].map((b, i) => (
                                        <div key={i}>
                                            <div className="font-bold text-sm">{b.title}</div>
                                            <p className="text-sm text-muted-foreground">{b.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Without Quality Loss */}
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12">
                            <h2 className="text-3xl font-bold mb-6">Convert PNG to WebP Without Losing Quality</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>One of the most common concerns is quality loss. Modern tools ensure that:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Image clarity remains intact</li>
                                        <li>Transparency is preserved</li>
                                        <li>Colors stay accurate</li>
                                    </ul>
                                    <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                                        <div className="font-bold text-foreground mb-2">This is especially important for:</div>
                                        <ul className="text-sm space-y-1">
                                            <li>• Logos</li>
                                            <li>• UI elements</li>
                                            <li>• Passport photos</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <h3 className="font-bold mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            How to convert without loss
                                        </h3>
                                        <ul className="text-sm space-y-2 text-muted-foreground">
                                            <li>• Use lossless WebP conversion</li>
                                            <li>• Avoid over-compression</li>
                                            <li>• Choose high-quality settings</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bulk Conversion */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center">Bulk Convert PNG to WebP (Batch Processing)</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { title: "Photoshop", desc: "Use export settings to convert multiple files" },
                                    { title: "FFmpeg", desc: "Command-line tool: ffmpeg -i input.png output.webp" },
                                    { title: "ImageMagick", desc: "magick mogrify -format webp *.png" },
                                    { title: "Python", desc: "Automate with scripts using Pillow library" }
                                ].map((m, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-border bg-card">
                                        <div className="font-bold text-sm mb-1">{m.title}</div>
                                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-muted/30 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl font-bold mb-8 text-center">Comparison Table (Your Tool vs Others)</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead className="bg-background">
                                        <tr>
                                            <th className="p-4 border border-border text-left">Feature</th>
                                            <th className="p-4 border border-border text-center">Our Tool</th>
                                            <th className="p-4 border border-border text-center">Others</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { f: "Free", us: "✅", them: "❌" },
                                            { f: "No login", us: "✅", them: "❌" },
                                            { f: "Bulk convert", us: "✅", them: "⚠️" },
                                            { f: "Speed", us: "Fast", them: "Slow" }
                                        ].map((r, i) => (
                                            <tr key={i} className="bg-background/50">
                                                <td className="p-4 border border-border">{r.f}</td>
                                                <td className="p-4 border border-border text-center font-bold text-green-500">{r.us}</td>
                                                <td className="p-4 border border-border text-center">{r.them}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pro Tips & Mistakes */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2rem] bg-green-500/5 border border-green-500/10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="text-green-500 h-6 w-6" />
                                    Pro Tips for Best Results
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Use WebP for all website images",
                                        "Optimize images before uploading",
                                        "Keep a backup of original PNG files",
                                        "Use a CDN for faster delivery",
                                        "Test images across devices"
                                    ].map((tip, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-muted-foreground font-medium">
                                            <span className="text-green-500">✅</span> {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <AlertCircle className="text-red-500 h-6 w-6" />
                                    Common Mistakes to Avoid
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Uploading very large PNG files without compression",
                                        "Losing transparency during conversion",
                                        "Using low-quality converters",
                                        "Ignoring image preview before download",
                                        "Over-compressing images"
                                    ].map((m, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-muted-foreground font-medium">
                                            <span className="text-red-500">❌</span> {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center">People Also Ask (FAQs)</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { q: "How to convert png to webp online free unlimited?", a: "You can use an online converter that offers unlimited conversions without signup. Simply upload your PNG, click convert, and download your WebP file." },
                                    { q: "Can I convert png to webp without losing quality?", a: "Yes, by using lossless compression and high-quality settings, you can convert PNG to WebP without noticeable quality loss." },
                                    { q: "How to convert png to webp in Photoshop?", a: "Open your image → Click “Save As” or “Export” → Choose WebP format → Adjust quality → Save." },
                                    { q: "Is WebP better than PNG?", a: "For web use, yes. WebP provides smaller file sizes and faster loading while maintaining quality." },
                                    { q: "How to batch convert png to webp?", a: "Use tools like FFmpeg, ImageMagick, or Python scripts to convert multiple images at once." }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                                        <h3 className="font-bold mb-3">{item.q}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Schema.org JSON-LD */}
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "FAQPage",
                                    "mainEntity": [
                                        {
                                            "@type": "Question",
                                            "name": "How to convert png to webp online free unlimited?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "Use an online PNG to WebP converter that allows unlimited conversions. Upload your image, convert, and download instantly."
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": "Can I convert png to webp without losing quality?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "Yes, using lossless compression ensures high-quality WebP images without noticeable loss."
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": "How to convert png to webp in Photoshop?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "Open your PNG in Photoshop, go to Export, choose WebP format, adjust quality, and save."
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": "Is WebP better than PNG?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "WebP is better for web use because it offers smaller file sizes and faster loading speeds."
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": "How to batch convert png to webp?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "You can use FFmpeg, ImageMagick, or Python scripts to batch convert PNG images to WebP."
                                            }
                                        }
                                    ]
                                })
                            }}
                        />
                    </section>
                    
                    <OtherConverters />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PngToWebp;
