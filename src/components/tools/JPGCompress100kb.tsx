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

interface JPGCompress100kbProps {
    children?: React.ReactNode;
}

const JPGCompress100kb = ({ children }: JPGCompress100kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 100KB
    const pageTitle = "Compress JPG to 100KB Online Free - Fast Image Optimizer";
    const metaDescription = "Specifically optimize and compress JPG images to under 100KB while maintaining the best possible quality. Perfect for restricted uploads and web forms.";
    const h1Title = "Compress JPG to 100KB";
    const subTitle = "Get your images ready for any platform by compressing them specifically to 100KB. Professional results, instantly.";

    const getTargetSizeMB = () => {
        return 100 / 1024; // Target: 100KB
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
                let initialDimensions = 1200;

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

                    <div className="mt-20 space-y-16">
                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">How To Compress JPG to 100kb:</h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Compressing your JPEG images to a mere 100kb can be accomplished effortlessly using SmallJPG's intuitive interface and advanced compression algorithms.
                            </p>
                            <ol className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                                    <p className="text-muted-foreground"><strong className="text-foreground">Upload Your Image:</strong> Begin by selecting your JPEG file directly on the website.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                                    <p className="text-muted-foreground"><strong className="text-foreground">Choose 100kb Compression:</strong> Opt for the specific 100kb compression option provided on the tool.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
                                    <p className="text-muted-foreground"><strong className="text-foreground">Adjust Settings if Needed:</strong> SmallJPG provides settings to fine-tune the compression if you require a balance between size and quality.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</span>
                                    <p className="text-muted-foreground"><strong className="text-foreground">Download Your Compressed Image:</strong> Once satisfied, download your efficiently compressed image instantly, ready for your job applications or other size-restricted platforms.</p>
                                </li>
                            </ol>
                        </section>

                        <section className="text-center py-10">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-[#00bcd4]">
                                COMPRESS JPG To 100KB
                            </h2>
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                                Reduce JPG Size to Specific KB Easily
                            </p>

                            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-56 h-56 rounded-2xl overflow-hidden border-4 border-white shadow-2xl rotate-[-2deg]">
                                        <img src="/assets/boy116.webp" alt="Before" className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                    <span className="text-3xl font-black text-orange-500">4 MB</span>
                                </div>

                                <div className="flex flex-col items-center gap-6">
                                    <div className="bg-[#00bcd4] text-white px-4 py-1 rounded-md text-sm font-bold uppercase tracking-wider">
                                        Free, Fast & Online Tool
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-[#00bcd4]" />
                                        <ArrowRight className="text-[#00bcd4] h-6 w-6" />
                                    </div>
                                    <div className="flex items-center gap-2 px-6 py-3 bg-white shadow-lg rounded-xl border border-gray-100">
                                        <div className="p-1 rounded bg-orange-500">
                                            <ImageIcon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                            Small<span className="text-orange-500">JPG</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-[#00bcd4]" />
                                        <ArrowRight className="text-[#00bcd4] h-6 w-6" />
                                    </div>
                                    <div className="px-4 py-1 rounded-full border border-gray-200 bg-gray-50 flex items-center gap-2 text-xs font-medium text-gray-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00bcd4]" />
                                        smalljpg.org
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-56 h-56 rounded-2xl overflow-hidden border-4 border-white shadow-2xl rotate-[2deg]">
                                        <img src="/assets/boy116.webp" alt="After" className="w-full h-full object-cover opacity-90" loading="lazy" />
                                    </div>
                                    <span className="text-3xl font-black text-[#00bcd4]">100 KB</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <OtherCompressionSizes />

                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JPGCompress100kb;
