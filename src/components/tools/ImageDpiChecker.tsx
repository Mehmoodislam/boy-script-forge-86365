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
        headline: "Image DPI Checker – Check Image DPI Online Free",
        description:
            "Check the DPI of any image online for free with our Image DPI Checker. Upload a photo to find its DPI, pixel dimensions, image resolution, and estimated print size.",
        author: { "@type": "Organization", name: "FreeImagePrompt" },
        publisher: {
            "@type": "Organization",
            name: "FreeImagePrompt",
            logo: { "@type": "ImageObject", url: "https://freeimageprompt.com/logo.png" },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        datePublished: "2026-08-02",
        dateModified: "2026-11-26",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How do I check the DPI of an image?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Upload your JPG, PNG, TIFF, BMP, or WebP image to an online DPI checker. The tool can inspect available resolution metadata and display the image's pixel dimensions and DPI information.",
                },
            },
            {
                "@type": "Question",
                name: "How many DPI is my image?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Your image's DPI depends on its stored resolution metadata. You can use an image DPI checker to inspect the available horizontal and vertical resolution values.",
                },
            },
            {
                "@type": "Question",
                name: "What is a good DPI for printing photos?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "300 PPI is a common recommendation for high-quality photo printing. Lower resolutions may also produce acceptable results depending on the print size and viewing distance.",
                },
            },
            {
                "@type": "Question",
                name: "Is DPI the same as image resolution?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Image resolution usually refers to the total number of pixels in an image, while PPI describes pixel density at a particular physical size. DPI technically refers to printer dots per inch.",
                },
            },
            {
                "@type": "Question",
                name: "What is the difference between 72 DPI and 300 DPI?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "72 PPI and 300 PPI describe different pixel densities at a given physical size. A 300 PPI image provides more pixels per printed inch than a 72 PPI image, assuming sufficient source pixels are available.",
                },
            },
            {
                "@type": "Question",
                name: "Does 300 DPI mean 300 × 300 pixels?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. 300 DPI is a density measurement, not a fixed image dimension. A 4 × 6-inch print at 300 PPI requires 1200 × 1800 pixels.",
                },
            },
            {
                "@type": "Question",
                name: "Can I check the DPI of a JPG image?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can inspect the resolution metadata of a JPG or JPEG image using an online DPI checker or image editing software.",
                },
            },
            {
                "@type": "Question",
                name: "Can I check PNG image DPI?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. PNG files can contain pixel-density information. However, not every PNG image includes this information.",
                },
            },
            {
                "@type": "Question",
                name: "How do I check image DPI on my phone?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Open a mobile-friendly image DPI checker in your browser, select a photo from your device, and review its available resolution information.",
                },
            },
            {
                "@type": "Question",
                name: "Does DPI matter for website images?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "DPI generally has little effect on how an image appears on a website. Browsers display images based primarily on pixel dimensions and CSS sizing. Image dimensions, file size, and compression are more important for web performance.",
                },
            },
            {
                "@type": "Question",
                name: "Can I convert 72 DPI to 300 DPI?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can change an image's resolution metadata or resample its dimensions. However, simply changing 72 DPI to 300 DPI does not add genuine image detail.",
                },
            },
            {
                "@type": "Question",
                name: "Why does my image show 72 DPI instead of 300 DPI?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Many digital images are saved with a default resolution setting, such as 72 PPI or 96 PPI. This does not necessarily mean the image is low quality. Its actual printing potential depends on the pixel dimensions and intended print size.",
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
                title="Image DPI Checker – Check Image DPI Online Free | FreeImagePrompt"
                description="Check the DPI of any image online for free with our Image DPI Checker. Upload a photo to find its DPI (dots per inch), pixel dimensions, image resolution, and estimated print size."
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
                            Image DPI Checker – Check Image DPI Online Free
                        </h1>
                        <p className="prose-editorial text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed mb-6">
                            Check the DPI of any image online for free with our Image DPI Checker. Upload a photo to find its DPI (dots per inch), pixel dimensions, image resolution, and estimated print size. Instantly see whether your image meets the 300 DPI standard for high-quality printing. No software installation, registration, or file uploads required.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["100% Free", "No Signup", "No Watermark", "Private & Secure", "Instant Results"].map((b) => (
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
                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">How to Check DPI of an Image Online</h2>
                            <p className="mb-4">
                                Want to know how many DPI your image has? Our free online image DPI checker makes it easy to check image resolution without Photoshop or other editing software.
                            </p>
                            <p className="font-semibold text-[#1C1917] mb-2">Follow these simple steps:</p>
                            <ol className="space-y-2 list-decimal pl-5">
                                <li>Open the Image DPI Checker tool above.</li>
                                <li>Drag and drop your image into the upload area or click Browse to select a file.</li>
                                <li>Wait a moment while the tool analyzes your image.</li>
                                <li>View the image's DPI, horizontal and vertical pixel dimensions, and available resolution information.</li>
                                <li>Check whether your photo meets the recommended 300 DPI printing standard.</li>
                            </ol>
                            <p className="mt-4">
                                The tool works directly in your browser, so your image stays on your device if browser-based processing is implemented as described.
                            </p>
                            <p className="mt-2">
                                You can use it to check the DPI of JPG, PNG, BMP, TIFF, and WebP images without downloading additional software.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">What Is DPI in an Image?</h2>
                            <p className="mb-4">
                                DPI stands for <strong className="text-[#1C1917]">Dots Per Inch</strong>. It describes how many individual ink or printer dots are placed within one inch during printing.
                            </p>
                            <p className="mb-4">
                                When discussing digital images, people often use DPI to describe image resolution or print quality. However, DPI and PPI (Pixels Per Inch) are technically different:
                            </p>
                            <ul className="space-y-2 list-disc pl-5">
                                <li><strong className="text-[#1C1917]">DPI (Dots Per Inch):</strong> Measures the number of printer dots in one inch of printed output.</li>
                                <li><strong className="text-[#1C1917]">PPI (Pixels Per Inch):</strong> Measures the number of image pixels per inch at a particular display or print size.</li>
                                <li><strong className="text-[#1C1917]">Image Resolution:</strong> Refers to the total number of pixels in an image, usually expressed as width × height.</li>
                            </ul>
                            <p className="mt-4">
                                For example, a photograph measuring 3000 × 2400 pixels contains 7.2 million pixels. Its effective PPI depends on the physical dimensions at which it is printed.
                            </p>
                            <p className="mt-2">
                                Understanding these terms helps you choose the right image resolution for photo printing, graphic design, posters, flyers, and other print projects.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">How Many DPI Is My Image?</h2>
                            <p className="mb-4">
                                If you are wondering, "What DPI is my image?" or "How many DPI does my photo have?", the answer depends on the resolution information stored in the image file and the size at which you intend to print it.
                            </p>
                            <p className="mb-4">
                                Use our image DPI checker to inspect the available resolution metadata in your image. For example:
                            </p>
                            <ul className="space-y-2 list-disc pl-5">
                                <li>A JPEG image may contain a resolution setting of 72 DPI.</li>
                                <li>A PNG image may contain a pixel density value such as 96 PPI.</li>
                                <li>A TIFF image may store horizontal and vertical resolution information.</li>
                                <li>A photograph with 3000 pixels across, printed at 10 inches wide, has an effective resolution of 300 PPI.</li>
                            </ul>
                            <div className="bg-[#FAF9F5] border-l-4 border-rose-500 p-4 rounded-r-lg mt-4 text-sm">
                                <strong className="text-[#1C1917]">Important:</strong> An image's metadata DPI value and its effective print resolution are not always the same. The actual print quality depends on the number of available pixels and the physical print dimensions.
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">What Is 300 DPI?</h2>
                            <p className="mb-4">
                                300 DPI is a commonly recommended resolution for high-quality printing. It is widely used for photographs, brochures, business cards, flyers, magazines, and other printed materials.
                            </p>
                            <p className="mb-4">
                                At 300 PPI, an image contains 300 pixels for every inch of printed length. For example:
                            </p>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm bg-white border border-[#E6E2D8] p-4 rounded-xl list-none">
                                <li><strong className="text-[#1C1917]">3-inch print:</strong> 900 px wide</li>
                                <li><strong className="text-[#1C1917]">4-inch print:</strong> 1200 px wide</li>
                                <li><strong className="text-[#1C1917]">5-inch print:</strong> 1500 px wide</li>
                                <li><strong className="text-[#1C1917]">6-inch print:</strong> 1800 px wide</li>
                                <li><strong className="text-[#1C1917]">8-inch print:</strong> 2400 px wide</li>
                                <li><strong className="text-[#1C1917]">10-inch print:</strong> 3000 px wide</li>
                            </ul>
                            <p className="mt-4">
                                A 300 PPI image generally produces sharp results when viewed at a normal distance. However, the ideal resolution depends on the printer, paper, viewing distance, and type of print.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">What Is 300 DPI in Pixels?</h2>
                            <p className="mb-4">
                                300 DPI does not represent one fixed pixel dimension. The number of pixels required depends on the physical size of the image you want to print.
                            </p>
                            <div className="bg-[#FAF9F5] border border-[#E6E2D8] p-4 rounded-xl my-4 text-center">
                                <span className="font-mono font-bold text-base md:text-lg text-[#1C1917]">
                                    Required Pixels = Print Size in Inches × 300
                                </span>
                            </div>
                            <div className="overflow-x-auto my-4">
                                <table className="w-full text-sm border-collapse text-left bg-white border border-[#E6E2D8] rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-[#FAF9F5] border-b border-[#E6E2D8] text-xs font-mono uppercase text-[#78716C]">
                                            <th className="p-3">Print Size</th>
                                            <th className="p-3">Required Pixel Dimensions (at 300 DPI)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E2D8]">
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">2 × 2 inches</td>
                                            <td className="p-3 font-mono">600 × 600 pixels</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">4 × 6 inches</td>
                                            <td className="p-3 font-mono">1200 × 1800 pixels</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">5 × 7 inches</td>
                                            <td className="p-3 font-mono">1500 × 2100 pixels</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">8 × 10 inches</td>
                                            <td className="p-3 font-mono">2400 × 3000 pixels</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">11 × 14 inches</td>
                                            <td className="p-3 font-mono">3300 × 4200 pixels</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">16 × 20 inches</td>
                                            <td className="p-3 font-mono">4800 × 6000 pixels</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4">
                                These dimensions represent the approximate pixel requirements for 300 PPI printing. For example, if you want to print a photo at 8 × 10 inches, you should ideally have an image measuring at least 2400 × 3000 pixels.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">How Do I Know If My Photo Is 300 DPI?</h2>
                            <p className="mb-4">
                                The easiest way to find out whether your photo is 300 DPI is to check its resolution metadata and calculate its effective pixel density at your intended print size.
                            </p>
                            <div className="bg-white border border-[#E6E2D8] p-5 rounded-xl space-y-3 mb-4">
                                <p className="font-semibold text-[#1C1917]">Here is an example:</p>
                                <p className="text-sm text-[#6B645C]">
                                    Suppose your image is <strong>2400 × 3000 pixels</strong> and you want to print it at <strong>8 × 10 inches</strong>.
                                </p>
                                <ul className="space-y-1 text-sm list-disc pl-5">
                                    <li>Image width: 2400 pixels.</li>
                                    <li>Print width: 8 inches.</li>
                                    <li>Calculation: <code className="font-mono bg-[#EFECE6] px-2 py-0.5 rounded">2400 ÷ 8 = 300 PPI</code></li>
                                    <li>Height calculation: <code className="font-mono bg-[#EFECE6] px-2 py-0.5 rounded">3000 ÷ 10 = 300 PPI</code></li>
                                </ul>
                                <p className="text-sm font-medium text-emerald-700">
                                    ✓ This means your image can produce a full-quality 300 PPI print at 8 × 10 inches.
                                </p>
                            </div>
                            <p>
                                Use our DPI checker to inspect your image dimensions and available resolution metadata before printing.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">What Is DPI in Printing?</h2>
                            <p className="mb-4">
                                DPI plays an important role in determining how a digital image is reproduced by a printer. Higher effective image resolution generally allows finer detail to appear in the final printed result.
                            </p>
                            <p className="mb-4">Different printing projects may require different resolutions:</p>
                            <div className="overflow-x-auto my-4">
                                <table className="w-full text-sm border-collapse text-left bg-white border border-[#E6E2D8] rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-[#FAF9F5] border-b border-[#E6E2D8] text-xs font-mono uppercase text-[#78716C]">
                                            <th className="p-3">Printing Purpose</th>
                                            <th className="p-3">Recommended Image Resolution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E2D8]">
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Basic document printing</td>
                                            <td className="p-3">150–200 PPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Standard photo printing</td>
                                            <td className="p-3 font-semibold text-[#1C1917]">300 PPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Business cards and flyers</td>
                                            <td className="p-3 font-semibold text-[#1C1917]">300 PPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Brochures and magazines</td>
                                            <td className="p-3 font-semibold text-[#1C1917]">300 PPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Large posters</td>
                                            <td className="p-3">100–200 PPI</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Large-format banners</td>
                                            <td className="p-3">Depends on viewing distance</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-[#1C1917]">Fine art reproduction</td>
                                            <td className="p-3">300–600 PPI or higher, depending on requirements</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-xs text-[#78716C]">
                                Note: These are general recommendations, not universal printer requirements. Always check the specifications provided by your printing service.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">How to Check Image DPI Without Photoshop</h2>
                            <p className="mb-4">
                                You do not always need image editing software to find the DPI of a picture. Both Windows and macOS provide ways to inspect image resolution information.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-[#E6E2D8] p-5 rounded-xl">
                                    <h3 className="font-bold text-[#1C1917] mb-3 flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        On Windows
                                    </h3>
                                    <ol className="space-y-1.5 list-decimal pl-5 text-sm text-[#6B645C]">
                                        <li>Find the image on your computer.</li>
                                        <li>Right-click the image and select <strong>Properties</strong>.</li>
                                        <li>Open the <strong>Details</strong> tab.</li>
                                        <li>Look for <strong>Horizontal Resolution</strong> and <strong>Vertical Resolution</strong>.</li>
                                        <li>Check the available DPI information.</li>
                                    </ol>
                                    <p className="text-xs text-[#78716C] mt-3">
                                        The displayed information may vary depending on the image format and metadata stored in the file.
                                    </p>
                                </div>
                                <div className="bg-white border border-[#E6E2D8] p-5 rounded-xl">
                                    <h3 className="font-bold text-[#1C1917] mb-3 flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-stone-700"></span>
                                        On Mac
                                    </h3>
                                    <ol className="space-y-1.5 list-decimal pl-5 text-sm text-[#6B645C]">
                                        <li>Open your image using <strong>Preview</strong>.</li>
                                        <li>Select <strong>Tools</strong> from the top menu.</li>
                                        <li>Click <strong>Adjust Size</strong>.</li>
                                        <li>Find the <strong>Resolution</strong> field.</li>
                                        <li>Review the available pixels-per-inch information.</li>
                                    </ol>
                                    <p className="text-xs text-[#78716C] mt-3">
                                        You can also use an online image DPI checker if you want a quicker way to inspect image dimensions and resolution.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Where Is DPI Stored in an Image?</h2>
                            <p className="mb-4">
                                DPI or pixel-density information can be stored in an image file's metadata. The exact format depends on the file type. Common image formats handle resolution information differently:
                            </p>
                            <ul className="space-y-2 list-disc pl-5">
                                <li><strong className="text-[#1C1917]">JPEG/JPG:</strong> Can store horizontal and vertical resolution through EXIF or JFIF metadata.</li>
                                <li><strong className="text-[#1C1917]">PNG:</strong> Can store pixel-density information using its <code className="font-mono bg-[#EFECE6] px-1.5 py-0.5 rounded text-xs">pHYs</code> chunk.</li>
                                <li><strong className="text-[#1C1917]">TIFF:</strong> Supports resolution tags for horizontal and vertical image density.</li>
                                <li><strong className="text-[#1C1917]">WebP:</strong> Can contain image metadata, depending on how the file was created.</li>
                                <li><strong className="text-[#1C1917]">BMP:</strong> May store horizontal and vertical resolution in its bitmap header.</li>
                            </ul>
                            <p className="mt-4">
                                Not every image contains DPI information. Some images may have missing, default, or incomplete resolution metadata. This is why checking both the pixel dimensions and the stored resolution is useful when preparing an image for printing.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Can I Increase the DPI of an Image?</h2>
                            <p className="mb-4">
                                Yes, you can change the DPI or PPI setting of an image using photo editing software. However, changing the resolution number alone does not increase the actual image quality.
                            </p>
                            <p className="mb-4">
                                For example, changing an image from 72 DPI to 300 DPI without resampling changes its intended physical print size but does not create additional image detail. There are two common methods:
                            </p>
                            <div className="space-y-4">
                                <div className="bg-white border border-[#E6E2D8] p-5 rounded-xl">
                                    <h3 className="font-bold text-[#1C1917] mb-2">1. Changing DPI Without Resampling</h3>
                                    <p className="text-sm text-[#6B645C]">
                                        This changes the resolution metadata while keeping the original pixel dimensions unchanged. The image will print at a smaller physical size when the PPI value increases.
                                    </p>
                                </div>
                                <div className="bg-white border border-[#E6E2D8] p-5 rounded-xl">
                                    <h3 className="font-bold text-[#1C1917] mb-2">2. Increasing Resolution With Resampling</h3>
                                    <p className="text-sm text-[#6B645C]">
                                        Resampling changes the pixel dimensions by adding or removing pixels. AI image upscaling tools can sometimes generate additional visual detail, although the results are not guaranteed to match an original high-resolution photograph.
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 font-medium text-[#1C1917]">
                                For the best printing results, start with an image that has sufficient pixel dimensions for your desired print size.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-6 divide-y divide-[#E6E2D8]">
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">How do I check the DPI of an image?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        Upload your JPG, PNG, TIFF, BMP, or WebP image to an online DPI checker. The tool can inspect available resolution metadata and display the image's pixel dimensions and DPI information.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">How many DPI is my image?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        Your image's DPI depends on its stored resolution metadata. You can use an image DPI checker to inspect the available horizontal and vertical resolution values.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">What is a good DPI for printing photos?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        300 PPI is a common recommendation for high-quality photo printing. Lower resolutions may also produce acceptable results depending on the print size and viewing distance.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Is DPI the same as image resolution?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        No. Image resolution usually refers to the total number of pixels in an image, while PPI describes pixel density at a particular physical size. DPI technically refers to printer dots per inch.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">What is the difference between 72 DPI and 300 DPI?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        72 PPI and 300 PPI describe different pixel densities at a given physical size. A 300 PPI image provides more pixels per printed inch than a 72 PPI image, assuming sufficient source pixels are available.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Does 300 DPI mean 300 × 300 pixels?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        No. 300 DPI is a density measurement, not a fixed image dimension. A 4 × 6-inch print at 300 PPI requires 1200 × 1800 pixels.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Can I check the DPI of a JPG image?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        Yes. You can inspect the resolution metadata of a JPG or JPEG image using an online DPI checker or image editing software.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Can I check PNG image DPI?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        Yes. PNG files can contain pixel-density information. However, not every PNG image includes this information.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">How do I check image DPI on my phone?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        Open a mobile-friendly image DPI checker in your browser, select a photo from your device, and review its available resolution information.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Does DPI matter for website images?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        DPI generally has little effect on how an image appears on a website. Browsers display images based primarily on pixel dimensions and CSS sizing. Image dimensions, file size, and compression are more important for web performance.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Can I convert 72 DPI to 300 DPI?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        Yes, you can change an image's resolution metadata or resample its dimensions. However, simply changing 72 DPI to 300 DPI does not add genuine image detail.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold font-sans text-[#1C1917] mb-2">Why does my image show 72 DPI instead of 300 DPI?</h3>
                                    <p className="text-sm md:text-base text-[#6B645C]">
                                        Many digital images are saved with a default resolution setting, such as 72 PPI or 96 PPI. This does not necessarily mean the image is low quality. Its actual printing potential depends on the pixel dimensions and intended print size.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Check Your Image DPI Before Printing</h2>
                            <p className="mb-4">
                                Knowing your image's DPI can help you avoid blurry prints, unexpected image quality issues, and rejected print files.
                            </p>
                            <p className="mb-4">
                                Use our free Image DPI Checker to find the available resolution information, inspect pixel dimensions, and determine whether your photo has enough pixels for your intended print size.
                            </p>
                            <p>
                                Whether you are preparing a photograph, business card, flyer, poster, or professional printing project, checking image resolution before printing is a simple way to get better results.
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
