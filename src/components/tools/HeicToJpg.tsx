import { useState } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon, Upload, Download, CheckCircle2, AlertCircle, Trash2, Replace, List } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import OtherConverters from "@/components/OtherConverters";

interface ConvertedResult {
    id: string;
    originalName: string;
    originalSize: number;
    convertedSize: number;
    previewUrl: string;
    blob?: Blob;
    status: "converting" | "completed" | "error";
    error?: string;
    progress: number;
}

const PAGE_URL = "https://freeimageprompt.com/tools/heic-to-jpg";

const schema = [
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "HEIC to JPG Converter",
        url: PAGE_URL,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any (runs in browser)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
            "A free, browser-based tool that converts HEIC and HEIF photos to JPG without uploading files to a server.",
    },
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Convert HEIC to JPG Online",
        step: [
            { "@type": "HowToStep", name: "Add your photos", text: "Drag your HEIC or HEIF files into the converter, or tap the box to choose them from your device." },
            { "@type": "HowToStep", name: "Wait for conversion", text: "The tool converts each file to JPG directly in your browser, usually in under two seconds per photo." },
            { "@type": "HowToStep", name: "Download your JPGs", text: "Download each photo individually, or use Download All to save every converted file at once." },
        ],
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            { "@type": "Question", name: "Is this HEIC to JPG converter really free?", acceptedAnswer: { "@type": "Answer", text: "Yes. There is no limit on the number of files, no watermark added, and no account required." } },
            { "@type": "Question", name: "Do my photos get uploaded to a server?", acceptedAnswer: { "@type": "Answer", text: "No. Conversion happens entirely inside your browser using your device's own processing power. Your photos are never sent anywhere." } },
            { "@type": "Question", name: "Why do iPhone photos save as HEIC instead of JPG?", acceptedAnswer: { "@type": "Answer", text: "Apple switched to HEIC by default in iOS 11 because it stores the same image quality in roughly half the file size of a JPG, saving storage space." } },
            { "@type": "Question", name: "Will converting HEIC to JPG reduce image quality?", acceptedAnswer: { "@type": "Answer", text: "There is a very small quality loss because JPG uses different compression than HEIC, but at high quality settings it is not visible to the eye." } },
            { "@type": "Question", name: "Can I convert multiple HEIC files at once?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can drag in as many files as you like and convert them together, then download them all at once as a ZIP file." } },
            { "@type": "Question", name: "Does this tool work on Windows and Android, not just iPhone?", acceptedAnswer: { "@type": "Answer", text: "Yes. The converter runs in any modern browser, so you can convert HEIC files on Windows, Mac, Android, or iPhone." } },
        ],
    },
];

const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const isHeic = (file: File) => {
    const name = file.name.toLowerCase();
    return (
        name.endsWith(".heic") ||
        name.endsWith(".heif") ||
        file.type === "image/heic" ||
        file.type === "image/heif"
    );
};

const HeicToJpg = () => {
    const [results, setResults] = useState<ConvertedResult[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const convertFiles = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const all = Array.from(fileList);
        const valid = all.filter(isHeic);

        if (valid.length < all.length) {
            toast.error(`${all.length - valid.length} file(s) skipped — only HEIC/HEIF files are supported.`);
        }
        if (valid.length === 0) return;

        setIsProcessing(true);

        const initial: ConvertedResult[] = valid.map((file) => ({
            id: Math.random().toString(36).substring(7),
            originalName: file.name,
            originalSize: file.size,
            convertedSize: 0,
            previewUrl: "",
            status: "converting",
            progress: 20,
        }));
        setResults((prev) => [...prev, ...initial]);

        const { default: heic2any } = await import("heic2any");

        for (let i = 0; i < valid.length; i++) {
            const file = valid[i];
            const item = initial[i];
            try {
                const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
                const blob = (Array.isArray(out) ? out[0] : out) as Blob;
                const previewUrl = URL.createObjectURL(blob);
                setResults((prev) =>
                    prev.map((r) =>
                        r.id === item.id
                            ? { ...r, blob, previewUrl, convertedSize: blob.size, status: "completed", progress: 100 }
                            : r
                    )
                );
            } catch (err: any) {
                setResults((prev) =>
                    prev.map((r) =>
                        r.id === item.id
                            ? { ...r, status: "error", error: err?.message || "Conversion failed" }
                            : r
                    )
                );
                toast.error(`Failed: ${file.name}`);
            }
        }

        setIsProcessing(false);
        toast.success("Conversion complete!");
    };

    const downloadImage = (result: ConvertedResult) => {
        if (!result.previewUrl) return;
        const link = document.createElement("a");
        link.href = result.previewUrl;
        link.download = result.originalName.replace(/\.[^/.]+$/, "") + ".jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAllZip = async () => {
        const completed = results.filter((r) => r.status === "completed" && r.blob);
        if (completed.length === 0) return;
        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();
        completed.forEach((r) => {
            zip.file(r.originalName.replace(/\.[^/.]+$/, "") + ".jpg", r.blob as Blob);
        });
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "heic-to-jpg.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const removeResult = (id: string) => {
        setResults((prev) => {
            const item = prev.find((r) => r.id === id);
            if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
            return prev.filter((r) => r.id !== id);
        });
    };

    const clearAll = () => {
        results.forEach((r) => r.previewUrl && URL.revokeObjectURL(r.previewUrl));
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                title="HEIC to JPG Converter — Free, Instant & Private (No Upload) | FreeImagePrompt"
                description="Convert HEIC to JPG free, right in your browser. No upload, no signup, no watermark. Works on iPhone photos instantly — your files never leave your device."
                canonicalUrl={PAGE_URL}
                schema={schema as unknown as object}
            />
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 mb-6 group">
                            <Replace className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
                        </div>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                            Free Tool · Runs In Your Browser
                        </p>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Convert HEIC to JPG — Free, Instant, No Upload
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Drop in your iPhone photos and get standard JPG files back in seconds. Nothing is uploaded to a
                            server — the conversion happens on your own device.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            {["100% FREE", "NO SIGNUP", "NO WATERMARK", "FILES NEVER UPLOADED", "UNLIMITED CONVERSIONS"].map((b) => (
                                <span key={b} className="text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-primary/10 relative overflow-hidden mb-10 transition-all hover:shadow-primary/20">
                        <label
                            htmlFor="heic-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-muted/50 rounded-[2rem] cursor-pointer hover:bg-accent/5 hover:border-primary/50 transition-all group relative z-10"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                convertFiles(e.dataTransfer.files);
                            }}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-4 rounded-3xl bg-primary/10 mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                    <Upload className="h-10 w-10 text-primary" />
                                </div>
                                <p className="mb-3 text-xl font-bold">Drop HEIC or HEIF files here</p>
                                <p className="text-muted-foreground font-medium flex items-center gap-2">
                                    <List className="h-4 w-4" />
                                    Only .heic and .heif files are accepted
                                </p>
                            </div>
                            <input
                                id="heic-upload"
                                type="file"
                                className="hidden"
                                accept=".heic,.heif,image/heic,image/heif"
                                multiple
                                onChange={(e) => convertFiles(e.target.files)}
                            />
                        </label>
                    </div>

                    {results.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-accent/5 p-4 rounded-2xl border border-border">
                                <span className="text-sm font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
                                    {results.length} Files Selected
                                </span>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button variant="outline" onClick={clearAll} disabled={isProcessing} className="flex-1 sm:flex-none">
                                        Clear All
                                    </Button>
                                    <Button
                                        onClick={downloadAllZip}
                                        disabled={isProcessing || results.filter((r) => r.status === "completed").length === 0}
                                        className="flex-1 sm:flex-none gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download All (ZIP)
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
                                                                <img src={result.previewUrl} alt={`Converted JPG preview of ${result.originalName}`} className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-muted/30" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs">
                                                            {result.originalName.replace(/\.(heic|heif)$/i, ".jpg")}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{formatSize(result.originalSize)} original</p>
                                                    </td>
                                                    <td className="p-5 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <span className="text-sm font-bold text-primary">{formatSize(result.convertedSize)}</span>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground italic">Converting...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-5">
                                                        {result.status === "converting" && (
                                                            <div className="w-24"><Progress value={result.progress} className="h-1.5" /></div>
                                                        )}
                                                        {result.status === "completed" && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase border border-green-500/20">
                                                                <CheckCircle2 className="h-3 w-3" /> Success
                                                            </span>
                                                        )}
                                                        {result.status === "error" && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold uppercase border border-destructive/20">
                                                                <AlertCircle className="h-3 w-3" /> Failed
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-5 text-right space-x-2">
                                                        {result.status === "completed" && (
                                                            <Button size="sm" variant="ghost" onClick={() => downloadImage(result)} className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10" title="Download JPG">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="ghost" onClick={() => removeResult(result.id)} className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Remove">
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

                    <article className="prose prose-lg dark:prose-invert max-w-none mt-16">
                        <p className="lead">
                            A <strong>HEIC file</strong> is Apple's default photo format on iPhone — it holds the same image
                            quality as a JPG at roughly half the file size. The trade-off is compatibility: many websites, older
                            devices, and non-Apple apps can't open HEIC files directly. Converting to <strong>JPG</strong> fixes
                            that instantly, and this tool does it without ever sending your photo to a server.
                        </p>

                        <h2>What Is a HEIC File?</h2>
                        <p>
                            HEIC stands for High Efficiency Image Container, Apple's implementation of the HEIF (High Efficiency
                            Image Format) standard. Since iOS 11, it has been the default format for photos taken on iPhone,
                            chosen because it compresses images more efficiently than JPG while keeping more visual detail. The
                            downside is that HEIC isn't universally supported — Windows apps, many web uploaders, and older
                            software often reject it outright.
                        </p>

                        <h2>Why Convert HEIC to JPG?</h2>
                        <ul>
                            <li><strong>Compatibility:</strong> JPG opens on virtually every device, browser, and app ever made.</li>
                            <li><strong>Uploading:</strong> Many websites and online forms silently reject HEIC files or fail to preview them.</li>
                            <li><strong>Editing:</strong> Older photo editors and design tools often can't open HEIC at all.</li>
                            <li><strong>Sharing:</strong> Sending a HEIC photo to a Windows or Android user can show up as a blank or unreadable file.</li>
                        </ul>

                        <h2>How to Convert HEIC to JPG Online</h2>
                        <ol>
                            <li><strong>Add your photos.</strong> Drag your HEIC or HEIF files into the box above, or tap "Choose Photos."</li>
                            <li><strong>Wait a moment.</strong> Each photo converts right in your browser — usually under two seconds per file.</li>
                            <li><strong>Download.</strong> Save each JPG individually, or use "Download All" to get every file in one ZIP.</li>
                        </ol>

                        <div className="not-prose my-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                            <p className="text-sm leading-relaxed">
                                <strong>Why this matters for privacy:</strong> because conversion happens on your device using your
                                browser's own processing power, your photos are never transmitted anywhere. That also means it keeps
                                working even on a slow connection, since there's nothing to upload.
                            </p>
                        </div>

                        <h2>HEIC vs. JPG: Key Differences</h2>
                        <table>
                            <thead>
                                <tr><th></th><th>HEIC</th><th>JPG</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>File size</td><td>Smaller for equal quality</td><td>Larger for equal quality</td></tr>
                                <tr><td>Compatibility</td><td>Apple devices, newer software</td><td>Universal support</td></tr>
                                <tr><td>Editing support</td><td>Limited outside Apple apps</td><td>Supported everywhere</td></tr>
                                <tr><td>Web uploads</td><td>Often rejected</td><td>Accepted everywhere</td></tr>
                            </tbody>
                        </table>

                        <h2>Frequently Asked Questions</h2>

                        <h3>Is this HEIC to JPG converter really free?</h3>
                        <p>Yes. There's no limit on how many files you convert, no watermark added to your photos, and no account required.</p>

                        <h3>Do my photos get uploaded to a server?</h3>
                        <p>No. Conversion happens entirely inside your browser using your device's own processing power — your photos are never sent anywhere.</p>

                        <h3>Why do iPhone photos save as HEIC instead of JPG?</h3>
                        <p>Apple switched to HEIC by default in iOS 11 because it stores the same image quality in roughly half the file size of a JPG, saving storage space on the device.</p>

                        <h3>Will converting HEIC to JPG reduce image quality?</h3>
                        <p>There's a very small quality difference because JPG uses different compression than HEIC, but at high quality settings it isn't visible to the eye.</p>

                        <h3>Can I convert multiple HEIC files at once?</h3>
                        <p>Yes — drag in as many files as you like, convert them together, and download them all at once as a ZIP file.</p>

                        <h3>Does this work on Windows and Android, not just iPhone?</h3>
                        <p>Yes. The converter runs in any modern browser, so you can convert HEIC files on Windows, Mac, Android, or iPhone.</p>

                        <h2>Related Tools</h2>
                        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                            {[
                                { to: "/tools/png-to-jpg", label: "PNG to JPG Converter" },
                                { to: "/tools/jpg-to-webp", label: "JPG to WebP Converter" },
                                { to: "/tools/png-to-webp", label: "PNG to WebP Converter" },
                                { to: "/tools/compress-jpg-to-20kb", label: "Compress JPG to 20KB" },
                            ].map((t) => (
                                <Link key={t.to} to={t.to} className="block rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition-colors">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Tool</span>
                                    <strong className="block text-sm mt-1">{t.label}</strong>
                                </Link>
                            ))}
                        </div>

                        <h2>Further Reading</h2>
                        <ul>
                            <li><a href="https://support.apple.com/en-us/HT207022" target="_blank" rel="noopener noreferrer">Apple Support: About HEIF and HEVC media formats</a></li>
                            <li><a href="https://en.wikipedia.org/wiki/High_Efficiency_Image_File_Format" target="_blank" rel="noopener noreferrer">Wikipedia: High Efficiency Image File Format</a></li>
                        </ul>
                    </article>

                    <OtherConverters />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HeicToJpg;
