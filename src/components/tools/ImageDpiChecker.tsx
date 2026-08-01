import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Image as ImageIcon,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ScanSearch,
    Ruler,
    Loader2,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";

interface DpiResult {
    id: string;
    originalName: string;
    fileSize: number;
    width: number;
    height: number;
    dpiX: number | null;
    dpiY: number | null;
    resolutionUnit: string;
    format: string;
    hasDpi: boolean;
    previewUrl: string;
    status: "analyzing" | "completed" | "error";
    error?: string;
}

const PAGE_URL = "https://freeimageprompt.com/tools/image-dpi-checker";

const schema = [
    {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Image DPI Checker: How to Check the DPI of Any Image Online (Free & Fast)",
        description:
            "Use our free image DPI checker to instantly find any photo's DPI online. Check if your image is 300 DPI print-ready in just a few seconds.",
        author: { "@type": "Organization", name: "FreeImagePrompt" },
        publisher: {
            "@type": "Organization",
            name: "FreeImagePrompt",
            logo: { "@type": "ImageObject", url: "https://freeimageprompt.com/logo.png" },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        datePublished: "2026-08-02",
        dateModified: "2026-08-02",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is a good DPI for printing photos?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "300 DPI is the standard for high-quality photo prints. Anything below 150 DPI tends to look noticeably blurry once printed.",
                },
            },
            {
                "@type": "Question",
                name: "Is DPI the same as image resolution?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Not exactly. Resolution refers to the total pixel dimensions of an image, while DPI describes how densely those pixels are packed when printed at a specific size. The same image can have different DPI values depending on the print size you choose.",
                },
            },
            {
                "@type": "Question",
                name: "Can I increase the DPI of a low-resolution image?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can technically raise the DPI number in an image's metadata, but this doesn't add real detail. For a genuine quality boost, you'd need an AI upscaling tool rather than a simple DPI checker.",
                },
            },
            {
                "@type": "Question",
                name: "How do I check the DPI of an image on my phone?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most mobile photo apps don't display DPI directly, so the easiest method is uploading the image to a mobile-friendly online DPI checker, which works the same way as on desktop.",
                },
            },
            {
                "@type": "Question",
                name: "Does DPI matter for images used only on websites?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Not much. Screens display images in pixels, not physical inches, so DPI has little effect on how an image looks online. What matters more for web images is the pixel dimension and file size.",
                },
            },
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

const formatDpi = (value: number | null) => {
    if (value === null) return "-";
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
};

const readJpegExif = (buffer: ArrayBuffer): { dpiX: number; dpiY: number; unit: string } | null => {
    const view = new DataView(buffer);
    const len = buffer.byteLength;
    if (len < 2 || view.getUint8(0) !== 0xff || view.getUint8(1) !== 0xd8) return null;

    let offset = 2;
    while (offset + 4 <= len) {
        if (view.getUint8(offset) !== 0xff) break;
        const marker = view.getUint8(offset + 1);
        if (marker === 0xff || marker === 0x00) {
            offset += 1;
            continue;
        }
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
            offset += 2;
            continue;
        }
        const segLen = view.getUint16(offset + 2);
        if (segLen < 2 || offset + 2 + segLen > len) break;
        if (marker === 0xe1) {
            const tiffStart = offset + 4;
            if (tiffStart + 6 <= len) {
                const isExif =
                    view.getUint8(tiffStart) === 0x45 &&
                    view.getUint8(tiffStart + 1) === 0x78 &&
                    view.getUint8(tiffStart + 2) === 0x69 &&
                    view.getUint8(tiffStart + 3) === 0x66 &&
                    view.getUint8(tiffStart + 4) === 0x00 &&
                    view.getUint8(tiffStart + 5) === 0x00;
                if (isExif) {
                    const dpi = parseTiff(view, tiffStart + 6, offset + 2 + segLen);
                    if (dpi) return dpi;
                }
            }
        }
        offset += 2 + segLen;
    }
    return null;
};

const parseTiff = (
    view: DataView,
    start: number,
    end: number
): { dpiX: number; dpiY: number; unit: string } | null => {
    if (start + 8 > end) return null;
    const order = view.getUint8(start);
    const le = order === 0x49 ? true : order === 0x4d ? false : null;
    if (le === null) return null;
    const u16 = (rel: number) => view.getUint16(start + rel, le);
    const u32 = (rel: number) => view.getUint32(start + rel, le);
    if (start + 6 > end || u16(2) !== 0x2a) return null;

    const ifd0Rel = u32(4);
    if (ifd0Rel + 2 > end - start) return null;
    const count = u16(ifd0Rel);

    let dpiX: number | null = null;
    let dpiY: number | null = null;
    let unit = "inch";

    for (let i = 0; i < count; i++) {
        const entryRel = ifd0Rel + 2 + i * 12;
        if (entryRel + 12 > end - start) break;
        const tag = u16(entryRel);
        const type = u16(entryRel + 2);
        const valueCount = u32(entryRel + 4);
        const valueRel = u32(entryRel + 8);

        if (tag === 0x0128 && type === 3 && valueCount >= 1) {
            unit = valueRel === 3 ? "cm" : valueRel === 2 ? "inch" : "none";
        } else if (tag === 0x011a && type === 5 && valueCount === 1) {
            const num = u32(valueRel);
            const den = u32(valueRel + 4);
            dpiX = den === 0 ? null : num / den;
        } else if (tag === 0x011b && type === 5 && valueCount === 1) {
            const num = u32(valueRel);
            const den = u32(valueRel + 4);
            dpiY = den === 0 ? null : num / den;
        }
    }

    if (dpiX === null) return { dpiX: dpiY as number, dpiY: dpiY as number, unit };
    if (dpiY === null) return { dpiX: dpiX as number, dpiY: dpiX as number, unit };
    return { dpiX, dpiY, unit };
};

const readPngDpi = (buffer: ArrayBuffer): { dpiX: number; dpiY: number; unit: string } | null => {
    const view = new DataView(buffer);
    if (buffer.byteLength < 8) return null;
    if (view.getUint32(0) !== 0x89504e47) return null;

    let offset = 8;
    while (offset + 8 <= buffer.byteLength) {
        const len = view.getUint32(offset);
        const type = view.getUint32(offset + 4);
        const dataStart = offset + 8;
        if (dataStart + len + 4 > buffer.byteLength) break;
        if (type === 0x70485973) {
            if (len >= 9) {
                const unit = view.getUint8(dataStart + 8);
                if (unit === 1) {
                    const xppm = view.getUint32(dataStart);
                    const yppm = view.getUint32(dataStart + 4);
                    return { dpiX: (xppm * 0.0254), dpiY: (yppm * 0.0254), unit: "inch" };
                }
            }
            break;
        }
        offset = dataStart + len + 4;
    }
    return null;
};

const readBmpDpi = (buffer: ArrayBuffer): { dpiX: number; dpiY: number; unit: string } | null => {
    const view = new DataView(buffer);
    if (buffer.byteLength < 54) return null;
    if (view.getUint16(0) !== 0x4d42) return null;
    const headerSize = view.getUint32(14);
    if (headerSize >= 40) {
        const xppm = view.getInt32(38);
        const yppm = view.getInt32(42);
        if (xppm > 0 && yppm > 0) {
            return { dpiX: xppm * 0.0254, dpiY: yppm * 0.0254, unit: "inch" };
        }
    }
    return null;
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not load image"));
        };
        img.src = url;
    });

const ImageDpiChecker = () => {
    const [results, setResults] = useState<DpiResult[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [printWidth, setPrintWidth] = useState("");

    const analyzeFiles = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const all = Array.from(fileList);
        const valid = all.filter((f) => f.type.startsWith("image/"));

        if (valid.length < all.length) {
            toast.error(`${all.length - valid.length} file(s) skipped - only image files are supported.`);
        }
        if (valid.length === 0) return;

        setIsProcessing(true);

        const initial: DpiResult[] = valid.map((file) => ({
            id: Math.random().toString(36).substring(7),
            originalName: file.name,
            fileSize: file.size,
            width: 0,
            height: 0,
            dpiX: null,
            dpiY: null,
            resolutionUnit: "",
            format: file.type || "image",
            hasDpi: false,
            previewUrl: "",
            status: "analyzing",
        }));
        setResults((prev) => [...prev, ...initial]);

        for (let i = 0; i < valid.length; i++) {
            const file = valid[i];
            const item = initial[i];
            try {
                const buffer = await file.arrayBuffer();
                let dpi = readJpegExif(buffer);
                if (!dpi) dpi = readPngDpi(buffer);
                if (!dpi) dpi = readBmpDpi(buffer);
                const { width, height } = await getImageDimensions(file);
                const previewUrl = URL.createObjectURL(file);
                setResults((prev) =>
                    prev.map((r) =>
                        r.id === item.id
                            ? {
                                  ...r,
                                  width,
                                  height,
                                  dpiX: dpi ? Math.round(dpi.dpiX * 100) / 100 : null,
                                  dpiY: dpi ? Math.round(dpi.dpiY * 100) / 100 : null,
                                  resolutionUnit: dpi?.unit ?? "",
                                  hasDpi: !!dpi,
                                  previewUrl,
                                  status: "completed",
                              }
                            : r
                    )
                );
            } catch (err: any) {
                setResults((prev) =>
                    prev.map((r) =>
                        r.id === item.id
                            ? { ...r, status: "error", error: err?.message || "Could not read this image" }
                            : r
                    )
                );
                toast.error(`Failed: ${file.name}`);
            }
        }

        setIsProcessing(false);
        toast.success("DPI check complete!");
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

    const printWidthNum = parseFloat(printWidth);
    const hasPrintWidth = !isNaN(printWidthNum) && printWidthNum > 0;

    const effectiveDpi = (r: DpiResult) =>
        hasPrintWidth && r.width > 0 ? Math.round(r.width / printWidthNum) : null;

    const isPrintReady = (r: DpiResult) => {
        if (hasPrintWidth) {
            const dpi = effectiveDpi(r);
            return dpi !== null && dpi >= 300;
        }
        return r.hasDpi && (r.dpiX ?? 0) >= 300;
    };

    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead
                title="Image DPI Checker – Check Any Photo's DPI Online Free | FreeImagePrompt"
                description="Use our free image DPI checker to instantly find any photo's DPI online. Check if your image is 300 DPI print-ready in just a few seconds."
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
                            Image DPI Checker - Check Any Photo's DPI Online Free
                        </h1>
                        <p className="prose-editorial text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed mb-6">
                            Drop in any photo and instantly see its DPI, pixel dimensions, and whether it's
                            300 DPI print-ready. Everything happens in your browser - nothing is uploaded.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["100% FREE", "NO SIGNUP", "NO WATERMARK", "FILES NEVER UPLOADED", "INSTANT RESULTS"].map((b) => (
                                <span key={b} className="text-[10px] font-mono font-semibold tracking-wider px-3 py-1.5 rounded-full bg-[#EFECE6] text-[#6B645C]">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-10 shadow-sm mb-12 text-center">
                        <label
                            htmlFor="dpi-upload"
                            className="flex flex-col items-center justify-center w-full py-10 border border-dashed border-[#DDD9CE] rounded-xl cursor-pointer hover:bg-[#FAF9F5] transition-all group"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                analyzeFiles(e.dataTransfer.files);
                            }}
                        >
                            <div className="mb-4 text-rose-500">
                                <svg className="w-10 h-10 mx-auto stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold text-[#1C1917] mb-1">
                                Drop your images here
                            </p>
                            <p className="text-sm text-[#78716C] mb-6 font-mono">
                                or click to browse - accepts JPG, PNG, BMP, TIFF & WebP
                            </p>
                            <span className="px-6 py-2.5 rounded-lg bg-[#1C1917] text-white text-sm font-semibold hover:bg-black transition-colors shadow-sm">
                                Choose Images
                            </span>
                            <input
                                id="dpi-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) => analyzeFiles(e.target.files)}
                            />
                        </label>
                    </div>

                    {results.length > 0 && (
                        <div className="space-y-6 mb-16">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-[#E6E2D8]">
                                <span className="text-xs font-mono font-bold px-3 py-1 bg-[#F5F3ED] text-[#1C1917] rounded-full">
                                    {results.length} File(s) Analyzed
                                </span>
                                <Button variant="outline" onClick={clearAll} disabled={isProcessing} className="flex-1 sm:flex-none text-xs">
                                    Clear All
                                </Button>
                            </div>

                            <div className="bg-[#FAF6EC] border-l-4 border-amber-500 p-4 rounded-r-xl text-left">
                                <label className="flex flex-wrap items-center gap-3 text-sm text-[#574E43]">
                                    <span className="inline-flex items-center gap-1.5 font-bold text-[#1C1917]">
                                        <Ruler className="h-4 w-4 text-amber-600" />
                                        Print width (inches):
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.1"
                                        placeholder="e.g. 6"
                                        value={printWidth}
                                        onChange={(e) => setPrintWidth(e.target.value)}
                                        className="w-24 px-3 py-2 rounded-lg border border-[#DDD9CE] bg-white text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                                    />
                                    <span className="text-xs text-[#78716C]">
                                        Enter a print size to see each image's effective DPI at that width.
                                    </span>
                                </label>
                            </div>

                            <div className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[#FAF9F5] border-b border-[#E6E2D8]">
                                            <tr>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">Preview</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">File</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">Dimensions</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">DPI</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] hidden md:table-cell">Status</th>
                                                <th className="p-4 text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E6E2D8]">
                                            {results.map((result) => (
                                                <tr key={result.id} className="group hover:bg-[#FAF9F5] transition-colors">
                                                    <td className="p-4">
                                                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E6E2D8] bg-[#F5F3ED] flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt={`DPI preview of ${result.originalName}`} className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-[200px] text-[#1C1917]">
                                                            {result.originalName}
                                                        </p>
                                                        <p className="text-xs text-[#78716C]">{formatSize(result.fileSize)}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        {result.status === "completed" ? (
                                                            <span className="text-sm font-semibold text-[#1C1917] whitespace-nowrap">
                                                                {result.width} × {result.height} px
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-[#78716C] italic">Analyzing...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {result.status === "analyzing" && (
                                                            <span className="inline-flex items-center gap-2 text-xs text-[#78716C]">
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
                                                                Reading metadata...
                                                            </span>
                                                        )}
                                                        {result.status === "completed" && (
                                                            <div className="space-y-1">
                                                                {result.hasDpi ? (
                                                                    <>
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5F3ED] text-[#1C1917] text-[10px] font-mono font-bold border border-[#E6E2D8]">
                                                                            <ScanSearch className="h-3 w-3" /> {formatDpi(result.dpiX)} × {formatDpi(result.dpiY)} DPI{result.resolutionUnit === "cm" ? " /cm" : ""}
                                                                        </span>
                                                                        {hasPrintWidth && effectiveDpi(result) !== null && (
                                                                            <p className="text-[11px] text-[#78716C]">
                                                                                {effectiveDpi(result)} DPI at {printWidthNum}" wide
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold border border-amber-200">
                                                                        No DPI metadata
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {result.status === "error" && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-mono font-bold uppercase border border-rose-200">
                                                                <AlertCircle className="h-3 w-3" /> Failed
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell">
                                                        {result.status === "completed" && result.hasDpi && (
                                                            isPrintReady(result) ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase border border-emerald-200">
                                                                    <CheckCircle2 className="h-3 w-3" /> Print-Ready
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold uppercase border border-amber-200">
                                                                    <AlertCircle className="h-3 w-3" /> Below 300
                                                                </span>
                                                            )
                                                        )}
                                                        {result.status === "completed" && !result.hasDpi && (
                                                            <span className="text-xs text-[#78716C] italic">Use print width to estimate</span>
                                                        )}
                                                        {result.status === "analyzing" && (
                                                            <span className="text-xs text-[#78716C] italic">Checking...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
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
                            If you've ever uploaded a photo for printing only to have it rejected for being "too low resolution," you already know why DPI matters. The fastest way to fix this problem before it costs you time or money is to use a <strong className="text-[#1C1917]">free image DPI checker</strong> - a simple online tool that tells you the exact DPI (dots per inch) of any picture in seconds, no software download required.
                        </p>
                        <p>
                            In this guide, you'll learn what DPI actually means, how to check the DPI of an image online, how to know if your photo meets the 300 DPI print standard, and which tools work best depending on what you're trying to do.
                        </p>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">What Is DPI and Why Does It Matter?</h2>
                            <p>
                                DPI stands for <strong className="text-[#1C1917]">dots per inch</strong> - a measurement of how many printed dots fit into one inch of a printed image. The closely related term <strong className="text-[#1C1917]">PPI (pixels per inch)</strong> describes pixel density on a screen or in a digital file. In everyday use, most people (and most tools) treat DPI and PPI interchangeably when talking about image resolution.
                            </p>
                            <p className="mt-4">Here's why it matters:</p>
                            <ul className="space-y-3 list-disc pl-5">
                                <li><strong className="text-[#1C1917]">Low DPI (72–96):</strong> Fine for websites, social media, and screens, but images will look blurry or pixelated when printed.</li>
                                <li><strong className="text-[#1C1917]">Standard print DPI (300):</strong> The industry benchmark for sharp, professional-quality prints - brochures, flyers, business cards, and photo prints.</li>
                                <li><strong className="text-[#1C1917]">High DPI (600+):</strong> Used for fine art reproduction, large-format printing, and professional photography.</li>
                            </ul>
                            <p className="mt-4">
                                If your image's dots per inch value is too low for its intended output size, the print will come out grainy no matter how good the photo looked on your screen.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">How to Check DPI of an Image Online (Step-by-Step)</h2>
                            <p>You don't need Photoshop or any design software to check DPI of an image online. Most free tools follow the same simple process:</p>
                            <ol className="space-y-3 list-decimal pl-5">
                                <li><strong className="text-[#1C1917]">Open an image DPI checker website</strong> in your browser.</li>
                                <li><strong className="text-[#1C1917]">Upload or drag and drop</strong> your image file (JPG, PNG, TIFF, or PDF are usually supported).</li>
                                <li><strong className="text-[#1C1917]">View the results instantly</strong> - the tool displays the image's DPI/PPI, pixel dimensions (width × height), and sometimes the physical print size at that resolution.</li>
                                <li><strong className="text-[#1C1917]">Adjust if needed</strong> - many checkers also let you resize or convert the DPI directly from the same screen.</li>
                            </ol>
                            <p className="mt-4">
                                This entire process usually takes under 10 seconds, which is why an online image DPI checker has become the go-to method over manually inspecting file properties.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold font-sans text-[#1C1917] mb-4">Checking DPI Without a Website</h3>
                            <p>If you'd rather not upload your file anywhere, your device already stores this data:</p>
                            <ul className="space-y-3 list-disc pl-5">
                                <li><strong className="text-[#1C1917]">Windows:</strong> Right-click the image → Properties → Details tab → look for "Horizontal/Vertical Resolution."</li>
                                <li><strong className="text-[#1C1917]">Mac:</strong> Open the image in Preview → Tools → Adjust Size, and the resolution field shows the current DPI.</li>
                                <li><strong className="text-[#1C1917]">Image size checker extension:</strong> Several free browser extensions let you check an image's resolution and DPI directly from any webpage without downloading the file first - useful if you're vetting stock photos before you buy them.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">How Do I Know If My Photo Is 300 DPI?</h2>
                            <p>This is one of the most common questions people search before sending a photo to a print shop. Here's how to check:</p>
                            <ol className="space-y-3 list-decimal pl-5">
                                <li>Run the image through a DPI checker tool.</li>
                                <li>Compare the reported DPI value against 300.</li>
                                <li>If it reads below 300 DPI at your intended print size, the photo will likely look soft or pixelated once printed.</li>
                            </ol>
                            <p className="mt-4">
                                A quick trick if you don't want to check DPI directly: divide the image's pixel width by the physical width (in inches) you plan to print. If the result is 300 or higher, you're in the clear. For example, a photo that's 1800 pixels wide printed at 6 inches wide gives you exactly 300 DPI (1800 ÷ 6 = 300).
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Where Can I Find the DPI of an Image?</h2>
                            <p>The DPI value is stored in the image's metadata. You can find it three ways:</p>
                            <ul className="space-y-3 list-disc pl-5">
                                <li><strong className="text-[#1C1917]">Online DPI checker tools</strong> - fastest option, works on any device, no installation needed.</li>
                                <li><strong className="text-[#1C1917]">File properties on your computer</strong> - built into Windows and Mac, but doesn't always show useful print-size context.</li>
                                <li><strong className="text-[#1C1917]">Photo editing software</strong> (Photoshop, GIMP, Canva) - shows DPI under image size or document settings, useful if you're already editing the file.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">How Much DPI Is My Image? A Quick Reference</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse text-left bg-white border border-[#E6E2D8] rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-[#FAF9F5] border-b border-[#E6E2D8] text-xs font-mono uppercase text-[#78716C]">
                                            <th className="p-3">Use Case</th>
                                            <th className="p-3">Recommended DPI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E2D8]">
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Website / social media</td>
                                            <td className="p-3">72–96 DPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Standard document printing</td>
                                            <td className="p-3">150–200 DPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Professional photo printing</td>
                                            <td className="p-3 font-semibold text-[#1C1917]">300 DPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Large banners / posters (viewed from a distance)</td>
                                            <td className="p-3">100–150 DPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Fine art / gallery prints</td>
                                            <td className="p-3">600+ DPI</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4">
                                If your image falls short of the recommended range for your project, most DPI checker tools also include a built-in DPI converter so you can upscale the resolution before exporting.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-6 divide-y divide-[#E6E2D8]">
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">What is a good DPI for printing photos?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">300 DPI is the standard for high-quality photo prints. Anything below 150 DPI tends to look noticeably blurry once printed.</p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Is DPI the same as image resolution?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">Not exactly. Resolution refers to the total pixel dimensions of an image, while DPI describes how densely those pixels are packed when printed at a specific size. The same image can have different DPI values depending on the print size you choose.</p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Can I increase the DPI of a low-resolution image?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">You can technically raise the DPI number in an image's metadata, but this doesn't add real detail - it just spreads the existing pixels across a defined print size. For a genuine quality boost, you'd need an AI upscaling tool rather than a simple DPI checker.</p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">How do I check the DPI of an image on my phone?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">Most mobile photo apps don't display DPI directly, so the easiest method is uploading the image to a mobile-friendly online DPI checker, which works the same way as on desktop.</p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Does DPI matter for images used only on websites?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">Not much. Screens display images in pixels, not physical inches, so DPI has little effect on how an image looks online. What matters more for web images is the pixel dimension and file size.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Final Thoughts</h2>
                            <p>
                                Checking an image's DPI takes seconds once you know where to look. Whether you're prepping files for a print shop, verifying a stock photo before purchase, or just curious about "how much DPI is my image," an online image DPI checker gives you an instant, accurate answer without needing any design software installed. Run your file through a checker before you print, and you'll avoid the disappointment of a blurry final product.
                            </p>
                        </div>

                        <div className="pt-6">
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">Related Tools</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "JPG to WebP Converter", link: "/tools/jpg-to-webp" },
                                    { title: "PNG to JPG Converter", link: "/tools/png-to-jpg" },
                                    { title: "HEIC to JPG Converter", link: "/tools/heic-to-jpg" },
                                    { title: "JPG Compressor", link: "/tools/jpg-compress" }
                                ].map((tool, idx) => (
                                    <Link key={idx} to={tool.link} className="block p-5 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors group">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 block mb-1">TOOL</span>
                                        <span className="font-bold text-[#1C1917] group-hover:text-rose-600 transition-colors">{tool.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ImageDpiChecker;
