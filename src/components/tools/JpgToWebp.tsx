import { useState } from "react";
import { Link } from "react-router-dom";
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

const JpgToWebp = () => {
    const [results, setResults] = useState<ConvertedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    const pageTitle = "JPG to WebP Converter Free Online – Fast & High Quality";
    const metaDescription = "Convert JPG to WebP online free. Fast, secure, high-quality converter with bulk support. No signup required.";
    const h1Title = "JPG to WebP Converter – Free, Fast & High-Quality Online Tool";
    const subTitle = "Are your images getting rejected during uploads? Or are your website pages loading slowly because of heavy JPG files? You’re not alone. Many students, designers, and developers face this issue daily.";

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How to convert JPG to WebP high quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload your JPG file, and our tool automatically converts it to WebP while maintaining quality. No manual adjustments needed."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a jpg to webp converter without losing quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our tool is optimized to convert jpg to webp without losing quality by using advanced compression algorithms."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert JPG to WebP on mobile?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. This is a mobile-friendly JPG to WebP converter that works perfectly on all smartphones."
                }
            },
            {
                "@type": "Question",
                "name": "What is the best jpg to webp converter online free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A tool that is fast, secure, and doesn't require registration — like Free Image Prompt — is considered the best choice."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert JPG to WebP in one click?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our converter is designed for one-click efficiency. Just upload and download."
                }
            },
            {
                "@type": "Question",
                "name": "How do I convert JPG to WebP using Canva or online tool?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While Canva offers a download option, specialized online tools like ours are much faster for direct format conversion."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a jpg to webp converter download option?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No download is needed. This converter works entirely in your browser, keeping your device clean."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert image jpg to webp instantly?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, conversion happens in real-time, delivering your WebP image in seconds."
                }
            }
        ]
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

                    // WebP supports transparency, but source is JPG (which is flat white).
                    ctx.drawImage(img, 0, 0);

                    // Check if browser supports WebP conversion
                    const isWebpSupported = canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
                    
                    if (!isWebpSupported) {
                        toast.error("Your browser does not support WebP conversion. Please try Chrome, Firefox or Edge.");
                        throw new Error("WebP not supported by browser");
                    }

                    // Output to WebP format at 90% quality for optimal size savings
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
                    }, "image/webp", 0.9); // 90% quality mapping
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
        toast.success("Batch webp conversion complete!");
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
        <div className="min-h-screen bg-background text-foreground text-left">
            <SEOHead title={pageTitle} description={metaDescription} schema={faqSchema} />
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
                                    Drop your JPG images here
                                </p>
                                <p className="text-muted-foreground font-medium flex items-center gap-2">
                                    <List className="h-4 w-4" />
                                    Instantly converts to WebP formats
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
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Old Size</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">WebP Size</th>
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
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs">{result.originalName.replace(/\.jpe?g$/i, ".webp")}</p>
                                                    </td>
                                                    <td className="p-5 hidden md:table-cell">
                                                        <span className="text-sm font-medium opacity-70">{formatSize(result.originalSize)}</span>
                                                    </td>
                                                    <td className="p-5 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-primary">{formatSize(result.convertedSize)}</span>
                                                                <span className="text-[10px] font-bold text-green-500 uppercase">
                                                                    Saved {Math.round(((result.originalSize - result.convertedSize) / result.originalSize) * 100)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground italic">Processing...</span>
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
                            <h3 className="text-xl font-bold">Massive Space Savings</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                WebP images are significantly smaller than their JPG equivalents with equivalent visual quality. Stop wasting storage space and bandwidth.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">Browser Privacy</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Our client-side code converts your personal photos securely. Absolutely no images are uploaded to any third-party servers.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-card border border-border shadow-lg space-y-4">
                            <h3 className="text-xl font-bold">Zero Watermarks</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Get your output WebP files instantly, completely free of any obnoxious logos or watermarks overlaid on your images.
                            </p>
                        </div>
                    </div>

                    <section className="mt-20 space-y-24">
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <div className="prose prose-invert max-w-none text-left">
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    With our jpg to webp converter, you can convert JPG to WebP online free in seconds-without losing quality. Whether you're uploading images for job portals, government forms, or optimizing your website, this tool makes the process smooth and hassle-free.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">What is a JPG to WebP Converter?</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    A JPG to WebP converter online is a tool that changes image format from JPG (or JPEG) to WebP-a modern format developed for better compression and faster loading.
                                </p>
                                <p className="text-muted-foreground mb-4">WebP images are:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Smaller in file size</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> High in quality</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Ideal for websites and apps</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    In simple terms, it helps you convert image JPG to WebP instantly while keeping your visuals sharp.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">Why You Need a JPG to WebP Converter</h2>
                                <h3 className="text-xl font-bold mb-4">Real-Life Use Cases</h3>
                                <div className="grid md:grid-cols-2 gap-6 mb-8 text-muted-foreground">
                                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">📄 Government Forms & Job Apps</p>
                                        <p className="text-sm">Many portals require small-size images. A jpg to webp compressor helps meet size limits easily.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">🌐 Website Optimization</p>
                                        <p className="text-sm">Developers use WebP to improve page speed and SEO rankings.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">📱 Social Media Uploads</p>
                                        <p className="text-sm">Faster uploads with smaller files.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">🎨 Design Projects</p>
                                        <p className="text-sm">Designers can convert JPG file to WebP without quality loss for better performance.</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">How to Convert JPG to WebP Online Free (Step-by-Step)</h2>
                                <h3 className="text-xl font-bold mb-4">Convert JPG to WebP Online Free in Seconds</h3>
                                <ol className="space-y-3 mb-8 text-muted-foreground list-decimal pl-5">
                                    <li>Upload your JPG image</li>
                                    <li>Click on Convert</li>
                                    <li>Wait a few seconds</li>
                                    <li>Download your WebP file instantly</li>
                                </ol>
                                <p className="italic text-muted-foreground mb-10">💡 No signup. No watermark. 100% free.</p>

                                <h3 className="text-2xl font-bold mb-6">Related Tools You May Like</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 list-none p-0">
                                    <li><Link to="/tools/jpg-compress" className="text-primary hover:underline font-medium">🔗 Image Compressor Tool</Link></li>
                                    <li><Link to="/tools/png-to-jpg" className="text-primary hover:underline font-medium">🔗 PNG to JPG Converter</Link></li>
                                    <li><Link to="/tools/webp-to-jpg" className="text-primary hover:underline font-medium">🔗 WebP to JPG Online</Link></li>
                                    <li><Link to="/tools/png-to-web-p" className="text-primary hover:underline font-medium">🔗 PNG to WebP Converter</Link></li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Key Features of Our JPG to WebP Converter Free</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 list-none p-0 text-muted-foreground font-semibold">
                                    <li className="flex items-center gap-2">⚡ Instant Conversion – Convert in seconds</li>
                                    <li className="flex items-center gap-2">🔒 Secure & Private – Files are local</li>
                                    <li className="flex items-center gap-2">💯 High Quality Output – No visible loss</li>
                                    <li className="flex items-center gap-2">📦 Bulk Conversion Support – WebP bulk</li>
                                    <li className="flex items-center gap-2">📱 Mobile Friendly – All devices</li>
                                    <li className="flex items-center gap-2">💻 No Installation – Browser-based</li>
                                    <li className="flex items-center gap-2">🎯 Free Forever – No hidden charges</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Benefits of Using JPG to WebP Online</h2>
                                <ul className="space-y-3 mb-12 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Faster website loading speed</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Reduced storage space</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Better SEO performance</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Improved user experience</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Easy sharing and uploading</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">JPG to WebP Converter vs Other Tools</h2>
                                <div className="overflow-x-auto mb-12">
                                    <table className="w-full border-collapse border border-border">
                                        <thead>
                                            <tr className="bg-accent/20">
                                                <th className="border border-border p-3 text-left font-bold">Feature</th>
                                                <th className="border border-border p-3 text-left font-bold">Our Tool</th>
                                                <th className="border border-border p-3 text-left font-bold">Other Tools</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-muted-foreground">
                                            <tr>
                                                <td className="border border-border p-3">Free Usage</td>
                                                <td className="border border-border p-3 font-bold text-green-500">✅</td>
                                                <td className="border border-border p-3">❌ Limited</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">No Login Required</td>
                                                <td className="border border-border p-3 font-bold text-green-500">✅</td>
                                                <td className="border border-border p-3">❌ Required</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Bulk Conversion</td>
                                                <td className="border border-border p-3 font-bold text-green-500">✅</td>
                                                <td className="border border-border p-3">❌ Rare</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Speed</td>
                                                <td className="border border-border p-3 font-bold text-primary">⚡ Fast</td>
                                                <td className="border border-border p-3">🐢 Slow</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Privacy</td>
                                                <td className="border border-border p-3 font-bold text-primary">🔒 High</td>
                                                <td className="border border-border p-3">⚠️ Unclear</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">Pro Tips for Best Results</h2>
                                <ul className="space-y-3 mb-8 text-muted-foreground list-disc pl-5">
                                    <li>Use high-resolution JPG for better WebP output</li>
                                    <li>Avoid multiple conversions (JPG → PNG → WebP)</li>
                                    <li>Use bulk conversion for saving time</li>
                                    <li>Always preview before downloading</li>
                                    <li>Optimize image size based on usage (web, mobile, etc.)</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid</h2>
                                <ul className="space-y-3 mb-10 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2">❌ Uploading already compressed images</li>
                                    <li className="flex items-center gap-2">❌ Ignoring image resolution</li>
                                    <li className="flex items-center gap-2">❌ Using low-quality converters</li>
                                    <li className="flex items-center gap-2">❌ Not checking output format requirements</li>
                                    <li className="flex items-center gap-2">❌ Converting one-by-one instead of using bulk feature</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-10">FAQ – JPG to WebP Converter</h2>
                                <div className="space-y-8 mb-12 text-muted-foreground">
                                    <div>
                                        <p className="font-bold text-white mb-2">1. How to convert JPG to WebP without losing quality?</p>
                                        <p>Use a jpg to webp high quality converter that maintains resolution and compression balance. Our tool ensures minimal loss.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white mb-2">2. Is there a jpg to webp converter free online?</p>
                                        <p>Yes, our tool allows jpg to webp converter free online with no limits or login required.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white mb-2">3. Can I convert multiple JPG to WebP at once?</p>
                                        <p>Absolutely. Use our jpg to webp bulk converter online to convert multiple images in one go.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white mb-2">4. What is the best jpg to webp converter online?</p>
                                        <p>The best tool should be fast, secure, and free. Our converter offers all three with high-quality results.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white mb-2">5. Can I change JPG to WebP online free tool on mobile?</p>
                                        <p>Yes, our tool works perfectly on mobile browsers-no app needed.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white mb-2">6. Is it possible to download jpg to webp converter?</p>
                                        <p>You don’t need to. Our jpg to webp converter online works directly in your browser.</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">External Resources</h2>
                                <ul className="space-y-2 mb-12 text-primary underline">
                                    <li><a href="https://developers.google.com/speed/webp" target="_blank" rel="noopener noreferrer">Learn about WebP format from Google</a></li>
                                    <li><a href="https://web.dev/fast/#optimize-your-images" target="_blank" rel="noopener noreferrer">Image optimization best practices</a></li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    If you’re looking for a reliable, fast, and secure jpg to webp converter, this tool is your perfect solution. Whether you're a student uploading documents, a designer optimizing images, or a developer improving website speed-this tool simplifies everything.
                                </p>
                                <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-2xl text-center mb-10">
                                    👉 Upload your image and get instant results now!<br/>
                                    <span className="text-lg font-bold text-muted-foreground">No login. No hassle. Just fast conversion.</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    
                    <OtherConverters />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JpgToWebp;
