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

const WebpToJpg = () => {
    const [results, setResults] = useState<ConvertedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    const pageTitle = "WebP to JPG Converter Online Free – Fast & High Quality";
    const metaDescription = "Convert WebP to JPG online free in seconds. Fast, secure, high-quality image converter with bulk support. No signup required.";
    const h1Title = "WebP to JPG Converter – Convert WebP to JPG Online Free & Fast";
    const subTitle = "Struggling with WebP images not uploading on job portals, government forms, or design tools? You’re not alone. Many platforms still don’t accept WebP format, causing frustrating “invalid file type” errors.";

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How to convert WebP to JPG online free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload your file, click convert, and download the JPG instantly. No signup needed."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert WebP to JPG without losing quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our tool ensures webp to jpg without losing quality using optimized processing."
                }
            },
            {
                "@type": "Question",
                "name": "Is this WebP to JPG converter free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. It’s a webp to jpg converter free with no hidden costs."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert multiple WebP files at once?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our tool supports webp to jpg bulk conversion."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need to install any software?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, this is a webp file to jpg converter that works entirely online."
                }
            },
            {
                "@type": "Question",
                "name": "Is it safe to upload my images?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, your files are processed locally in your browser and are never uploaded to our servers."
                }
            },
            {
                "@type": "Question",
                "name": "Can I download converted files instantly?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, your webp to jpg download is available immediately after conversion."
                }
            },
            {
                "@type": "Question",
                "name": "Are there browser extensions available?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can also use a webp to jpg extension, but online tools are faster and easier."
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
        const validFiles = newFiles.filter(file => file.type.match(/image\/webp/));

        if (validFiles.length < newFiles.length) {
            toast.error(`${newFiles.length - validFiles.length} file(s) skipped (not WebP).`);
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

                    // Fill white background to handle any transparent WebP pixels
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
                    }, "image/jpeg", 1.0); // 100% quality mapping
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
                                    Drop your WebP images here
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
                                accept=".webp,image/webp"
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
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs">{result.originalName.replace(/\.webp$/i, ".jpg")}</p>
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
                                Drag, drop, and convert hundreds of WebP photos into standard JPEG format almost instantly with batch processing.
                            </p>
                        </div>
                    </div>

                    <section className="mt-20 space-y-24">
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    That’s where a webp to jpg converter comes in. With our tool, you can convert WebP to JPG online free, instantly and without losing quality. No downloads, no signup-just upload your image and get results in seconds.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">What is a WebP to JPG Converter?</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    A WebP to JPG converter is an online tool that transforms WebP images into JPG format, making them compatible with almost all platforms and devices.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    WebP is great for compression, but JPG is still widely accepted across:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Government websites</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Job application portals</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> University submissions</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Social media platforms</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Design software</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Why You Need a WebP to JPG Converter</h2>
                                <h3 className="text-xl font-bold mb-4">Real-Life Use Cases</h3>
                                <ul className="space-y-3 mb-8 list-none p-0 text-muted-foreground">
                                    <li className="flex items-start gap-2"><strong>Job Applications:</strong> Many ATS portals reject WebP images</li>
                                    <li className="flex items-start gap-2"><strong>KYC Verification:</strong> Banks often require JPG uploads</li>
                                    <li className="flex items-start gap-2"><strong>Freelancers & Designers:</strong> Clients prefer JPG for compatibility</li>
                                    <li className="flex items-start gap-2"><strong>Students:</strong> Assignment portals may not accept WebP</li>
                                    <li className="flex items-start gap-2"><strong>E-commerce Sellers:</strong> Platforms like marketplaces require JPG images</li>
                                </ul>
                                <p className="bg-primary/10 p-4 rounded-xl border border-primary/20 mb-8 font-medium">
                                    👉 Instead of wasting time, simply use a webp to jpg online tool and get it done instantly.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">How to Convert WebP to JPG Online Free (Step-by-Step)</h2>
                                <h3 className="text-xl font-bold mb-4">Convert WebP to JPG Online Free in Seconds</h3>
                                <ol className="space-y-3 mb-8 text-muted-foreground">
                                    <li>Upload your WebP image</li>
                                    <li>Click the “Convert” button</li>
                                    <li>Wait a few seconds</li>
                                    <li>Download your JPG file</li>
                                </ol>
                                <p className="italic text-muted-foreground mb-8">💡 Works on mobile, tablet, and desktop.</p>

                                <h2 className="text-3xl font-bold mb-6">Key Features of Our WebP to JPG Converter Free</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 list-none p-0 text-muted-foreground font-medium">
                                    <li className="flex items-center gap-2">✅ 100% Free – No hidden charges</li>
                                    <li className="flex items-center gap-2">🔒 Secure – Files are auto-deleted after conversion</li>
                                    <li className="flex items-center gap-2">⚡ Fast Processing – Instant results</li>
                                    <li className="flex items-center gap-2">📦 Bulk Conversion – Convert multiple files at once</li>
                                    <li className="flex items-center gap-2">🖼️ High Quality Output – WebP to JPG high quality</li>
                                    <li className="flex items-center gap-2">🌐 Browser-Based – No installation needed</li>
                                    <li className="flex items-center gap-2">📱 Mobile Friendly</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Benefits of Using This Image Converter (WebP to JPG)</h2>
                                <ul className="space-y-3 mb-8 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Avoid upload errors instantly</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Save time with one-click conversion</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Maintain original image quality</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Compatible with all platforms</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> No software or plugins required</li>
                                </ul>
                                <p className="mb-8 font-medium">👉 Whether you're a student or a designer, this image converter webp to jpg simplifies your workflow.</p>

                                <h2 className="text-3xl font-bold mb-6">Convert WebP to JPG Without Losing Quality</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Many tools compress your images too much. Ours is optimized to ensure:
                                </p>
                                <ul className="space-y-2 mb-8 list-none p-0 text-muted-foreground font-semibold">
                                    <li className="flex items-center gap-2">🎯 Sharp details</li>
                                    <li className="flex items-center gap-2">🎯 Accurate colors</li>
                                    <li className="flex items-center gap-2">🎯 Minimal compression loss</li>
                                </ul>
                                <p className="text-muted-foreground mb-8">So you can confidently use it for professional needs.</p>

                                <h2 className="text-3xl font-bold mb-6">Pro Tips for Best Results</h2>
                                <ul className="space-y-3 mb-8 text-muted-foreground">
                                    <li>Use high-resolution WebP files for better JPG output</li>
                                    <li>Convert in bulk to save time</li>
                                    <li>Rename files after download for better organization</li>
                                    <li>Always preview your image before uploading</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid</h2>
                                <ul className="space-y-3 mb-8 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2">❌ Uploading corrupted WebP files</li>
                                    <li className="flex items-center gap-2">❌ Expecting transparency (JPG doesn’t support it)</li>
                                    <li className="flex items-center gap-2">❌ Using low-quality source images</li>
                                    <li className="flex items-center gap-2">❌ Ignoring file size limits on target platforms</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Our Tool vs Other WebP to JPG Converters</h2>
                                <div className="overflow-x-auto mb-12">
                                    <table className="w-full border-collapse border border-border">
                                        <thead>
                                            <tr className="bg-accent/20">
                                                <th className="border border-border p-3 text-left">Feature</th>
                                                <th className="border border-border p-3 text-left">Our Tool</th>
                                                <th className="border border-border p-3 text-left">Other Tools</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-border p-3">Free Usage</td>
                                                <td className="border border-border p-3">✅</td>
                                                <td className="border border-border p-3">⚠️ Limited</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">No Signup</td>
                                                <td className="border border-border p-3">✅</td>
                                                <td className="border border-border p-3">❌ Required</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Bulk Conversion</td>
                                                <td className="border border-border p-3">✅</td>
                                                <td className="border border-border p-3">❌ Rare</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">High Quality Output</td>
                                                <td className="border border-border p-3">✅</td>
                                                <td className="border border-border p-3">⚠️ Compressed</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Fast Speed</td>
                                                <td className="border border-border p-3">✅</td>
                                                <td className="border border-border p-3">⚠️ Slow</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mb-8 font-bold text-center text-xl">👉 Choose smart. Convert faster.</p>

                                <h2 className="text-3xl font-bold mb-6">Helpful Resources</h2>
                                <ul className="space-y-2 mb-8 list-none p-0 text-muted-foreground underline">
                                    <li><a href="https://developers.google.com/speed/webp" target="_blank" rel="noopener noreferrer">Learn about WebP format</a></li>
                                    <li><a href="https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types" target="_blank" rel="noopener noreferrer">Image format comparison</a></li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Related Tools You May Like</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12 list-none p-0 text-muted-foreground font-medium">
                                    <li><Link to="/tools/png-to-jpg" className="hover:text-primary transition-colors">🔗 Convert PNG to JPG</Link></li>
                                    <li><Link to="/tools/jpg-compress" className="hover:text-primary transition-colors">🔗 Image Compressor Tool</Link></li>
                                    <li><Link to="/tools/webp-to-png" className="hover:text-primary transition-colors">🔗 WebP to PNG Converter</Link></li>
                                    <li><Link to="/tools/png-to-web-p" className="hover:text-primary transition-colors">🔗 PNG to WebP Converter</Link></li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-10">FAQs – WebP to JPG Converter</h2>
                                <div className="space-y-8 mb-12">
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">1. How to convert WebP to JPG online free?</h4>
                                        <p className="text-muted-foreground">Upload your file, click convert, and download the JPG instantly. No signup needed.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">2. Can I convert WebP to JPG without losing quality?</h4>
                                        <p className="text-muted-foreground">Yes, our tool ensures webp to jpg without losing quality using optimized processing.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">3. Is this WebP to JPG converter free?</h4>
                                        <p className="text-muted-foreground">Absolutely. It’s a webp to jpg converter free with no hidden costs.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">4. Can I convert multiple WebP files at once?</h4>
                                        <p className="text-muted-foreground">Yes, our tool supports webp to jpg bulk conversion.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">5. Do I need to install any software?</h4>
                                        <p className="text-muted-foreground">No, this is a webp file to jpg converter that works entirely online.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">6. Is it safe to upload my images?</h4>
                                        <p className="text-muted-foreground">Yes, your files are processed locally in your browser and are never uploaded to our servers.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">7. Can I download converted files instantly?</h4>
                                        <p className="text-muted-foreground">Yes, your webp to jpg download is available immediately after conversion.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">8. Are there browser extensions available?</h4>
                                        <p className="text-muted-foreground">Yes, you can also use a webp to jpg extension, but online tools are faster and easier.</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    If you’re tired of upload errors and format issues, this webp to jpg converter is your perfect solution. It’s fast, free, secure, and built for everyday users-from students to professional designers.
                                </p>
                                <p className="font-bold text-center text-2xl mb-12">
                                    👉 Upload your image and convert WebP to JPG online free now-no hassle, no delay.
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

export default WebpToJpg;
