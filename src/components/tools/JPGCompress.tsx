import { useState } from "react";
import { Image as ImageIcon, Upload, Download, FileJson, CheckCircle2, AlertCircle, Trash2, ArrowRight, X, Layers, List } from "lucide-react";
import imageCompression from "browser-image-compression";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import CompressionTargets from "@/components/tools/CompressionTargets";
import SEOHead from "@/components/SEOHead";

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

interface JPGCompressProps {
    targetSize?: string;
    children?: React.ReactNode;
}

const JPGCompress = ({ targetSize, children }: JPGCompressProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    const getTargetSizeMB = () => {
        if (!targetSize) return 1;
        const value = parseInt(targetSize);
        if (isNaN(value)) return 1;
        if (targetSize.toLowerCase().endsWith("kb")) return value / 1024;
        if (targetSize.toLowerCase().endsWith("mb")) return value;
        return 1;
    };

    const displaySize = targetSize ? targetSize.toUpperCase() : "";
    const pageTitle = targetSize
        ? `Compress JPG to ${displaySize} Online Free | SmallJPG`
        : "Compress JPG Image Online Free - SmallJPG Image Compressor";
    const metaDescription = targetSize
        ? `Compress JPG images to ${displaySize} online free. SmallJPG makes it easy to reduce JPG file size to exactly ${displaySize} for online portals, government jobs & admissions.`
        : "SmallJPG: Compress JPG images to 50KB, 100KB, 200KB & more. Free online JPG compressor for government job portals, admissions & web use. No installation required.";
    const h1Title = targetSize ? `Compress JPG to ${displaySize}` : "Compress JPG Image";
    const subTitle = targetSize
        ? `SmallJPG: Your Ultimate Destination for Effortless JPG Size Compression to ${displaySize}.`
        : "SmallJPG: Your Ultimate Destination for Effortless JPG Size Compression.";

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
                let options = {
                    maxSizeMB: targetSizeMB,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    onProgress: (percent: number) => {
                        setResults(prev => prev.map(r => r.id === item.id ? { ...r, progress: percent } : r));
                    },
                };

                let compressedFile = await imageCompression(fileToProcess, options);

                // If it's still significantly over target (allowing 2% buffer), try more aggressive parameters
                // This is especially important for small targets like 5KB or 20KB
                if (compressedFile.size > targetSizeMB * 1024 * 1024 * 1.02 && targetSizeMB < 0.1) {
                    try {
                        // Try 1: Smaller dimensions
                        compressedFile = await imageCompression(compressedFile as File, {
                            ...options,
                            maxSizeMB: targetSizeMB * 0.9,
                            maxWidthOrHeight: 800,
                        });

                        // Try 2: Even smaller if still over
                        if (compressedFile.size > targetSizeMB * 1024 * 1024 * 1.02) {
                            compressedFile = await imageCompression(compressedFile as File, {
                                ...options,
                                maxSizeMB: targetSizeMB * 0.8,
                                maxWidthOrHeight: 400,
                            });
                        }
                    } catch (retryErr) {
                        console.warn("Aggressive compression retry failed, using initial result", retryErr);
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

                    {/* Main Content Section */}
                    <div className="mt-20 prose prose-lg dark:prose-invert max-w-none">
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border mb-10">
                            <p className="text-muted-foreground leading-relaxed">
                                In today's digital age, image compression plays a crucial role, especially when submitting images on online portals that have strict size restrictions. SmallJPG is here to help you overcome this challenge. Our web-based tool allows you to compress JPG images quickly and efficiently, reducing their size to meet specific requirements, all in just a few clicks. Whether you're applying for a government job, admission to an educational institution, or simply optimizing your images for web use, SmallJPG has you covered. Let's explore how SmallJPG can make your life easier.
                            </p>
                        </div>

                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border mb-10">
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Our online tool allows you to quickly and effortlessly compress your JPG images to specific file sizes, including 50KB, 100KB, 200KB, and more. Say goodbye to the frustration of oversized image uploads – SmallJPG is your solution!
                            </p>

                            <h2 className="text-2xl font-bold mb-6">How SmallJPG Works:</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { step: "1", title: "Upload Your Image", desc: "Start by uploading your JPG image to our platform." },
                                    { step: "2", title: "Select Your Desired Size", desc: "SmallJPG offers preset options to compress your image to specific sizes, including 50KB, 100KB, 200KB, and more." },
                                    { step: "3", title: "Click \"Compress Image\"", desc: "Once you've chosen your desired size, click the \"Compress Image\" button, and SmallJPG will instantly optimize your image." },
                                    { step: "4", title: "Download the Compressed Image", desc: "Your compressed image is ready! Download it and use it for your online submissions." },
                                ].map((item) => (
                                    <div key={item.step} className="p-6 rounded-2xl bg-accent/5 border border-border space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">{item.step}</span>
                                            <h3 className="text-lg font-bold m-0">{item.title}</h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm m-0">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <p className="text-muted-foreground leading-relaxed mt-8">
                                In no time, your image will be ready for download, perfectly sized and primed for upload to online portals. Whether you're a professional, student, or someone who needs to quickly adjust image sizes, SmallJPG is your ideal solution.
                            </p>
                        </div>

                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border mb-10">
                            <h2 className="text-2xl font-bold mb-8">Why Use SmallJPG As Image Compressor?</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Lightning-Fast Compression", desc: "SmallJPG compresses your images in milliseconds, ensuring you won't waste valuable time on resizing and optimizing images." },
                                    { title: "Specific Size Options", desc: "SmallJPG allows you to specify the exact file size you need, whether it's 50KB, 100KB, or any other custom size." },
                                    { title: "User-Friendly Interface", desc: "Our intuitive interface makes it easy for anyone, even with limited technical skills, to compress images effortlessly." },
                                    { title: "No Installation Required", desc: "Forget about installing complex software or apps. SmallJPG works right in your browser, eliminating the need for downloads or installations." },
                                ].map((item) => (
                                    <div key={item.title} className="p-6 rounded-2xl bg-accent/5 border border-border space-y-3">
                                        <h3 className="text-lg font-bold flex items-center gap-2 m-0">
                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm m-0">{item.desc}</p>
                                    </div>
                                ))}
                                <div className="p-6 rounded-2xl bg-accent/5 border border-border space-y-3 md:col-span-2">
                                    <h3 className="text-lg font-bold flex items-center gap-2 m-0">
                                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                        Perfect for Online Portals
                                    </h3>
                                    <p className="text-muted-foreground text-sm m-0">SmallJPG is a favorite tool among users who frequently upload images to online portals. It ensures your images meet their size requirements without a hitch.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border mb-10">
                            <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                SmallJPG is your go-to tool for swiftly compressing JPG images to specific sizes, addressing the requirements of online portals where image size limitations are common. Whether you need to meet strict size restrictions on government job portals or admission platforms, SmallJPG is here to save the day.
                            </p>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                With SmallJPG, the power to make your images just the right size is at your fingertips. Give it a try and optimize your image submissions today!
                            </p>
                        </div>
                    </div>



                    <CompressionTargets />
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JPGCompress;
