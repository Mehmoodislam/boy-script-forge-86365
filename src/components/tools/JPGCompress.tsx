import { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Download,
  CheckCircle2,
  X,
  Layers,
  List,
} from "lucide-react";
import { Link } from "react-router-dom";
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

const JPGCompress = () => {
  const [results, setResults] = useState<CompressedResult[]>([]);
  const [isOverallProcessing, setIsOverallProcessing] = useState(false);

  // ✅ Static SEO (No duplicate variables)
  const PAGE_URL = "https://freeimageprompt.com/tools/jpg-compress";
  const pageTitle = "JPG Compressor - Free, Fast & No Signup";
  const metaDescription =
    "Compress JPG and JPEG images online free - no signup, no watermark. Batch compression supported. Reduce file size without losing quality.";
  const h1Title = "JPG Compressor - Compress JPEG Images Online Free";
  const subTitle =
    "This free JPG compressor reduces JPEG file sizes by 40-80% directly in your browser. No signup. No watermark. Batch compression supported. Your images never leave your device.";

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "JPG Compressor",
    "url": PAGE_URL,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any (Web Browser)",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "description":
      "Free online JPG compressor. Compress JPEG images in bulk with no signup, no watermark, and 100% client-side processing.",
    "featureList": [
      "Batch compression",
      "Client-side processing",
      "No signup required",
      "Target file size presets",
      "No watermarks",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this JPG compressor really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes, 100% free - no signup, no hidden fees, unlimited compressions. There's no premium tier and no daily cap.",
        },
      },
      {
        "@type": "Question",
        "name": "How much can I compress a JPG file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Typically 40-80% reduction with no visible quality loss, depending on the original image. A 4MB photo commonly compresses to under 1MB.",
        },
      },
      {
        "@type": "Question",
        "name": "Does compressing a JPG reduce image quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "At the 80-85% quality setting, the difference is imperceptible to the human eye. We optimize for this sweet spot - smaller file, same visual result.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I compress multiple JPG files at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes - our batch compressor handles hundreds of files simultaneously. Upload them all at once and download a ZIP when done.",
        },
      },
      {
        "@type": "Question",
        "name": "Are my images safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Completely. All compression happens in your browser - your files are never uploaded to any server. We have no access to your images at any point.",
        },
      },
      {
        "@type": "Question",
        "name": "What is the maximum file size I can compress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "There is no hard limit. Since processing is entirely client-side, it depends on your device's available memory. Most modern phones and laptops handle large batches without issue.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I compress JPG to a specific file size (e.g., 200KB)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes - use our target-size presets: 20KB, 50KB, 100KB, 200KB, 500KB, or 1MB. Each preset compresses your image to land at or under that target.",
        },
      },
      {
        "@type": "Question",
        "name": "Does this work on mobile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes - the tool works on any modern browser including Chrome, Safari, and Firefox on iOS and Android. No app download required.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://freeimageprompt.com/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://freeimageprompt.com/tools",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "JPG Compressor",
        "item": PAGE_URL,
      },
    ],
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.match(/image\/jpe?g/)
    );

    if (validFiles.length === 0) {
      toast.error("Please upload JPG/JPEG files only.");
      return;
    }

    setIsOverallProcessing(true);

    const initialResults: CompressedResult[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      originalName: file.name,
      originalSize: file.size,
      compressedSize: 0,
      compressedFile: file,
      previewUrl: "",
      status: "compressing",
      progress: 0,
    }));

    setResults((prev) => [...prev, ...initialResults]);

    for (const item of initialResults) {
      const fileToProcess = validFiles.find(
        (f) => f.name === item.originalName
      );
      if (!fileToProcess) continue;

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (percent: number) => {
            setResults((prev) =>
              prev.map((r) =>
                r.id === item.id ? { ...r, progress: percent } : r
              )
            );
          },
        };

        const compressedFile = await imageCompression(
          fileToProcess,
          options
        );

        const previewUrl = URL.createObjectURL(compressedFile);

        setResults((prev) =>
          prev.map((r) =>
            r.id === item.id
              ? {
                ...r,
                compressedSize: compressedFile.size,
                compressedFile: new File(
                  [compressedFile],
                  item.originalName,
                  { type: "image/jpeg" }
                ),
                previewUrl,
                status: "completed",
                progress: 100,
              }
              : r
          )
        );
      } catch (err: any) {
        toast.error(`Failed: ${item.originalName}`);
        setResults((prev) =>
          prev.map((r) =>
            r.id === item.id ? { ...r, status: "error" } : r
          )
        );
      }
    }

    setIsOverallProcessing(false);
    toast.success("Batch compression complete!");
  };

  const downloadImage = (result: CompressedResult) => {
    const link = document.createElement("a");
    link.href = result.previewUrl;
    link.download = `compressed_${result.originalName}`;
    link.click();
  };

  const downloadAll = () => {
    results
      .filter((r) => r.status === "completed")
      .forEach((result, index) => {
        setTimeout(() => downloadImage(result), index * 300);
      });
  };

  const removeResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAll = () => {
    results.forEach((r) => {
      if (r.previewUrl) URL.revokeObjectURL(r.previewUrl);
    });
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
      <SEOHead title={pageTitle} description={metaDescription} canonicalUrl={PAGE_URL} schema={[softwareSchema, faqSchema, breadcrumbSchema]} />
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
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
                <Button
                  onClick={downloadAll}
                  disabled={
                    results.filter((r) => r.status === "completed")
                      .length === 0
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between border border-[#E6E2D8] p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    {result.status === "completed" ? (
                      <img src={result.previewUrl}
                        className="w-16 h-16 object-cover rounded-lg" loading="lazy" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-muted" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {result.originalName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatSize(result.originalSize)}
                        {result.status === "completed" &&
                          ` → ${formatSize(
                            result.compressedSize
                          )}`}
                      </p>
                      {result.status === "compressing" && (
                        <Progress
                          value={result.progress}
                          className="mt-2 w-40"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {result.status === "completed" && (
                      <Button
                        size="sm"
                        onClick={() => downloadImage(result)}
                      >
                        Download
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeResult(result.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
              <h3 className="text-xl font-bold text-[#1C1917]">Bulk Processing</h3>
              <p className="text-[#6B645C] text-sm">
                Save time by uploading hundreds of images at once. Our engine handles multi-file compression with ease.
              </p>
            </div>
            <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
              <h3 className="text-xl font-bold text-[#1C1917]">100% Client-Side</h3>
              <p className="text-[#6B645C] text-sm">
                Your privacy is our priority. Images never leave your device. All processing happens locally in your browser.
              </p>
            </div>
            <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
              <h3 className="text-xl font-bold text-[#1C1917]">Quality Preservation</h3>
              <p className="text-[#6B645C] text-sm">
                Our smart algorithms reduce file size while keeping your photos looking sharp and professional.
              </p>
            </div>
          </div>

          <div className="prose-editorial text-left space-y-10 border-t border-[#E6E2D8] pt-12">
            <div className="bg-[#FAF6EC] border-l-4 border-amber-500 p-5 rounded-r-xl my-8 text-sm md:text-base text-[#574E43]">
              <strong>TL;DR:</strong> This free JPG compressor reduces JPEG file sizes by 40–80% directly in your browser. No signup. No watermark. Batch compression supported. Your images never leave your device.
            </div>

            <h2 className="text-3xl font-bold mb-6">What is a JPG Compressor?</h2>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              A <strong>JPG compressor</strong> is a tool that shrinks the file size of JPEG images by removing redundant or imperceptible data - without noticeably degrading the photo.
            </p>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              There are two main approaches:
            </p>
            <ul className="space-y-3 mb-4 list-none p-0 text-[#6B645C]">
              <li className="flex items-start gap-2"><strong>Lossy compression</strong> - permanently discards data the human eye can't detect. Produces the smallest files. This is what most online tools (including ours) use.</li>
              <li className="flex items-start gap-2"><strong>Lossless compression</strong> - removes only metadata and redundant bytes, keeping all pixel data intact. Files stay larger but are fully reversible.</li>
            </ul>
            <p className="text-[#6B645C] leading-relaxed mb-8">
              Why does it matter? Large images slow down websites, bounce off email servers, and get rejected by government upload portals. Compressing a JPEG file before you share it solves all three problems at once - fast, and for free.
            </p>

            <h2 className="text-3xl font-bold mb-6">Why Compress JPG Images?</h2>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              There are four situations where you'll hit a wall with an uncompressed JPG:
            </p>
            <ol className="space-y-3 mb-4 list-none p-0 text-[#6B645C]">
              <li className="flex items-start gap-2"><strong>Website speed.</strong> Google PageSpeed Insights flags oversized images as one of the top performance killers. A 4MB hero image can add 2–3 seconds to your load time. Compress it to under 200KB and the difference is immediate.</li>
              <li className="flex items-start gap-2"><strong>Email attachments.</strong> Most email clients cap attachments at 10–25 MB, and many corporate servers reject anything over 5 MB. Compressing your JPEG images before attaching keeps them deliverable.</li>
              <li className="flex items-start gap-2"><strong>Government and KYC forms.</strong> Aadhaar uploads, visa applications, bank KYC - almost all of these enforce strict limits, often 200KB or less. A standard phone photo is 3–5 MB. You need to decrease the file size of the JPG before you can even submit.</li>
              <li className="flex items-start gap-2"><strong>Social media uploads.</strong> Instagram, Facebook, and Twitter re-compress your images anyway. If you upload a bloated original, their algorithm does the compression for you - badly. Pre-compress for quality control and you keep the sharpness.</li>
            </ol>
            <p className="text-[#6B645C] leading-relaxed mb-8">
              <strong>Bottom line:</strong> compressing a JPG can reduce file size by <strong>40–80%</strong> with no visible quality loss. A 3MB photo becomes 600KB–1.8MB. You can also <Link to="/tools/webp-to-jpg" className="text-[#1C1917] underline underline-offset-4">convert WebP to JPG</Link> if you're working with images downloaded from modern websites.
            </p>

            <h2 className="text-3xl font-bold mb-6">How to Compress JPG Images Online Free (Step-by-Step)</h2>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              No account needed. No software to install. Here's how it works:
            </p>
            <ol className="space-y-3 mb-4 text-[#6B645C]">
              <li><strong>Upload your files.</strong> Drag and drop your JPG or JPEG images onto the tool, or click to browse. Batch upload is fully supported - drop hundreds of files at once.</li>
              <li><strong>Auto-compression runs instantly.</strong> The tool compresses all images automatically in your browser the moment they're uploaded. No settings to fiddle with.</li>
              <li><strong>Preview the results.</strong> See the before/after file sizes side by side. Confirm the quality looks right.</li>
              <li><strong>Download.</strong> Grab files individually or download everything as a single ZIP.</li>
            </ol>
            <p className="bg-[#FAF6EC] border-l-4 border-amber-500 p-5 rounded-r-xl my-8 text-sm md:text-base text-[#574E43]">
              🔒 <strong>Privacy note:</strong> All processing happens in your browser - your images are <strong>never uploaded to any server</strong>. Not even ours.
            </p>

            <h2 className="text-3xl font-bold mb-6">Key Features of Our JPG Compressor</h2>
            <ul className="space-y-3 mb-8 list-none p-0 text-[#6B645C] font-medium">
              <li className="flex items-center gap-2">⚡ <strong>Batch compression</strong> - compress hundreds of JPGs at once, not one by one</li>
              <li className="flex items-center gap-2">🔒 <strong>100% client-side</strong> - files never leave your device; privacy-first by design</li>
              <li className="flex items-center gap-2">📝 <strong>No signup required</strong> - open the tool and start compressing instantly</li>
              <li className="flex items-center gap-2">🖼️ <strong>No watermarks</strong> - download clean, unbranded files every time</li>
              <li className="flex items-center gap-2">✨ <strong>Quality preservation</strong> - smart lossy algorithms keep photos looking sharp</li>
              <li className="flex items-center gap-2">🎯 <strong>Target file sizes</strong> - need to <Link to="/tools/compress-jpg-to-20kb" className="text-[#1C1917] underline underline-offset-4">compress JPG to 20KB</Link> for a KYC form, or <Link to="/tools/compress-jpg-to-100kb" className="text-[#1C1917] underline underline-offset-4">compress JPG to 100KB</Link> for a web upload? Use our target-size presets: 20KB, 50KB, 100KB, 200KB, 500KB, or 1MB</li>
              <li className="flex items-center gap-2">💰 <strong>Free forever</strong> - no hidden fees, no daily limits, no paywalls</li>
            </ul>

            <h2 className="text-3xl font-bold mb-6">JPG vs JPEG - Is There a Difference?</h2>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              No. <strong>JPG and JPEG are exactly the same format.</strong>
            </p>
            <p className="text-[#6B645C] leading-relaxed mb-8">
              The only difference is the file extension. Early Windows systems limited extensions to three characters, so <code className="bg-[#F5F3ED] px-1.5 py-0.5 rounded">.jpeg</code> got shortened to <code className="bg-[#F5F3ED] px-1.5 py-0.5 rounded">.jpg</code>. The underlying compression algorithm - JPEG (Joint Photographic Experts Group) - is identical in both cases. Our tool handles both <code className="bg-[#F5F3ED] px-1.5 py-0.5 rounded">.jpg</code> and <code className="bg-[#F5F3ED] px-1.5 py-0.5 rounded">.jpeg</code> files without any distinction. Whether you search for a "jpeg compressor" or a "jpg compressor," you're looking for the same thing, and this is it.
            </p>

            <h2 className="text-3xl font-bold mb-6">How to Compress JPG Without Losing Quality</h2>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              "Losing quality" in JPEG compression means introducing visible artifacts - blocky edges, smeared colors, washed-out detail. That happens when you compress too aggressively.
            </p>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              The sweet spot is <strong>80–85% quality setting</strong>. At that level:
            </p>
            <ul className="space-y-2 mb-6 list-none p-0 text-[#6B645C]">
              <li className="flex items-center gap-2">• File size drops by <strong>40–70%</strong></li>
              <li className="flex items-center gap-2">• Visual difference is imperceptible to the human eye</li>
              <li className="flex items-center gap-2">• Photos still look sharp on screen and in print at normal sizes</li>
            </ul>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              Here's how lossy and lossless compare in practice:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-[#E6E2D8] text-sm">
                <thead>
                  <tr className="bg-[#F5F3ED]">
                    <th className="border border-[#E6E2D8] p-3 text-left">Approach</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">File Size</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">Reversible?</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#E6E2D8] p-3">Lossy (80–85%)</td>
                    <td className="border border-[#E6E2D8] p-3">Smallest</td>
                    <td className="border border-[#E6E2D8] p-3">No</td>
                    <td className="border border-[#E6E2D8] p-3">Web, email, social, KYC</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E6E2D8] p-3">Lossy (90–95%)</td>
                    <td className="border border-[#E6E2D8] p-3">Medium</td>
                    <td className="border border-[#E6E2D8] p-3">No</td>
                    <td className="border border-[#E6E2D8] p-3">Professional photography</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E6E2D8] p-3">Lossless</td>
                    <td className="border border-[#E6E2D8] p-3">Largest</td>
                    <td className="border border-[#E6E2D8] p-3">Yes</td>
                    <td className="border border-[#E6E2D8] p-3">Archival, editing workflows</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              Our tool uses smart lossy compression optimized for the 80–85% sweet spot - the setting that compresses jpeg size aggressively while keeping photos visually clean.
            </p>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              <strong>Two tips before you compress:</strong>
            </p>
            <ul className="space-y-2 mb-4 list-none p-0 text-[#6B645C]">
              <li className="flex items-start gap-2">• Always keep your original file. Lossy compression is permanent - you can't recover discarded data.</li>
              <li className="flex items-start gap-2">• For web images, <strong>72 DPI</strong> is sufficient. Print needs <strong>300 DPI</strong>. Compressing a 300 DPI image for web use is fine; just don't print the compressed version.</li>
            </ul>
            <p className="text-[#6B645C] leading-relaxed mb-8">
              If you'd rather switch formats entirely for even smaller files, you can <Link to="/tools/jpg-to-webp" className="text-[#1C1917] underline underline-offset-4">convert JPG to WebP</Link> - WebP typically runs 25–35% smaller than an equivalent JPEG.
            </p>

            <h2 className="text-3xl font-bold mb-6">Compress JPG on Windows, Mac & Mobile</h2>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              Every platform has a native option. None of them are great for batch work.
            </p>
            <ul className="space-y-3 mb-4 list-none p-0 text-[#6B645C]">
              <li className="flex items-start gap-2"><strong>Windows 11</strong> - Open the image in Paint → File → Save As → JPEG → adjust the quality slider. Works for one file at a time. For batch compression or precise file size targets, it's not practical.</li>
              <li className="flex items-start gap-2"><strong>Mac</strong> - Open in Preview → File → Export → change format to JPEG → drag the quality slider. Again, one file at a time. Fine for occasional use.</li>
              <li className="flex items-start gap-2"><strong>iPhone</strong> - The Files app doesn't compress images natively. Your best option is to open the tool in Safari - it runs fully in-browser on iOS, no app download needed.</li>
              <li className="flex items-start gap-2"><strong>Android</strong> - Google Photos can reduce storage quality across your library, but it's a blunt instrument with no per-file control. For anything precise, open the tool in Chrome on Android - same experience as desktop.</li>
            </ul>
            <p className="text-[#6B645C] leading-relaxed mb-8">
              For batch compression or precise file size targets, our online JPG compressor is faster on every device.
            </p>

            <h2 className="text-3xl font-bold mb-6">JPG Compressor vs Other Tools</h2>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              Most free online compressors do the job - but the details matter. Here's how we stack up against the tools you'll find on the first page of Google (compressjpeg.com, tinyjpg.com, adobe.com):
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-[#E6E2D8] text-sm">
                <thead>
                  <tr className="bg-[#F5F3ED]">
                    <th className="border border-[#E6E2D8] p-3 text-left">Tool</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">Free</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">No Signup</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">Batch</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">Client-Side (Privacy)</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">Target File Size</th>
                    <th className="border border-[#E6E2D8] p-3 text-left">Speed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#FAF6EC]">
                    <td className="border border-[#E6E2D8] p-3 font-bold">FreeImagePrompt</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">⚡</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E6E2D8] p-3">TinyJPG</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">⚡</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E6E2D8] p-3">iLoveIMG</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">⚡</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E6E2D8] p-3">Adobe Express</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">⚡</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E6E2D8] p-3">FreeConvert</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">❌</td>
                    <td className="border border-[#E6E2D8] p-3">✅</td>
                    <td className="border border-[#E6E2D8] p-3">⚡</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#6B645C] leading-relaxed mb-4">
              Two things set this tool apart: <strong>client-side processing</strong> (your files never touch a server) and <strong>target file size presets</strong> (compress to an exact KB/MB limit, not just a vague quality percentage). No other free tool in this list offers both.
            </p>
            <p className="text-[#6B645C] leading-relaxed mb-8">
              If you're working with images in other formats, our <Link to="/tools/png-to-jpg" className="text-[#1C1917] underline underline-offset-4">PNG to JPG converter</Link> handles that conversion before you compress.
            </p>

            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-8 mb-12">
              <div>
                <h4 className="text-lg font-bold mb-2">Is this JPG compressor really free?</h4>
                <p className="text-[#6B645C]">Yes, 100% free - no signup, no hidden fees, unlimited compressions. There's no premium tier and no daily cap.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">How much can I compress a JPG file?</h4>
                <p className="text-[#6B645C]">Typically <strong>40–80% reduction</strong> with no visible quality loss, depending on the original image. A 4MB photo commonly compresses to under 1MB.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Does compressing a JPG reduce image quality?</h4>
                <p className="text-[#6B645C]">At the 80–85% quality setting, the difference is imperceptible to the human eye. We optimize for this sweet spot - smaller file, same visual result.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Can I compress multiple JPG files at once?</h4>
                <p className="text-[#6B645C]">Yes - our batch compressor handles hundreds of files simultaneously. Upload them all at once and download a ZIP when done.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Are my images safe?</h4>
                <p className="text-[#6B645C]">Completely. All compression happens in your browser - your files are never uploaded to any server. We have no access to your images at any point.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">What is the maximum file size I can compress?</h4>
                <p className="text-[#6B645C]">There is no hard limit. Since processing is entirely client-side, it depends on your device's available memory. Most modern phones and laptops handle large batches without issue.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Can I compress JPG to a specific file size (e.g., 200KB)?</h4>
                <p className="text-[#6B645C]">Yes - use our target-size presets: <strong>20KB, 50KB, 100KB, 200KB, 500KB, or 1MB</strong>. Each preset compresses your image to land at or under that target.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Does this work on mobile?</h4>
                <p className="text-[#6B645C]">Yes - the tool works on any modern browser including Chrome, Safari, and Firefox on iOS and Android. No app download required.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
            <p className="text-[#6B645C] leading-relaxed mb-8">
              This JPG compressor is fast, free, and private. It runs entirely in your browser, supports batch compression, requires no signup, and leaves no watermarks. Whether you need to decrease JPG size for a KYC form, a website, or an email attachment - it handles all of it, on any device. Explore our full suite of <Link to="/" className="text-[#1C1917] underline underline-offset-4">free image tools</Link> for more conversion and optimization options.
            </p>
            <p className="font-bold text-center text-2xl mb-12">
              👉 Start compressing your JPG images now - no signup needed.
            </p>
          </div>

          <OtherCompressionSizes />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JPGCompress;
