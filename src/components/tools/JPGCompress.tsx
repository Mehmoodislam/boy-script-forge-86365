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
import imageCompression from "browser-image-compression";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";

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
  const pageTitle =
    "Batch JPG Image Compressor - Compress Multiple JPGs Fast & Free";
  const metaDescription =
    "Compress multiple JPG/JPEG images at once without losing quality. 100% client-side, secure, and fast batch optimization directly in your browser.";
  const h1Title = "Batch JPG Compressor";
  const subTitle =
    "Upload multiple images and compress them instantly. Secure, fast, and high-quality optimization directly in your browser.";

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
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title={pageTitle} description={metaDescription} />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 mb-6">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{h1Title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subTitle}
            </p>
          </div>

          <div className="bg-card border rounded-3xl p-8 shadow-xl mb-10">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed rounded-2xl cursor-pointer hover:bg-accent/5"
            >
              <Upload className="h-10 w-10 text-primary mb-4" />
              <p className="font-semibold text-lg">
                Drop your JPG images here
              </p>
              <p className="text-sm text-muted-foreground">
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
                  className="flex items-center justify-between border p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    {result.status === "completed" ? (
                      <img
                        src={result.previewUrl}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JPGCompress;