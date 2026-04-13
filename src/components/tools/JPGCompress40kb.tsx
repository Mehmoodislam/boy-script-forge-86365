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

interface JPGCompress40kbProps {
    children?: React.ReactNode;
}

const JPGCompress40kb = ({ children }: JPGCompress40kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 40KB
    const pageTitle = "Compress JPG to 40KB Online Free (No Quality Loss)";
    const metaDescription = "Compress JPG to 40KB online free. Reduce image size instantly without losing quality. No signup needed. Fast, secure & easy to use.";
    const h1Title = "Compress JPG to 40KB Online Free (No Quality Loss)";
    const subTitle = "Are you struggling with an image rejected, file too large, or constant upload error while submitting forms? You’re not alone. Many users need to compress JPG to 40KB for job portals, KYC verification, or government uploads-but most tools either ruin quality or are too complicated.";

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How to compress JPG to 40KB online free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload your image to an online compressor, select 40KB target size, and download the optimized file instantly."
                }
            },
            {
                "@type": "Question",
                "name": "Can I compress JPEG to 40KB without losing quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, advanced tools use smart compression to maintain image quality while reducing size."
                }
            },
            {
                "@type": "Question",
                "name": "What is the best JPG compressor to 40KB?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best tool is one that is free, secure, fast, and maintains quality without requiring signup."
                }
            },
            {
                "@type": "Question",
                "name": "Can I compress PDF to 40KB?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, use a PDF compression tool or convert PDF to JPG and then compress it."
                }
            },
            {
                "@type": "Question",
                "name": "Why do government portals reject images?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Because the file size or format does not meet the required criteria, such as 40KB JPG limit."
                }
            }
        ]
    };

    const getTargetSizeMB = () => {
        return 40 / 1024; // Target: 40KB
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
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead title={pageTitle} description={metaDescription} schema={faqSchema} />
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
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" loading="lazy" />
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

                    <div className="mt-20 space-y-16">
                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">The good news?</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                You can now compress jpg to 40kb online free in seconds-without losing quality. Whether you need a photo convert into 40 kb jpg online or reduce a file size quickly, this guide will walk you through everything.
                            </p>
                        </section>

                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">What is Compress JPG to 40KB?</h2>
                            <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                                Compress JPG to 40KB means reducing the file size of a JPG (or JPEG format) image to exactly or under 40 kilobytes while maintaining acceptable visual quality.
                            </p>
                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                JPG (or JPEG) is a widely used image format designed for efficient compression. Learn more about it <a href="https://en.wikipedia.org/wiki/JPEG" target="_blank" rel="noreferrer" className="text-primary hover:underline">here</a>.
                            </p>
                            <h3 className="text-xl font-bold mb-4">This process involves:</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                                <li>Image compression techniques</li>
                                <li>Resolution adjustment</li>
                                <li>Smart quality optimization</li>
                            </ul>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                It’s commonly done using an online image compressor or file compression tool.
                            </p>
                        </section>

                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Do You Need to Compress JPG to 40KB?</h2>
                            <h3 className="text-xl font-bold mb-4">Real-Life Use Cases</h3>
                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                Here’s where most people face issues:
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold">1. Government Forms</h4>
                                    <p className="text-muted-foreground">Many government portals (like <a href="https://www.usa.gov" target="_blank" rel="noreferrer" className="text-primary hover:underline">usa.gov</a>) require strict file size limits. Uploading a larger file results in:</p>
                                    <ul className="text-muted-foreground">
                                        <li>❌ Image rejected</li>
                                        <li>❌ Upload error</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold">2. Job Applications</h4>
                                    <p className="text-muted-foreground">Job portals often ask for:</p>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        <li>Passport-size photo under 40KB</li>
                                        <li>Signature image within size limits</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold">3. KYC Verification</h4>
                                    <p className="text-muted-foreground">Banks and online services require:</p>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        <li>ID proof images</li>
                                        <li>Signature uploads</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold">4. Exam & Admission Forms</h4>
                                    <p className="text-muted-foreground">Students frequently need:</p>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        <li>Photo convert into 20 KB to 40 KB JPG</li>
                                        <li>Resize image to 40 KB online</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">How to Compress JPG to 40KB Online Free</h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">Follow this simple step-by-step guide:</p>
                            <ol className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">1</span>
                                    <div>
                                        <strong className="text-lg">Step 1: Upload Your Image</strong>
                                        <p className="text-muted-foreground">Choose your JPG/JPEG file from your device.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">2</span>
                                    <div>
                                        <strong className="text-lg">Step 2: Select Target Size</strong>
                                        <p className="text-muted-foreground">Set the file size to 40KB.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">3</span>
                                    <div>
                                        <strong className="text-lg">Step 3: Automatic Optimization</strong>
                                        <p className="text-muted-foreground">The tool will: Reduce image size, Adjust resolution, Optimize compression.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">4</span>
                                    <div>
                                        <strong className="text-lg">Step 4: Download Image</strong>
                                        <p className="text-muted-foreground">Download your compressed image instantly.</p>
                                    </div>
                                </li>
                            </ol>
                            <p className="mt-8 text-lg font-medium text-primary">👉 Try now: Upload your image and get instant results (No signup required)</p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8">
                            <section className="bg-card/50 p-8 rounded-[2.5rem] border border-border">
                                <h2 className="text-2xl font-bold mb-6">Key Features of JPG Compressor to 40KB</h2>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> Compress jpeg to 40kb online free</li>
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> No login required</li>
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> Secure & private processing</li>
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> Fast compression (seconds)</li>
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> Works on mobile & desktop</li>
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> Supports JPG, JPEG & PDF files</li>
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> Maintains image clarity</li>
                                    <li className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-green-500" /> Signature compressor to 40kb jpg supported</li>
                                </ul>
                            </section>

                            <section className="bg-card/50 p-8 rounded-[2.5rem] border border-border">
                                <h2 className="text-2xl font-bold mb-6">Benefits of Using an Online JPG Compressor</h2>
                                <div className="space-y-4">
                                    <div><h4 className="font-bold">1. Saves Time</h4><p className="text-muted-foreground text-sm">No need for complex software.</p></div>
                                    <div><h4 className="font-bold">2. Keeps Image Quality</h4><p className="text-muted-foreground text-sm">Advanced tools ensure minimal quality loss.</p></div>
                                    <div><h4 className="font-bold">3. Free to Use</h4><p className="text-muted-foreground text-sm">Most tools are completely free.</p></div>
                                    <div><h4 className="font-bold">4. Universal Compatibility</h4><p className="text-muted-foreground text-sm">Works with Government portals, Job sites, KYC platforms</p></div>
                                    <div><h4 className="font-bold">5. Multi-Format Support</h4><p className="text-muted-foreground text-sm">You can also: Compress PDF to 40KB, Convert PDF to JPG, Use pdf to jpg compressor to 40kb</p></div>
                                </div>
                            </section>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <section className="bg-card/50 p-8 rounded-[2.5rem] border border-border">
                                <h2 className="text-2xl font-bold mb-6">Pro Tips for Best Results</h2>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-muted-foreground">📌 Use high-resolution original images for better compression results</li>
                                    <li className="flex gap-3 text-muted-foreground">📌 Avoid repeated compression (quality loss increases)</li>
                                    <li className="flex gap-3 text-muted-foreground">📌 Keep dimensions balanced (not too small)</li>
                                    <li className="flex gap-3 text-muted-foreground">📌 Use tools that support compress jpeg to 40kb without losing quality</li>
                                    <li className="flex gap-3 text-muted-foreground">📌 For signatures, use a white background and dark ink</li>
                                </ul>
                            </section>

                            <section className="bg-card/50 p-8 rounded-[2.5rem] border border-border">
                                <h2 className="text-2xl font-bold mb-6">Common Mistakes to Avoid</h2>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-muted-foreground">❌ Uploading already compressed images</li>
                                    <li className="flex gap-3 text-muted-foreground">❌ Using random tools that reduce quality drastically</li>
                                    <li className="flex gap-3 text-muted-foreground">❌ Ignoring resolution (only reducing size isn’t enough)</li>
                                    <li className="flex gap-3 text-muted-foreground">❌ Not checking final file size before upload</li>
                                    <li className="flex gap-3 text-muted-foreground">❌ Using wrong format (PNG instead of JPG)</li>
                                </ul>
                            </section>
                        </div>

                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border overflow-x-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">Comparison: Your Tool vs Other Tools</h2>
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-accent/10">
                                    <tr>
                                        <th className="p-4 font-bold border-b">Feature</th>
                                        <th className="p-4 font-bold border-b text-center">Your Tool</th>
                                        <th className="p-4 font-bold border-b text-center">Other Tools</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr><td className="p-4 text-muted-foreground">Free to use</td><td className="p-4 text-center">✅</td><td className="p-4 text-center">❌/Limited</td></tr>
                                    <tr><td className="p-4 text-muted-foreground">No login required</td><td className="p-4 text-center">✅</td><td className="p-4 text-center">❌</td></tr>
                                    <tr><td className="p-4 text-muted-foreground">Exact 40KB compression</td><td className="p-4 text-center">✅</td><td className="p-4 text-center">❌</td></tr>
                                    <tr><td className="p-4 text-muted-foreground">Quality retention</td><td className="p-4 text-center">✅ High</td><td className="p-4 text-center">⚠️ Medium</td></tr>
                                    <tr><td className="p-4 text-muted-foreground">Fast processing</td><td className="p-4 text-center">✅</td><td className="p-4 text-center">⚠️ Slow</td></tr>
                                    <tr><td className="p-4 text-muted-foreground">Multi-format support</td><td className="p-4 text-center">✅</td><td className="p-4 text-center">❌</td></tr>
                                    <tr><td className="p-4 text-muted-foreground">Mobile-friendly</td><td className="p-4 text-center">✅</td><td className="p-4 text-center">⚠️</td></tr>
                                </tbody>
                            </table>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8">
                            <section className="bg-card/50 p-8 rounded-[2.5rem] border border-border">
                                <h2 className="text-2xl font-bold mb-6">Related Tools You May Need</h2>
                                <p className="text-muted-foreground mb-4">These tools help with image resizing, file conversion, and document optimization:</p>
                                <ul className="space-y-3">
                                    <li>🔗 Image Resizer Tool</li>
                                    <li>🔗 PDF to JPG Converter</li>
                                    <li>🔗 Signature Resize Tool</li>
                                </ul>
                            </section>

                            <section className="bg-card/50 p-8 rounded-[2.5rem] border border-border">
                                <h2 className="text-2xl font-bold mb-6">Related Searches</h2>
                                <div className="flex flex-wrap gap-2">
                                    {["compress image to 40kb jpg", "compress size of jpg to 40kb", "online jpg compressor to 40kb", "photo convert into 30 kb to 40 kb jpg", "40 kb photo size in width and height", "resize image to 40 kb online", "jpeg compressor to 40kb jpg", "pdf to jpg 40 kb"].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-accent/10 text-muted-foreground rounded-full text-sm">{tag}</span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">People Also Ask (FAQs)</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">1. How to compress JPG to 40KB online free?</h3>
                                    <p className="text-muted-foreground">Use an online image compressor tool. Upload your image, set 40KB as the target, and download the compressed file instantly.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">2. Can I compress JPEG to 40KB without losing quality?</h3>
                                    <p className="text-muted-foreground">Yes, modern tools use smart compression algorithms to maintain visual quality while reducing file size.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">3. What dimensions should a 40KB photo have?</h3>
                                    <p className="text-muted-foreground">There is no fixed size. It depends on compression level, but typically: Passport photo: 200x200 to 600x600 px</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">4. Can I convert PDF to JPG and compress to 40KB?</h3>
                                    <p className="text-muted-foreground">Yes, use a PDF to JPG converter, then compress the image using a jpg compressor to 40kb.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">5. Why is my image still too large after compression?</h3>
                                    <p className="text-muted-foreground">Possible reasons: High resolution, Poor compression tool, Incorrect format</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-primary/5 p-8 md:p-12 rounded-[2.5rem] border border-primary/20 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Final Thoughts: Compress JPG to 40KB Instantly</h2>
                            <p className="text-muted-foreground text-lg mb-4 max-w-3xl mx-auto leading-relaxed">
                                If you’re tired of upload errors, image rejected messages, or struggling with file limits, the solution is simple: compress JPG to 40KB using a reliable online tool.
                            </p>
                            <p className="text-muted-foreground text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                                Whether you’re submitting a job application, completing KYC verification, or uploading documents to government portals, having the right image size is crucial.
                            </p>
                            <div className="flex flex-col items-center gap-3">
                                <p className="font-bold">🚀 Try it now - no signup needed</p>
                                <p className="font-bold">📤 Upload your image and get instant results</p>
                                <p className="font-bold">🔒 100% secure & private</p>
                            </div>
                            <p className="text-xl font-bold text-primary mt-8">
                                Make your uploads smooth, fast, and error-free today!
                            </p>
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

export default JPGCompress40kb;
