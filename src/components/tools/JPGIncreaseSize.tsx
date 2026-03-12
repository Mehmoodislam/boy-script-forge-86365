import { useState } from "react";
import { Image as ImageIcon, Upload, Download, FileJson, CheckCircle2, AlertCircle, Trash2, ArrowRight, X, Layers, List } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import OtherCompressionSizes from "@/components/OtherCompressionSizes";

interface ResizedResult {
    id: string;
    originalName: string;
    originalSize: number;
    finalSize: number;
    resizedFile: File;
    previewUrl: string;
    status: "processing" | "completed" | "error";
    error?: string;
    progress: number;
}

const JPGIncreaseSize = () => {
    const [results, setResults] = useState<ResizedResult[]>([]);
    const [targetKB, setTargetKB] = useState<number>(100);
    const [isProcessing, setIsProcessing] = useState(false);

    const pageTitle = "Increase JPG Size to 100kb, 200kb or any specific size - SmallJPG";
    const metaDescription = "Effortlessly increase JPG image size to 50kb, 100kb, 200kb or any other size. Perfect for job applications and portal uploads requiring specific file sizes.";

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
        const validFiles = newFiles.filter(file => file.type.match(/image\/jpe?g|image\/png/));

        if (validFiles.length < newFiles.length) {
            toast.error(`${newFiles.length - validFiles.length} file(s) skipped (not JPG/PNG).`);
        }

        if (validFiles.length === 0) return;

        setIsProcessing(true);
        const targetBytes = targetKB * 1024;

        const initialResults: ResizedResult[] = validFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            originalName: file.name,
            originalSize: file.size,
            finalSize: 0,
            resizedFile: file,
            previewUrl: "",
            status: "processing",
            progress: 0,
        }));

        setResults(prev => [...prev, ...initialResults]);

        for (const item of initialResults) {
            const file = validFiles.find(f => f.name === item.originalName);
            if (!file) continue;

            try {
                const arrayBuffer = await file.arrayBuffer();
                const originalBytes = new Uint8Array(arrayBuffer);

                let finalBytes: Uint8Array;

                if (originalBytes.length >= targetBytes) {
                    // If already bigger, just keep it but inform user? 
                    // For now, we just pass it through.
                    finalBytes = originalBytes;
                } else {
                    // Create a new buffer with target size
                    finalBytes = new Uint8Array(targetBytes);
                    finalBytes.set(originalBytes);

                    // Fill remaining bytes with 0 or random data
                    // Padding after EOI (0xFF 0xD9) is safe
                    for (let i = originalBytes.length; i < targetBytes; i++) {
                        finalBytes[i] = 0;
                    }
                }

                const resizedBlob = new Blob([finalBytes as any], { type: file.type });
                const previewUrl = URL.createObjectURL(resizedBlob);
                const resizedFile = new File([resizedBlob], file.name, { type: file.type });

                setResults(prev => prev.map(r => r.id === item.id ? {
                    ...r,
                    finalSize: resizedBlob.size,
                    resizedFile: resizedFile,
                    previewUrl: previewUrl,
                    status: "completed",
                    progress: 100
                } : r));

            } catch (err: any) {
                console.error(err);
                setResults(prev => prev.map(r => r.id === item.id ? { ...r, status: "error", error: "Failed to process" } : r));
            }
        }

        setIsProcessing(false);
        toast.success("Processing complete!");
    };

    const downloadImage = (result: ResizedResult) => {
        const link = document.createElement("a");
        link.href = result.previewUrl;
        link.download = `enlarged_${result.originalName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearAll = () => {
        results.forEach(r => {
            if (r.previewUrl) URL.revokeObjectURL(r.previewUrl);
        });
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-background text-foreground tracking-tight">
            <SEOHead title={pageTitle} description={metaDescription} />
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 mb-6 group">
                            <Layers className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Increase JPG Size to Specific KB
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Effortlessly increase JPG size to 50kb, 100kb, 200kb or any other size. Perfect for portal uploads.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-10 items-end animate-in fade-in fill-mode-both duration-700 delay-150">
                        <div className="md:col-span-3 space-y-4">
                            <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all hover:shadow-primary/5">
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-muted/50 rounded-[2rem] cursor-pointer hover:bg-accent/5 hover:border-primary/50 transition-all group relative z-10"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="p-4 rounded-3xl bg-primary/10 mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <p className="mb-2 text-lg font-bold">Upload Multiple JPG or PNG Images</p>
                                        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                            <List className="h-4 w-4" />
                                            Select or Drag & Drop Images Here
                                        </p>
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png"
                                        multiple
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-card border border-border rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
                                <label className="block text-sm font-bold mb-3 text-muted-foreground uppercase tracking-widest">
                                    Target Size (KB)
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={targetKB}
                                        onChange={(e) => setTargetKB(Number(e.target.value))}
                                        className="text-2xl font-black h-14 bg-accent/5 border-none focus-visible:ring-primary rounded-xl"
                                    />
                                    <span className="font-black text-xl text-primary">KB</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs font-bold text-muted-foreground uppercase">Current Target</span>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md">{targetKB} KB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {results.length > 0 && (
                        <div className="space-y-6 animate-in fade-in fill-mode-both duration-500">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-accent/5 p-4 rounded-2xl border border-border">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
                                        {results.length} Files Selected
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={clearAll}
                                    className="border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
                                >
                                    Clear All
                                </Button>
                            </div>

                            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-accent/10">
                                            <tr>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Preview</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">File Info</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Old Size</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">New Size</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {results.map((result) => (
                                                <tr key={result.id} className="group hover:bg-accent/5 transition-colors">
                                                    <td className="p-5">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-accent/5 flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-muted/30" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-sm font-bold truncate max-w-[150px]">{result.originalName}</td>
                                                    <td className="p-5 text-sm text-muted-foreground hidden md:table-cell">{formatSize(result.originalSize)}</td>
                                                    <td className="p-5">
                                                        {result.status === "completed" ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-primary">{formatSize(result.finalSize)}</span>
                                                                <span className="text-[10px] font-bold text-accent uppercase">
                                                                    Increased {Math.round(((result.finalSize - result.originalSize) / result.originalSize) * 100)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <Progress value={result.progress} className="h-1.5 w-24" />
                                                        )}
                                                    </td>
                                                    <td className="p-5 text-right space-x-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => downloadImage(result)}
                                                            className="rounded-lg shadow-lg shadow-primary/10"
                                                            disabled={result.status !== "completed"}
                                                        >
                                                            Download
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => clearAll()}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
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

                    <div className="mt-20 space-y-20">
                        {/* SEO Content Section */}
                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8">Increase JPG Size to 100kb, 200kb or Any size</h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
                                <p>
                                    SmallJPG is a browser-based tool that allows users to increase the size of their images in kilobytes to specific sizes, such as 50kb, 100kb, and 200kb. This tool is particularly useful for individuals who want to upload images for job applications on government portals or for school/college admissions, as there are often restrictions on photo size uploads.
                                </p>
                                <p>
                                    Users can process multiple photos at once, making it a convenient tool for batch processing. Our smart padding algorithm ensures your image remains valid and viewable while meeting the strict minimum size requirements of various online forms.
                                </p>
                            </div>
                        </section>

                        <section className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black tracking-tight">How to Increase JPG Size?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Upload your image: Begin by selecting your JPEG/PNG file.",
                                        "Select desired file size: Enter your target KB value.",
                                        "Click 'Resize' (automatic): The tool processes instantly.",
                                        "Download: Get your increased size image ready for use."
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                                                {i + 1}
                                            </div>
                                            <p className="text-muted-foreground font-medium">{step}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all" />
                                <div className="relative bg-card border border-border p-8 rounded-[3rem] shadow-2xl space-y-6">
                                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        <span>Comparison View</span>
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded">Example</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="aspect-square bg-accent/10 rounded-2xl border border-dashed border-muted/50 flex items-center justify-center overflow-hidden grayscale">
                                                <img src="/assets/boy116.webp" alt="Old" className="opacity-50" />
                                            </div>
                                            <p className="text-center font-black text-orange-500">20 KB</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="aspect-square bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center overflow-hidden">
                                                <img src="/assets/boy116.webp" alt="New" />
                                            </div>
                                            <p className="text-center font-black text-primary">100 KB</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-accent/5 rounded-2xl flex items-center gap-3">
                                        <div className="p-2 bg-primary/20 rounded-lg">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <p className="text-xs font-bold text-muted-foreground">Increased size while preserving quality.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-accent/5 p-12 rounded-[3rem] border border-border relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                            <h3 className="text-2xl font-bold mb-8">Key Features of JPG Resizer</h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { title: "Batch Processing", desc: "Enlarge hundreds of photos in one go." },
                                    { title: "Custom KB Size", desc: "Manually set any target like 50kb, 100kb, etc." },
                                    { title: "100% Client-Side", desc: "No uploads to servers. Private and secure." },
                                    { title: "Fast Instant Resize", desc: "Processing happens in milliseconds." },
                                    { title: "Format Support", desc: "Works perfectly with JPG, JPEG, and PNG." },
                                    { title: "Free Always", desc: "No subscriptions, no hidden limits." }
                                ].map((feature, i) => (
                                    <div key={i} className="space-y-2">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="text-center space-y-6 py-10">
                            <h3 className="text-3xl font-bold">Conclusion</h3>
                            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                                SmallJPG stands as a reliable companion for users encountering image size challenges during essential application submissions. Enabling users to increase image sizes to specific requirements streamlines the process and saves users' time. Simplify your experience in enlarging image sizes with SmallJPG!
                            </p>
                        </section>

                        <OtherCompressionSizes />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JPGIncreaseSize;
