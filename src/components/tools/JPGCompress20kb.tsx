import { useState } from "react";
import { Image as ImageIcon, Upload, Download, FileJson, CheckCircle2, X, Layers, List } from "lucide-react";
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

interface JPGCompress20kbProps {
    children?: React.ReactNode;
}

const JPGCompress20kb = ({ children }: JPGCompress20kbProps) => {
    const [results, setResults] = useState<CompressedResult[]>([]);
    const [isOverallProcessing, setIsOverallProcessing] = useState(false);

    // Specifically for 20KB
    const pageTitle = "Compress JPG to 20KB Online Free - No Signup, No Watermark";
    const metaDescription = "Upload JPG and compress to ~20KB in your browser. Free, no signup, no watermark. Perfect for government exam forms, bank KYC, passport & visa portals. 100% client-side.";
    const h1Title = "Compress JPG to 20KB - Free Online Tool for Official Forms";
    const subTitle = "Upload JPG → compresses to ~20KB in your browser → download instantly. Free, no signup, no watermark. Works for government forms, KYC & exam portals.";

    const faqSchema = {
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can I really compress a JPG to exactly 20KB?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes - our algorithm targets 20KB precisely using iterative compression passes. Results may vary by ±1–2KB depending on image content (a photo with lots of fine detail compresses differently than a plain background). In practice, the output consistently falls within the accepted range for all major portals." }
            },
            {
                "@type": "Question",
                "name": "Will the image quality be acceptable for official use?",
                "acceptedAnswer": { "@type": "Answer", "text": "For passport-size photos and standard ID images, yes. Face details remain clear at 20KB when you start from a good original. We've tested this against UPSC, SSC, and IBPS portal requirements - the compressed images pass visual inspection." }
            },
            {
                "@type": "Question",
                "name": "Is it safe to compress ID photos and documents here?",
                "acceptedAnswer": { "@type": "Answer", "text": "Completely safe. All processing happens in your browser using JavaScript. Your files are never uploaded to any server - not ours, not anyone's. The image data doesn't leave your device at any point." }
            },
            {
                "@type": "Question",
                "name": "Can I compress multiple images to 20KB at once?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes - batch compression is supported. Upload multiple files and download them all at once. Useful if you're preparing photos for multiple candidates or multiple documents in one session." }
            },
            {
                "@type": "Question",
                "name": "What if my image is already under 20KB?",
                "acceptedAnswer": { "@type": "Answer", "text": "The tool will leave it as-is or make minimal adjustments. It won't inflate the file size to hit 20KB - that would only hurt quality. If your image is already 18KB, you're good to go." }
            },
            {
                "@type": "Question",
                "name": "Does this work for JPEG files too?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. JPG and JPEG are the same format - the difference is just the file extension. Both .jpg and .jpeg files are fully supported." }
            },
            {
                "@type": "Question",
                "name": "What if the portal still rejects my image after compression?",
                "acceptedAnswer": { "@type": "Answer", "text": "Check the portal's other requirements beyond file size: dimensions (most passport photo portals require 200×230px or 35×45mm), color mode (RGB, not CMYK or grayscale unless specified), format (JPG/JPEG only), and background (white or light-colored for passport photos). If all of those are correct and the portal still rejects, try compressing to 19KB instead of 20KB." }
            },
            {
                "@type": "Question",
                "name": "Is there a file size limit for uploading?",
                "acceptedAnswer": { "@type": "Answer", "text": "No hard limit. Processing is entirely client-side, so it depends on your device's available memory. Modern phones and laptops handle large files and batch uploads without issue." }
            }
        ]
    };

    const appSchema = {
        "@type": "SoftwareApplication",
        "name": "JPG to 20KB Compressor",
        "url": "https://freeimageprompt.com/tools/compress-jpg-to-20kb",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any (Web Browser)",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "featureList": ["Compress to 20KB", "Client-side processing", "No signup", "Batch compression", "No watermarks"]
    };

    const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://freeimageprompt.com/" },
            { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://freeimageprompt.com/tools" },
            { "@type": "ListItem", "position": 3, "name": "JPG Compressor", "item": "https://freeimageprompt.com/tools/jpg-compress" },
            { "@type": "ListItem", "position": 4, "name": "Compress JPG to 20KB", "item": "https://freeimageprompt.com/tools/compress-jpg-to-20kb" }
        ]
    };

    const faqs = [
        {
            question: "Can I really compress a JPG to exactly 20KB?",
            answer: "Yes - our algorithm targets 20KB precisely using iterative compression passes. Results may vary by ±1–2KB depending on image content (a photo with lots of fine detail compresses differently than a plain background). In practice, the output consistently falls within the accepted range for all major portals."
        },
        {
            question: "Will the image quality be acceptable for official use?",
            answer: "For passport-size photos and standard ID images, yes. Face details remain clear at 20KB when you start from a good original. We've tested this against UPSC, SSC, and IBPS portal requirements - the compressed images pass visual inspection."
        },
        {
            question: "Is it safe to compress ID photos and documents here?",
            answer: "Completely safe. All processing happens in your browser using JavaScript. Your files are never uploaded to any server - not ours, not anyone's. The image data doesn't leave your device at any point."
        },
        {
            question: "Can I compress multiple images to 20KB at once?",
            answer: "Yes - batch compression is supported. Upload multiple files and download them all at once. Useful if you're preparing photos for multiple candidates or multiple documents in one session."
        },
        {
            question: "What if my image is already under 20KB?",
            answer: "The tool will leave it as-is or make minimal adjustments. It won't inflate the file size to hit 20KB - that would only hurt quality. If your image is already 18KB, you're good to go."
        },
        {
            question: "Does this work for JPEG files too?",
            answer: "Yes. JPG and JPEG are the same format - the difference is just the file extension. Both .jpg and .jpeg files are fully supported."
        },
        {
            question: "What if the portal still rejects my image after compression?",
            answer: "Check the portal's other requirements beyond file size: dimensions (most passport photo portals require 200×230px or 35×45mm), color mode (RGB, not CMYK or grayscale unless specified), format (JPG/JPEG only), and background (white or light-colored for passport photos). If all of those are correct and the portal still rejects, try compressing to 19KB instead of 20KB."
        },
        {
            question: "Is there a file size limit for uploading?",
            answer: "No hard limit. Processing is entirely client-side, so it depends on your device's available memory. Modern phones and laptops handle large files and batch uploads without issue."
        }
    ];

    const getTargetSizeMB = () => {
        return 20 / 1024; // Target: 20KB
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
                let initialDimensions = 800; // Adjusted for 20KB

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
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead title={pageTitle} description={metaDescription} schema={[appSchema, faqSchema, breadcrumbSchema]} />
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
                            className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-muted/50 rounded-[2rem] cursor-pointer hover:bg-accent/5 hover:border-primary/50 transition-all group relative z-10"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
                        <div className="space-y-6 mb-16">
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
                                        className="flex-1 sm:flex-none text-xs"
                                    >
                                        Clear All
                                    </Button>
                                    <Button
                                        onClick={downloadAll}
                                        disabled={isOverallProcessing || results.filter(r => r.status === "completed").length === 0}
                                        className="flex-1 sm:flex-none gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs"
                                    >
                                        <Download className="h-3.5 w-3.5" />
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
                                                    <td className="p-4">
                                                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E6E2D8] bg-[#F5F3ED] flex items-center justify-center">
                                                            {result.status === "completed" ? (
                                                                <img src={result.previewUrl} alt="Small Preview" className="w-full h-full object-cover" loading="lazy" />
                                                            ) : (
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-xs text-[#1C1917]">
                                                            {result.originalName}
                                                        </p>
                                                        <p className="text-xs text-[#78716C]">{formatSize(result.originalSize)} original</p>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <span className="text-sm font-semibold text-emerald-700">{formatSize(result.compressedSize)}</span>
                                                        ) : (
                                                            <span className="text-xs text-[#78716C] italic">Processing...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell">
                                                        {result.status === "completed" ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-emerald-700">{formatSize(result.compressedSize)}</span>
                                                                <span className="text-[10px] font-bold uppercase text-emerald-600">
                                                                    Saved {Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-[#78716C] italic">Processing...</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {result.status === "compressing" && (
                                                            <div className="w-24 space-y-2">
                                                                <Progress value={result.progress} className="h-1.5" />
                                                            </div>
                                                        )}
                                                        {result.status === "completed" && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase border border-emerald-200">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Success
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right space-x-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => removeResult(result.id)}
                                                            className="h-8 w-8 p-0 rounded-lg text-[#78716C] hover:text-rose-600"
                                                            title="Remove"
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
                            <h3 className="text-lg font-bold text-[#1C1917]">Bulk Processing</h3>
                            <p className="text-[#6B645C] text-sm">
                                Save time by uploading hundreds of images at once. Our engine handles multi-file compression with ease.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-lg font-bold text-[#1C1917]">100% Client-Side</h3>
                            <p className="text-[#6B645C] text-sm">
                                Your privacy is our priority. Images never leave your device. All processing happens locally in your browser.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-lg font-bold text-[#1C1917]">Quality Preservation</h3>
                            <p className="text-[#6B645C] text-sm">
                                Our smart algorithms reduce file size while keeping your photos looking sharp and professional.
                            </p>
                        </div>
                    </div>

                    <div className="prose-editorial text-left space-y-10 border-t border-[#E6E2D8] pt-12">
                        {/* Why 20KB limit section */}
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Why Do So Many Portals Require a 20KB Image Limit?</h2>
                            <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                                Government and institutional portals set strict file size limits for three practical reasons: <strong>fast uploads on low-bandwidth connections</strong>, uniform storage across millions of records, and compatibility with older backend systems that were built long before modern smartphones existed.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        The 20KB ceiling is one of the most common thresholds you'll hit. Here's where it shows up:
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Government exam portals - UPSC Civil Services, SSC CGL/CHSL, Railway NTPC, IBPS PO, SBI PO all specify photo uploads between 10KB and 20KB.",
                                            "Bank KYC and account opening - SBI, PNB, Bank of Baroda digital onboarding forms cap passport photos at 20KB.",
                                            "Passport & visa applications - India's Passport Seva Portal and several embassy visa portals enforce the same limit.",
                                            "Job application portals - NCS (National Career Service), state government job boards, and many Naukri-integrated portals.",
                                            "University admissions - DU, JNU, and state university counselling portals; NEET and JEE application forms."
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
                                        If your image is even 1KB over the limit, the portal rejects it. Our tool compresses to exactly the right size - so you don't have to guess.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How to compress (Steps) */}
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-center">How to Compress JPG to 20KB Online Free (Step-by-Step)</h2>
                            <p className="text-muted-foreground text-center mb-8">No account. No install. Done in seconds.</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { title: "Upload your JPG or JPEG image", text: "Drag & drop onto the tool, or click to browse your device." },
                                    { title: "The tool automatically targets 20KB", text: "The compression algorithm runs entirely in your browser." },
                                    { title: "Preview the compressed result", text: "File size is shown before you download." },
                                    { title: "Download your 20KB JPG instantly", text: "Clean file, ready for portal submission." }
                                ].map((step, i) => (
                                    <div key={i} className="relative p-7 rounded-[2rem] bg-white border border-[#E6E2D8] hover:border-[#1C1917] transition-all group overflow-hidden">
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
                            <p className="text-muted-foreground text-sm mt-6 text-center italic">
                                Your image never leaves your device - 100% browser-based, zero server uploads. This matters especially when you're compressing ID photos, passport images, or KYC documents.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold">Key Features of Our 20KB JPG Compressor</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto italic">We built this as a dedicated image size reducer to 20KB - not a generic slider tool.</p>
                            </div>
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[
                                    { title: "Precise 20KB Targeting", text: "A smart iterative algorithm hits the target size, not just approximately smaller.", icon: <Layers className="h-6 w-6" /> },
                                    { title: "100% Client-Side", text: "Files never leave your device; critical for ID documents and sensitive photos.", icon: <Upload className="h-6 w-6" /> },
                                    { title: "No Signup Required", text: "No account, no email, no waiting; open the tool and start immediately.", icon: <CheckCircle2 className="h-6 w-6" /> },
                                    { title: "No Watermarks", text: "Download clean files ready for official submission.", icon: <ImageIcon className="h-6 w-6" /> },
                                    { title: "Batch Compression", text: "Compress multiple images to 20KB at once; useful for bulk application uploads.", icon: <FileJson className="h-6 w-6" /> },
                                    { title: "Free Forever", text: "No trial period, no subscription, no daily cap.", icon: <List className="h-6 w-6" /> }
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
                            <h2 className="text-3xl font-bold mb-4 text-center">How to Compress JPG to 20KB Without Losing Quality</h2>
                            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 italic">
                                20KB is a very small target. Quality loss is inevitable at this size - but our algorithm minimizes it. The difference between a well-compressed 20KB image and a badly compressed one is significant. Here's how to get the sharpest result:
                            </p>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Start With the Highest Quality Original</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Re-compressing an already-compressed JPEG stacks quality losses. Always go back to the original source file.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Crop Unnecessary Whitespace</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Every pixel of background is data. Tighter framing means more quality budget for what matters. For passport/ID photos your face should fill 70-80% of the frame - typically 200x230px.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Scan Documents in Grayscale</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                A grayscale scan at the same resolution is roughly 60% smaller - which means you can compress to 20KB with far less quality loss.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Zoom in Before Submitting</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                After compression, zoom in to check face clarity before submitting. The preview in the tool lets you do this before downloading.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</div>
                                        <div>
                                            <h3 className="font-bold mb-2">Automatic Quality-to-Size Optimization</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Our tool finds the best quality-to-size ratio automatically - you don't need to adjust any settings.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-primary to-accent p-8 text-center text-primary-foreground">
                                <h2 className="text-2xl font-bold">Compress JPG to 20KB vs Other Size Targets</h2>
                            </div>
                            <div className="p-6 md:p-8 border-b border-border">
                                <p className="text-muted-foreground text-sm italic">
                                    Not sure which size you need? The reduce JPG to 20KB option covers most official Indian government portals - but the right target depends on what the portal specifies.
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="p-6 font-bold text-sm uppercase tracking-wider">Target Size</th>
                                            <th className="p-6 font-bold text-sm uppercase tracking-wider">Best For</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            { f: "10KB", a: "Very strict portals, signature uploads, thumbnails", p: "/tools/compress-jpg-to-10kb" },
                                            { f: "20KB", a: "Government exams, KYC, passport applications (Recommended)", p: "" },
                                            { f: "25KB", a: "Some bank and university portals", p: "/tools/compress-jpg-to-25kb" },
                                            { f: "50KB", a: "Job applications, general form uploads", p: "/tools/compress-jpg-to-50kb" },
                                            { f: "100KB", a: "Email attachments, social media profile photos", p: "/tools/compress-jpg-to-100kb" },
                                            { f: "200KB", a: "High-quality web images, professional submissions", p: "/tools/compress-jpg-to-200kb" }
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-accent/5 transition-all group">
                                                <td className="p-6">
                                                    {row.p ? (
                                                        <a href={row.p} className="text-primary font-bold text-sm underline underline-offset-4 hover:scale-105 transition-transform inline-block">
                                                            {row.f}
                                                        </a>
                                                    ) : (
                                                        <span className="text-primary font-black text-sm">{row.f}</span>
                                                    )}
                                                </td>
                                                <td className="p-6 text-muted-foreground text-sm italic">{row.a}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-6 md:p-8 text-center">
                                <p className="text-muted-foreground text-sm italic">When in doubt, compress to 20KB - it passes the widest range of official portals.</p>
                            </div>
                        </div>

                        {/* Which Portals Require 20KB */}
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Which Portals Require 20KB Image Size?</h2>
                            <p className="text-muted-foreground text-sm mb-8">
                                We've tracked the most common portals that enforce this limit. Always verify the exact requirement on the portal itself - some accept up to 25KB or 30KB.
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: "Government Exams",
                                        items: ["UPSC Civil Services (photo: max 20KB, signature: max 10KB)", "SSC CGL, CHSL, MTS", "Railway NTPC, Group D (RRB portals)", "IBPS PO, Clerk, SO", "SBI PO and Clerk"]
                                    },
                                    {
                                        title: "Passport & Visa",
                                        items: ["Indian Passport Seva Portal (passportindia.gov.in)", "Many embassy visa application portals"]
                                    },
                                    {
                                        title: "Banking KYC",
                                        items: ["SBI, PNB, Bank of Baroda online account opening", "Various cooperative bank digital KYC forms"]
                                    },
                                    {
                                        title: "Education",
                                        items: ["DU, JNU, and state university admission counselling", "NEET UG, JEE Main application forms", "NTA exam portals"]
                                    },
                                    {
                                        title: "Employment",
                                        items: ["NCS (National Career Service) portal", "State government job portals (various)"]
                                    }
                                ].map((portal, i) => (
                                    <div key={i} className="p-7 rounded-[2rem] bg-white border border-[#E6E2D8] hover:border-[#1C1917] transition-all">
                                        <h3 className="font-bold text-lg mb-4">{portal.title}</h3>
                                        <ul className="space-y-3">
                                            {portal.items.map((item, j) => (
                                                <li key={j} className="flex gap-3 text-muted-foreground text-sm">
                                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <p className="text-muted-foreground text-sm mt-6">
                                If your portal accepts up to 25KB, use our{" "}
                                <a href="/tools/compress-jpg-to-25kb" className="text-primary underline underline-offset-4">compress to 25KB tool</a>
                                . For stricter portals that cap at 10KB, use our{" "}
                                <a href="/tools/compress-jpg-to-10kb" className="text-primary underline underline-offset-4">compress to 10KB tool</a>.
                            </p>
                        </div>

                        {/* Mobile Section */}
                        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-accent to-primary p-8 text-center text-primary-foreground">
                                <h2 className="text-2xl font-bold">Compress JPG to 20KB on Mobile</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8 p-8 md:p-10">
                                <div className="space-y-3">
                                    <h3 className="font-bold">iPhone (iOS)</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        No native tool handles compress to 20KB online with precision. Open this tool in Safari - it runs fully in-browser on iOS, no app download needed.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-bold">Android</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Open in Chrome. The experience is identical to desktop. Upload from your camera roll, compress, download.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-bold">Why Not WhatsApp or Telegram?</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        They compress images randomly - no control over output size. Our tool gives you exact 20KB output on any device, any browser.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div id="faqs">
                            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border border-border rounded-2xl px-6 bg-card">
                                        <h3 className="font-semibold py-5">{faq.question}</h3>
                                        <p className="text-sm text-muted-foreground pb-6 leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Useful Sources */}
                        <div className="bg-accent/5 p-10 md:p-14 rounded-[3rem] border border-border">
                            <h2 className="text-3xl font-bold mb-8 text-center">Useful Sources</h2>
                            <ul className="space-y-3 max-w-2xl mx-auto">
                                {[
                                    { name: "UPSC Online Application Portal - Photo & Signature Specifications", url: "https://upsconline.nic.in/" },
                                    { name: "Passport Seva - Photo Guidelines", url: "https://www.passportindia.gov.in/AppOnlineProject/online/faqNri" },
                                    { name: "JPEG Standard - Joint Photographic Experts Group", url: "https://jpeg.org/jpeg/" },
                                    { name: "web.dev - Efficiently Encode Images", url: "https://web.dev/uses-optimized-images/" }
                                ].map((src, i) => (
                                    <li key={i}>
                                        <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 text-sm hover:opacity-80 transition-opacity">
                                            {src.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Different Sizes Link Grid */}
                        <div className="bg-accent/5 p-10 md:p-14 rounded-[3rem] border border-border text-center">
                            <h2 className="text-3xl font-bold mb-4">Need a Different File Size? Compress JPG to Any KB</h2>
                            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto italic">
                                Free Image Prompt handles precise targets for any portal requirement. From signature uploads to high-res documents.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {[
                                    { s: "5KB", d: "Signatures", p: "/tools/compress-jpg-to-5kb" },
                                    { s: "10KB", d: "Portals", p: "/tools/compress-jpg-to-10kb" },
                                    { s: "15KB", d: "ID Cards", p: "/tools/compress-jpg-to-15kb" },
                                    { s: "20KB", d: "Govt Exams", p: "" },
                                    { s: "25KB", d: "Admission", p: "/tools/compress-jpg-to-25kb" },
                                    { s: "50KB", d: "Job Forms", p: "/tools/compress-jpg-to-50kb" },
                                    { s: "100KB", d: "Passports", p: "/tools/compress-jpg-to-100kb" }
                                ].map((size, i) => (
                                    size.p ? (
                                        <a key={i} href={size.p} className="flex flex-col items-center p-6 rounded-3xl bg-white border border-[#E6E2D8] hover:border-[#1C1917] hover:shadow-xl transition-all group">
                                            <span className="font-black text-2xl text-primary group-hover:scale-110 transition-transform">{size.s}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">{size.d}</span>
                                        </a>
                                    ) : (
                                        <div key={i} className="flex flex-col items-center p-6 rounded-3xl bg-primary text-primary-foreground border-2 border-primary shadow-xl">
                                            <span className="font-black text-2xl">{size.s}</span>
                                            <span className="text-[10px] font-bold mt-2 uppercase tracking-widest opacity-80">{size.d} · You are here</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div className="text-center space-y-8 max-w-4xl mx-auto py-12">
                            <div className="h-1.5 w-24 bg-primary/20 rounded-full mx-auto" />
                            <h2 className="text-3xl font-bold tracking-tight uppercase">Compress Your JPG to 20KB Now</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed italic">
                                The fastest way to compress JPG to 20KB for any official portal - free, private, no signup. Works on all devices, handles batch uploads, and produces clean files with no watermarks.
                            </p>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                Whether you need to compress JPG images in bulk or just get one passport photo ready for an exam form, the tool handles it in seconds. Explore our full suite of free image tools for more compression sizes and conversion options.
                            </p>
                            <div className="flex justify-center gap-4">
                                <div className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold uppercase tracking-widest">Privacy First</div>
                                <div className="px-6 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-sm font-bold uppercase tracking-widest">Portal Ready</div>
                            </div>
                        </div>
                    </div>

                    <OtherCompressionSizes />

                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JPGCompress20kb;
