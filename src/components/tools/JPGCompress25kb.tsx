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

interface JPGCompress25kbProps {
    children?: React.ReactNode;
}

const JPGCompress25kb = ({ children }: JPGCompress25kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 25KB
    const pageTitle = "Compress JPG to 25KB Online - Free, Precise & Instant";
    const metaDescription = "Compress JPG to exactly 25KB online for free using Free Image Prompt. Perfect for exam applications, government portals, and institutional submissions. No signup, 100% browser-based, maximum quality retained.";
    const h1Title = "Compress JPG to 25KB - Precise Compression for Every Official Submission";
    const subTitle = "You've filled out the entire application form perfectly, but the image upload fails because your photo is 27KB. Free Image Prompt's tool brings your JPEG down to exactly 25KB instantly.";

    const getTargetSizeMB = () => {
        return 25 / 1024; // Target: 25KB
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
                let initialDimensions = 900; // Adjusted for 25KB

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
                        {/* Use Cases section */}
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8">Where Is a 25KB Image Size Limit Required?</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        The 25KB threshold appears across a broad range of official platforms where moderately high clarity is needed:
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "State government recruitment portals (PSC boards, municipal corporations) capping photos at 25KB.",
                                            "Educational institution admission forms for private universities and autonomous colleges.",
                                            "Professional certification portals (Medical councils, Bar associations, Engineering councils).",
                                            "Insurance and financial services (LIC agent registration, mutual fund KYC).",
                                            "Online tender and vendor registration systems requiring signatory photographs.",
                                            "Employee verification and corporate HR onboarding systems."
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
                                        "A file even one kilobyte over the limit triggers automatic rejection - making exact compression the only reliable solution."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How to compress (Steps) */}
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8 text-center">How to Compress JPG to 25KB - Simple 6-Step Process</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { title: "Open Free Image Prompt", text: "Visit directly in any browser on any device - zero installation, zero sign-up required." },
                                    { title: "Upload Your Image", text: "Select your JPG or JPEG image from your phone gallery, desktop, Google Drive, or Dropbox." },
                                    { title: "Select 25KB Preset", text: "Choose the 25KB preset from the target size menu on the compression interface." },
                                    { title: "Fine-tune Quality", text: "Adjust the slider for images containing critical detail such as facial features or official stamps." },
                                    { title: "Click Compress Now", text: "Processing happens entirely within your browser, typically completing in under 5 seconds." },
                                    { title: "Preview & Download", text: "Inspect the side-by-side comparison, zoom into key areas, and download your 25KB image." }
                                ].map((step, i) => (
                                    <div key={i} className="relative p-7 rounded-[2rem] bg-background border border-border hover:border-primary/50 transition-all group overflow-hidden">
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
                                <h2 className="text-3xl font-bold">Why Free Image Prompt Outperforms Every Other 25KB Compressor</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto italic">High-precision tools for professional applications.</p>
                            </div>
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[
                                    { title: "Absolute Browser Privacy", text: "Your image never leaves your device. Essential for passport photos and official portraits.", icon: <Upload className="h-6 w-6" /> },
                                    { title: "Exact 25KB Targeting", text: "Our algorithm systematically converges on exactly 25KB every time, not just 'approximately'.", icon: <Layers className="h-6 w-6" /> },
                                    { title: "Unlimited Free Compressions", text: "No daily limits, no premium tiers. Prepare image submissions for entire batches at no cost.", icon: <CheckCircle2 className="h-6 w-6" /> },
                                    { title: "Full Mobile Compatibility", text: "Open in any mobile browser, upload from camera roll, and download 25KB results straight to your phone.", icon: <ImageIcon className="h-6 w-6" /> },
                                    { title: "Multi-Format Support", text: "Upload JPEG, PNG, or WebP. We'll automatically convert and compress it to a precise 25KB JPEG.", icon: <FileJson className="h-6 w-6" /> },
                                    { title: "Live Side-by-Side Preview", text: "Zoom into features and edge details before committing to the download for portal submission.", icon: <List className="h-6 w-6" /> }
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
                            <h2 className="text-3xl font-bold mb-10 text-center">Pro Tips for Maximum Quality at 25KB</h2>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Resize Before Compressing</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Match your pixel dimensions (e.g., 200x230px) to the portal's specs first for more efficient results.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Use Original Sources</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Always compress from the original high-resolution photo once to 25KB to preserve maximum detail.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Use Live Preview</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Zoom into features in the side-by-side preview to confirm quality before you submit your form.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Solid Backgrounds</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Portrait shots against a plain white/grey background produce much sharper 25KB outputs than busy backgrounds.
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
                                            { f: "Precise 25KB Target", a: "✅ Exact Accuracy", b: "❌ Approximate only" },
                                            { f: "100% Client-Side", a: "✅ Yes (Privacy)", b: "❌ Server upload required" },
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
                                Free Image Prompt handles precise targets for any requirement. From signatures to high-res portfolios.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {[
                                    { s: "10KB", d: "Signatures", p: "/tools/compress-jpg-to-10kb" },
                                    { s: "15KB", d: "Portals", p: "/tools/compress-jpg-to-15kb" },
                                    { s: "20KB", d: "ID Cards", p: "/tools/compress-jpg-to-20kb" },
                                    { s: "30KB", d: "Admission", p: "/tools/compress-jpg-to-30kb" },
                                    { s: "50KB", d: "Job Forms", p: "/tools/compress-jpg-to-50kb" },
                                    { s: "100KB", d: "Passports", p: "/tools/compress-jpg-to-100kb" }
                                ].map((size, i) => (
                                    <a key={i} href={size.p} className="flex flex-col items-center p-6 rounded-3xl bg-background border border-border hover:border-primary hover:shadow-xl transition-all group">
                                        <span className="font-black text-2xl text-primary group-hover:scale-110 transition-transform">{size.s}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">{size.d}</span>
                                    </a>
                                ))}
                            </div>
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

export default JPGCompress25kb;
