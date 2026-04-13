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

const WebpToPng = () => {
    const [results, setResults] = useState<ConvertedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    const pageTitle = "Convert WebP to PNG Online Free - High Quality, Transparent";
    const metaDescription = "Easily convert WebP images to PNG format online for free. Supports transparency, 100% secure local browser processing with no watermarks.";
    const h1Title = "Convert WebP to PNG Instantly";
    const subTitle = "Need to preserve transparency or high quality? Our 100% secure, browser-based converter turns WebP into high-quality PNGs in seconds.";

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

                    // Clear canvas for transparency (PNG supports it)
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFileName = item.originalName.replace(/\.[^/.]+$/, "") + ".png";
                            const convertedFile = new File([blob], newFileName, { type: "image/png" });
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
                    }, "image/png");
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
        link.download = result.originalName.replace(/\.[^/.]+$/, "") + ".png";
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
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-muted/30" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs">{result.originalName.replace(/\.webp$/i, ".png")}</p>
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
                                Drag, drop, and convert hundreds of WebP photos into standard PNG format almost instantly with batch processing.
                            </p>
                        </div>
                    </div>

                    <section className="mt-20 space-y-24">
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8">Why Convert WebP to PNG?</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        WebP is a modern image format that provides superior compression. However, PNG is often preferred when you need transparency preservation or lossless quality. Converting WebP to PNG is essential when you need:
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "To preserve transparent backgrounds for logos and icons.",
                                            "To maintain lossless quality for further editing.",
                                            "To ensure compatibility with software that doesn't support WebP.",
                                            "To use images in presentations or documents where PNG is the standard.",
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
                                        "PNG is the gold standard for high-quality images with transparency. Our converter ensures no detail is lost during the process."
                                    </p>
                                </div>
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

export default WebpToPng;
