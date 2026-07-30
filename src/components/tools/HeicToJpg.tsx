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
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead
                title="HEIC to JPG Converter — Free, Instant & Private (No Upload) | FreeImagePrompt"
                description="Convert HEIC to JPG free, right in your browser. No upload, no signup, no watermark. Works on iPhone photos instantly — your files never leave your device."
                canonicalUrl={PAGE_URL}
                schema={schema as unknown as object}
            />
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
                            Convert HEIC to JPG — Free, Instant, No Upload
                        </h1>
                        <p className="prose-editorial text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed mb-6">
                            Drop in your iPhone photos and get standard JPG files back in seconds. Nothing is uploaded to a
                            server — the conversion happens on your own device.
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
                            htmlFor="heic-upload"
                            className="flex flex-col items-center justify-center w-full py-10 border border-dashed border-[#DDD9CE] rounded-xl cursor-pointer hover:bg-[#FAF9F5] transition-all group"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                convertFiles(e.dataTransfer.files);
                            }}
                        >
                            <div className="mb-4 text-rose-500">
                                <svg className="w-10 h-10 mx-auto stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold text-[#1C1917] mb-1">
                                Drop HEIC or HEIF files here
                            </p>
                            <p className="text-sm text-[#78716C] mb-6 font-mono">
                                or click to browse — accepts <span className="font-bold text-[#1C1917]">.heic</span> and <span className="font-bold text-[#1C1917]">.heif</span>
                            </p>
                            <span className="px-6 py-2.5 rounded-lg bg-[#1C1917] text-white text-sm font-semibold hover:bg-black transition-colors shadow-sm">
                                Choose Photos
                            </span>
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
                        <div className="space-y-6 mb-16">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-[#E6E2D8]">
                                <span className="text-xs font-mono font-bold px-3 py-1 bg-[#F5F3ED] text-[#1C1917] rounded-full">
                                    {results.length} Files Selected
                                </span>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button variant="outline" onClick={clearAll} disabled={isProcessing} className="flex-1 sm:flex-none text-xs">
                                        Clear All
                                    </Button>
                                    <Button
                                        onClick={downloadAllZip}
                                        disabled={isProcessing || results.filter((r) => r.status === "completed").length === 0}
                                        className="flex-1 sm:flex-none gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download All (ZIP)
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#FAF9F5] border-b border-[#E6E2D8]">
                                            <tr>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">Preview</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">Output File</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] hidden md:table-cell">Size</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">Status</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E6E2D8]">
                                            {results.map((result) => (
                                                <tr key={result.id} className="group hover:bg-[#FAF9F5] transition-colors">
                                                    <td className="p-4">
                                                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E6E2D8] bg-[#F5F3ED] flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt={`Converted JPG preview of ${result.originalName}`} className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs text-[#1C1917]">
                                                            {result.originalName.replace(/\.(heic|heif)$/i, ".jpg")}
                                                        </p>
                                                        <p className="text-xs text-[#78716C]">{formatSize(result.originalSize)} original</p>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <span className="text-sm font-semibold text-emerald-700">{formatSize(result.convertedSize)}</span>
                                                        ) : (
                                                            <span className="text-xs text-[#78716C] italic">Converting...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {result.status === "converting" && (
                                                            <div className="w-24"><Progress value={result.progress} className="h-1.5" /></div>
                                                        )}
                                                        {result.status === "completed" && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase border border-emerald-200">
                                                                <CheckCircle2 className="h-3 w-3" /> Success
                                                            </span>
                                                        )}
                                                        {result.status === "error" && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-mono font-bold uppercase border border-rose-200">
                                                                <AlertCircle className="h-3 w-3" /> Failed
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right space-x-1">
                                                        {result.status === "completed" && (
                                                            <Button size="sm" variant="ghost" onClick={() => downloadImage(result)} className="h-8 w-8 p-0 rounded-lg text-[#78716C] hover:text-[#1C1917]" title="Download JPG">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="ghost" onClick={() => removeResult(result.id)} className="h-8 w-8 p-0 rounded-lg text-[#78716C] hover:text-rose-600" title="Remove">
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

                    <div className="prose-editorial text-left space-y-10 border-t border-[#E6E2D8] pt-12">
                        <p>
                            A <strong className="text-[#1C1917]">HEIC file</strong> is Apple's default photo format on iPhone — it holds the same image quality as a JPG at roughly half the file size. The trade-off is compatibility: many websites, older devices, and non-Apple apps can't open HEIC files directly. Converting to <strong className="text-[#1C1917]">JPG</strong> fixes that instantly, and this tool does it without ever sending your photo to a server.
                        </p>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">What Is a HEIC File?</h2>
                            <p>
                                HEIC stands for High Efficiency Image Container, Apple's implementation of the HEIF (High Efficiency Image Format) standard. Since iOS 11, it has been the default format for photos taken on iPhone, chosen because it compresses images more efficiently than JPG while keeping more visual detail. The downside is that HEIC isn't universally supported — Windows apps, many web uploaders, and older software often reject it outright.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Why Convert HEIC to JPG?</h2>
                            <ul className="space-y-3 list-disc pl-5">
                                <li><strong className="text-[#1C1917]">Compatibility:</strong> JPG opens on virtually every device, browser, and app ever made.</li>
                                <li><strong className="text-[#1C1917]">Uploading:</strong> Many websites and online forms silently reject HEIC files or fail to preview them.</li>
                                <li><strong className="text-[#1C1917]">Editing:</strong> Older photo editors and design tools often can't open HEIC at all.</li>
                                <li><strong className="text-[#1C1917]">Sharing:</strong> Sending a HEIC photo to a Windows or Android user can show up as a blank or unreadable file.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">How to Convert HEIC to JPG Online</h2>
                            <ol className="space-y-3 list-decimal pl-5">
                                <li><strong className="text-[#1C1917]">Add your photos.</strong> Drag your HEIC or HEIF files into the box above, or tap "Choose Photos."</li>
                                <li><strong className="text-[#1C1917]">Wait a moment.</strong> Each photo converts right in your browser — usually under two seconds per file.</li>
                                <li><strong className="text-[#1C1917]">Download JPGs.</strong> Save your converted JPG files individually or all together in a single ZIP file.</li>
                            </ol>
                        </div>

                        <div className="bg-[#FAF6EC] border-l-4 border-amber-500 p-5 rounded-r-xl my-8 text-sm md:text-base">
                            <p className="m-0 text-[#574E43]">
                                <strong className="text-[#1C1917]">Why this matters for privacy:</strong> because conversion happens on your device using your browser's own processing power, your photos are never transmitted anywhere. That also means it keeps working even on a slow connection, since there's nothing to upload.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">HEIC vs. JPG: Key Differences</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse text-left bg-white border border-[#E6E2D8] rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-[#FAF9F5] border-b border-[#E6E2D8] text-xs font-mono uppercase text-[#78716C]">
                                            <th className="p-3">Feature</th>
                                            <th className="p-3">HEIC</th>
                                            <th className="p-3">JPG</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E2D8]">
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">File size</td>
                                            <td className="p-3">Smaller for equal quality</td>
                                            <td className="p-3">Larger for equal quality</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Compatibility</td>
                                            <td className="p-3">Apple devices, newer software</td>
                                            <td className="p-3 font-semibold text-[#1C1917]">Universal support</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Editing support</td>
                                            <td className="p-3">Limited outside Apple apps</td>
                                            <td className="p-3">Supported everywhere</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Web uploads</td>
                                            <td className="p-3">Often rejected</td>
                                            <td className="p-3">Accepted everywhere</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-6 divide-y divide-[#E6E2D8]">
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Is this HEIC to JPG converter really free?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">Yes. There's no limit on how many files you convert, no watermark added to your photos, and no account required.</p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Do my photos get uploaded to a server?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">No. Conversion happens entirely inside your browser using your device's own processing power — your photos are never sent anywhere.</p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Can I convert multiple HEIC files at once?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">Yes — drag in as many files as you like, convert them together, and download them all at once as a ZIP file.</p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Does this work on Windows and Android, not just iPhone?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">Yes. The converter runs in any modern browser, so you can convert HEIC files on Windows, Mac, Android, or iPhone.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">Related Tools</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "PNG to JPG Converter", link: "/tools/png-to-jpg" },
                                    { title: "JPG to WebP Converter", link: "/tools/jpg-to-webp" },
                                    { title: "PNG to WebP Converter", link: "/tools/png-to-webp" },
                                    { title: "Compress JPG to 20KB", link: "/tools/compress-jpg-to-20kb" }
                                ].map((tool, idx) => (
                                    <Link key={idx} to={tool.link} className="block p-5 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors group">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 block mb-1">TOOL</span>
                                        <span className="font-bold text-[#1C1917] group-hover:text-rose-600 transition-colors">{tool.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Further Reading</h2>
                            <ul className="space-y-2 list-disc pl-5 text-sm">
                                <li><a href="https://support.apple.com/en-us/HT207022" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">Apple Support: About HEIF and HEVC media formats</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/High_Efficiency_Image_File_Format" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">Wikipedia: High Efficiency Image File Format</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HeicToJpg;
