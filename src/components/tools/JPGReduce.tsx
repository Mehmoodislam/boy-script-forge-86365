import { useState } from "react";
import { Image as ImageIcon, Upload, Download, CheckCircle2, X, Layers, List, ArrowDown } from "lucide-react";
import imageCompression from "browser-image-compression";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import OtherCompressionSizes from "@/components/OtherCompressionSizes";

interface ReducedResult {
    id: string;
    originalName: string;
    originalSize: number;
    reducedSize: number;
    reducedFile: File;
    previewUrl: string;
    status: "reducing" | "completed" | "error";
    error?: string;
    progress: number;
}

const JPGReduce = () => {
    const [results, setResults] = useState<ReducedResult[]>([]);
    const [targetKB, setTargetKB] = useState<number>(100);
    const [isProcessing, setIsProcessing] = useState(false);

    const pageTitle = "Reduce JPG Image Size Online Fast & Free - SmallJPG";
    const metaDescription = "Reduce any JPG image size instantly without losing quality. Batch process multiple photos, secure 100% client-side compression directly in your browser.";

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

        const validFiles = Array.from(files).filter((file) =>
            file.type.match(/image\/jpe?g/)
        );

        if (validFiles.length === 0) {
            toast.error("Please upload JPG/JPEG files only.");
            return;
        }

        setIsProcessing(true);

        const initialResults: ReducedResult[] = validFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            originalName: file.name,
            originalSize: file.size,
            reducedSize: 0,
            reducedFile: file,
            previewUrl: "",
            status: "reducing",
            progress: 0,
        }));

        setResults((prev) => [...prev, ...initialResults]);

        for (const item of initialResults) {
            const fileToProcess = validFiles.find((f) => f.name === item.originalName);
            if (!fileToProcess) continue;

            try {
                const options = {
                    maxSizeMB: targetKB / 1024,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.8,
                    onProgress: (percent: number) => {
                        setResults((prev) =>
                            prev.map((r) =>
                                r.id === item.id ? { ...r, progress: percent } : r
                            )
                        );
                    },
                };

                const compressedFile = await imageCompression(fileToProcess, options);
                const previewUrl = URL.createObjectURL(compressedFile);

                setResults((prev) =>
                    prev.map((r) =>
                        r.id === item.id
                            ? {
                                ...r,
                                reducedSize: compressedFile.size,
                                reducedFile: new File([compressedFile], item.originalName, {
                                    type: "image/jpeg",
                                }),
                                previewUrl: previewUrl,
                                status: "completed",
                                progress: 100,
                            }
                            : r
                    )
                );
            } catch (err) {
                toast.error(`Error processing ${item.originalName}`);
                setResults((prev) =>
                    prev.map((r) =>
                        r.id === item.id ? { ...r, status: "error", progress: 0 } : r
                    )
                );
            }
        }

        setIsProcessing(false);
        toast.success("Batch reduction complete!");
    };

    const downloadImage = (result: ReducedResult) => {
        const link = document.createElement("a");
        link.href = result.previewUrl;
        link.download = `reduced_${result.originalName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAll = () => {
        const completed = results.filter((r) => r.status === "completed");
        completed.forEach((result, index) => {
            setTimeout(() => downloadImage(result), index * 300);
        });
    };

    const clearAll = () => {
        results.forEach((r) => {
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
                            <ArrowDown className="h-8 w-8 text-primary group-hover:-translate-y-1 transition-transform" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Reduce JPG Image Size
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Instantly reduce the size of your JPG photos without compromising clarity. Fast, secure, and 100% free.
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
                                        <p className="mb-2 text-lg font-bold">Select Images to Reduce</p>
                                        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                            <List className="h-4 w-4" />
                                            Supports multiple JPG/JPEG images
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
                                    <span className="text-xs font-bold text-muted-foreground uppercase">Max Target</span>
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
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button variant="outline" onClick={clearAll} className="flex-1 sm:flex-none">Clear All</Button>
                                    <Button onClick={downloadAll} className="flex-1 sm:flex-none">Download All</Button>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-accent/10">
                                            <tr>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Preview</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">File Name</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Initial Size</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Reduced Size</th>
                                                <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {results.map((result) => (
                                                <tr key={result.id} className="group hover:bg-accent/5 transition-colors">
                                                    <td className="p-5">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-accent/5 flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt="Preview" className="w-full h-full object-cover" loading="lazy" />
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
                                                                <span className="text-sm font-bold text-primary">{formatSize(result.reducedSize)}</span>
                                                                <span className="text-[10px] font-bold text-green-500 uppercase">
                                                                    Reduced {Math.round(((result.originalSize - result.reducedSize) / result.originalSize) * 100)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <Progress value={result.progress} className="h-1.5 w-24" />
                                                                <span className="text-xs italic text-muted-foreground">Reducing...</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => downloadImage(result)}
                                                            disabled={result.status !== "completed"}
                                                            className="rounded-lg"
                                                        >
                                                            Download
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
                        <section className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8">Efficient JPG Reduction for Any Purpose</h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
                                <p>
                                    Our **JPG Reducer** is designed for speed and simplicity. Whether you're a photographer looking to share images online or a student submitting a profile, reducing image weight is crucial. SmallJPG uses advanced browser-side compression, meaning your images never leave your computer, ensuring total privacy.
                                </p>
                                <p>
                                    Batch processing allows you to handle hundreds of images in a single session. Our algorithm balances file size and visual fidelity, so your reduced images stay crisp and professional.
                                </p>
                            </div>
                        </section>

                        <section className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                { title: "No Quality Loss", desc: "Our smart algorithms preserve details while cutting the weight.", icon: CheckCircle2 },
                                { title: "100% Secure", desc: "Files are processed locally in your browser. No server uploads.", icon: Layers },
                                { title: "Unlimited Use", desc: "Reduce as many images as you need without any restrictions.", icon: List },
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-card border border-border rounded-[2rem] hover:shadow-lg transition-all">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-6 font-primary text-primary">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </section>

                        <OtherCompressionSizes />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JPGReduce;
