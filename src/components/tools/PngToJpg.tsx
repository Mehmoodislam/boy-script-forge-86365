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

const PngToJpg = () => {
    const [results, setResults] = useState<ConvertedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    const pageTitle = "PNG to JPG Converter Free Online (High Quality)";
    const metaDescription = "Convert PNG to JPG instantly with our free online tool. Fast, secure, high-quality image conversion. No login required.";
    const h1Title = "PNG to JPG Converter – Fast, Free & High-Quality Online Tool";
    const subTitle = "Struggling with image upload errors, large file sizes, or formats not supported by job portals or government forms? You're not alone. Many platforms only accept JPG files, leaving users stuck with PNG images.";

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How to convert PNG to JPG high quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload your PNG file, and the tool automatically converts it while preserving quality. No manual settings needed."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a png to jpg converter without losing quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our tool is designed to convert png to jpg high quality online free with minimal compression loss."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert PNG to JPG on mobile?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. This is a png to jpg converter for mobile, working smoothly on Android and iOS browsers."
                }
            },
            {
                "@type": "Question",
                "name": "What is the best png to jpg converter online free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best tool is one that is fast, secure, and doesn’t require login - like this one."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert PNG to JPG in one click?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, just upload your file and it converts instantly - convert png to jpg in one click."
                }
            },
            {
                "@type": "Question",
                "name": "How do I convert PNG to JPG using Canva or online tool?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tools like Canva allow export in JPG, but dedicated converters are faster and simpler for direct conversion."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a png to jpg converter download option?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "This tool works online, so no download is required. However, downloadable software is also available if needed."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert image png to jpg instantly?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, conversion happens in seconds with real-time processing."
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

                    // Fill white background to handle any transparent PNG pixels
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFileName = item.originalName.replace(/\.[^/.]+$/, "") + ".jpg";
                            const convertedFile = new File([blob], newFileName, { type: "image/jpeg" });
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
                    }, "image/jpeg", 0.9); // 90% quality
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
        link.download = result.originalName.replace(/\.[^/.]+$/, "") + ".jpg";
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
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-muted/30" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs">{result.originalName.replace(/\.png$/i, ".jpg")}</p>
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
                                Drag, drop, and convert hundreds of PNG photos into standard JPEG format almost instantly with batch processing.
                            </p>
                        </div>
                    </div>

                    <section className="mt-20 space-y-24">
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    That’s where our png to jpg converter comes in - a fast, secure, and png to jpg converter free online solution that lets you convert images instantly without losing quality.
                                </p>
                                <p className="font-bold text-center text-xl mb-12">
                                    👉 Upload your image and get instant results - no signup required.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">What is a PNG to JPG Converter?</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    A PNG to JPG converter is a simple tool that transforms PNG (Portable Network Graphics) images into JPG (JPEG) format.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    PNG files are high-quality but often larger in size. JPG files, on the other hand, are compressed and widely accepted across websites, apps, and forms.
                                </p>
                                <p className="text-muted-foreground mb-4 font-semibold">With our png to jpg file converter, you can:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 list-none p-0 text-muted-foreground font-medium">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Reduce file size</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Improve compatibility</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Maintain visual quality</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Why Do You Need to Convert PNG to JPG?</h2>
                                <h3 className="text-xl font-bold mb-6">Real-Life Use Cases</h3>
                                <div className="grid md:grid-cols-2 gap-6 mb-10 text-muted-foreground">
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">📄 Government forms & KYC uploads</p>
                                        <p className="text-sm italic">Many portals only accept JPG</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">💼 Job applications</p>
                                        <p className="text-sm italic">Resume portals reject PNG images</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">📱 Mobile uploads</p>
                                        <p className="text-sm italic">JPG loads faster and saves data</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">🎨 Design & web optimization</p>
                                        <p className="text-sm italic">Smaller files improve website speed</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <p className="font-bold mb-2">📧 Email attachments</p>
                                        <p className="text-sm italic">JPG ensures smoother sending</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-10 text-center font-medium">
                                    If you've ever seen “invalid format” or “file too large,” switching to JPG solves it instantly.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">How to Convert PNG to JPG High Quality Online Free</h2>
                                <h3 className="text-xl font-bold mb-4 font-primary">Step-by-Step Guide</h3>
                                <ol className="space-y-3 mb-12 list-decimal pl-5 text-muted-foreground font-medium">
                                    <li>Click on the upload button</li>
                                    <li>Select your PNG image</li>
                                    <li>The tool automatically starts converting</li>
                                    <li>Download your JPG file instantly</li>
                                </ol>
                                <p className="italic text-muted-foreground mb-8 text-center text-lg">
                                    That’s it - convert image png to jpg instantly in just one click.
                                </p>

                                <h3 className="text-2xl font-bold mb-6">Related Tools You May Need</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12 list-none p-0 text-muted-foreground font-medium">
                                    <li><Link to="/tools/webp-to-jpg" className="hover:text-primary transition-colors">🔗 WebP to JPG Converter</Link></li>
                                    <li><Link to="/tools/jpg-compress" className="hover:text-primary transition-colors">🔗 Image Compressor Tool</Link></li>
                                    <li><Link to="/tools/png-to-webp" className="hover:text-primary transition-colors">🔗 PNG to WebP Converter</Link></li>
                                    <li><Link to="/tools/jpg-to-webp" className="hover:text-primary transition-colors">🔗 JPG to WebP Converter</Link></li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Features of Our PNG to JPG Converter</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2">✅ 100% Free & Online – No hidden charges</li>
                                    <li className="flex items-center gap-2">⚡ Fast processing – Convert within seconds</li>
                                    <li className="flex items-center gap-2">🔒 Secure & private – Files are local</li>
                                    <li className="flex items-center gap-2">📱 Mobile-friendly – Works on all devices</li>
                                    <li className="flex items-center gap-2">🎯 High-quality output – No visible loss</li>
                                    <li className="flex items-center gap-2">🖱️ One-click conversion – User-friendly</li>
                                    <li className="flex items-center gap-2">📦 Bulk conversion support</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6 text-center">Benefits of Using This Tool</h2>
                                <div className="grid md:grid-cols-3 gap-6 mb-12 text-sm">
                                    <div className="p-4 rounded-xl border border-border text-center">Saves time with instant conversion</div>
                                    <div className="p-4 rounded-xl border border-border text-center">Works without software installation</div>
                                    <div className="p-4 rounded-xl border border-border text-center">Reduces file size for easy sharing</div>
                                    <div className="p-4 rounded-xl border border-border text-center">Helps avoid upload rejections</div>
                                    <div className="p-4 rounded-xl border border-border text-center col-span-1 md:col-span-2">Ideal for students, designers & developers</div>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">Convert PNG to JPG Without Losing Quality</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Many users worry about losing clarity. Our tool ensures png to jpg high quality output by using optimized compression techniques.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-12">
                                    Whether you're uploading documents or portfolio images, your file stays sharp and professional.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">Your Tool vs Other Tools</h2>
                                <div className="overflow-x-auto mb-10">
                                    <table className="w-full border-collapse border border-border shadow-sm">
                                        <thead>
                                            <tr className="bg-accent/20">
                                                <th className="border border-border p-3 text-left">Feature</th>
                                                <th className="border border-border p-3 text-left">Our Tool</th>
                                                <th className="border border-border p-3 text-left">Other Tools</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-muted-foreground">
                                                <td className="border border-border p-3">Free Usage</td>
                                                <td className="border border-border p-3 font-bold text-green-500">✅ Yes</td>
                                                <td className="border border-border p-3">❌ Limited</td>
                                            </tr>
                                            <tr className="text-muted-foreground">
                                                <td className="border border-border p-3">No Login Required</td>
                                                <td className="border border-border p-3 font-bold text-green-500">✅ Yes</td>
                                                <td className="border border-border p-3">❌ Often required</td>
                                            </tr>
                                            <tr className="text-muted-foreground">
                                                <td className="border border-border p-3">High Quality Output</td>
                                                <td className="border border-border p-3 font-bold text-green-500">✅ Yes</td>
                                                <td className="border border-border p-3">⚠️ Sometimes compressed</td>
                                            </tr>
                                            <tr className="text-muted-foreground">
                                                <td className="border border-border p-3">Fast Conversion</td>
                                                <td className="border border-border p-3 font-bold text-primary">⚡ Instant</td>
                                                <td className="border border-border p-3">🐢 Slow</td>
                                            </tr>
                                            <tr className="text-muted-foreground">
                                                <td className="border border-border p-3">Mobile Friendly</td>
                                                <td className="border border-border p-3 font-bold text-green-500">✅ Yes</td>
                                                <td className="border border-border p-3">❌ Not always</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="font-bold mb-12 text-center text-lg">
                                    👉 This makes it the best png to jpg converter online free for everyday users.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">Pro Tips for Best Results</h2>
                                <ul className="space-y-3 mb-8 text-muted-foreground list-disc pl-5">
                                    <li>Use high-resolution PNGs for better JPG output</li>
                                    <li>Avoid multiple conversions (PNG → JPG → PNG)</li>
                                    <li>Use JPG for web uploads and sharing</li>
                                    <li>Keep file size under platform limits (e.g., 1MB for forms)</li>
                                    <li>For editing, keep PNG backup before converting</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid</h2>
                                <ul className="space-y-3 mb-12 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2">❌ Uploading very low-quality PNGs</li>
                                    <li className="flex items-center gap-2">❌ Converting images multiple times</li>
                                    <li className="flex items-center gap-2">❌ Ignoring file size limits</li>
                                    <li className="flex items-center gap-2">❌ Using unreliable converters that reduce quality</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-10">FAQ – PNG to JPG Converter</h2>
                                <div className="space-y-10 mb-12 text-muted-foreground">
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">1. How to convert PNG to JPG high quality?</p>
                                        <p>Upload your PNG file, and the tool automatically converts it while preserving quality. No manual settings needed.</p>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">2. Is there a png to jpg converter without losing quality?</p>
                                        <p>Yes, our tool is designed to convert png to jpg high quality online free with minimal compression loss.</p>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">3. Can I convert PNG to JPG on mobile?</p>
                                        <p>Absolutely. This is a png to jpg converter for mobile, working smoothly on Android and iOS browsers.</p>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">4. What is the best png to jpg converter online free?</p>
                                        <p>The best tool is one that is fast, secure, and doesn’t require login - like this one.</p>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">5. Can I convert PNG to JPG in one click?</p>
                                        <p>Yes, just upload your file and it converts instantly - convert png to jpg in one click.</p>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">6. How do I convert PNG to JPG using Canva or online tool?</p>
                                        <p>Tools like Canva allow export in JPG, but dedicated converters are faster and simpler for direct conversion.</p>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">7. Is there a png to jpg converter download option?</p>
                                        <p>This tool works online, so no download is required. However, downloadable software is also available if needed.</p>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-lg mb-2">8. Can I convert image png to jpg instantly?</p>
                                        <p>Yes, conversion happens in seconds with real-time processing.</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">External Resources</h2>
                                <ul className="space-y-2 mb-10 text-primary underline">
                                    <li><a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">Learn about image formats from Mozilla</a></li>
                                    <li><a href="https://web.dev" target="_blank" rel="noopener noreferrer">Image optimization best practices</a></li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
                                <p className="text-muted-foreground leading-relaxed mb-10">
                                    If you’re tired of upload errors, large file sizes, or unsupported formats, this png to jpg converter is your go-to solution. It’s fast, free, secure, and built for everyone - from students to professionals.
                                </p>
                                <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-3xl text-center mb-10">
                                    👉 Upload your PNG now and convert it to JPG instantly - no hassle, no signup, just results.
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

export default PngToJpg;
