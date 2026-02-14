import { useState } from "react";
import { Youtube, Download, Loader2, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

const YouTubeDownloader = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<{
    title: string;
    thumbnail: string;
    downloadUrl: string;
  } | null>(null);

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;
    return regex.test(url);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    if (!isValidYouTubeUrl(url)) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setVideoInfo(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-download`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to process video");

      if (data.downloadUrl) {
        setVideoInfo({
          title: data.title || "YouTube Video",
          thumbnail: data.thumbnail || "",
          downloadUrl: data.downloadUrl,
        });
        toast.success("Video ready for download!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process video. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="YouTube Video Downloader - Free Online Tool | FreeImagePrompt"
        description="Download YouTube videos for free in HD quality. Paste the video URL and download instantly. Fast, free, and easy to use YouTube video downloader."
        canonicalUrl="https://freeimageprompt.com/tools/youtube-downloader"
        keywords="youtube video downloader, download youtube videos, free youtube downloader, youtube to mp4, youtube download online"
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Youtube className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              YouTube Video Downloader
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Download any YouTube video for free. Just paste the video URL below and click download.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video URL here..."
                className="flex-1 h-12 rounded-xl border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              />
              <button
                onClick={handleDownload}
                disabled={loading}
                className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                )}
              </button>
            </div>

            {/* Video Info Result */}
            {videoInfo && (
              <div className="mt-6 p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row gap-4 items-center">
                {videoInfo.thumbnail && (
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-full sm:w-48 rounded-lg object-cover aspect-video"
                  />
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-medium text-foreground mb-2">{videoInfo.title}</h3>
                  <a
                    href={videoInfo.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                    Download Video
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border mb-12">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              This tool is for personal use only. Please respect copyright laws and YouTube's terms of service. Only download videos you have permission to download.
            </p>
          </div>

          {/* HTML Content Section */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h2>How to Download YouTube Videos Online Free</h2>
            <p>
              Our <strong>YouTube Video Downloader</strong> is a fast, free, and easy-to-use tool that lets you
              download any YouTube video directly to your device. Whether you want to save tutorials,
              music videos, or educational content for offline viewing, this tool makes it simple.
            </p>

            <h3>How to Use YouTube Video Downloader</h3>
            <ol>
              <li>Copy the YouTube video URL from your browser's address bar or the share button</li>
              <li>Paste the URL in the input field above</li>
              <li>Click the <strong>"Download"</strong> button</li>
              <li>Wait for the video to be processed</li>
              <li>Click the download link to save the video to your device</li>
            </ol>

            <h3>Features of Our YouTube Downloader</h3>
            <ul>
              <li><strong>100% Free</strong> — No hidden charges or subscriptions required</li>
              <li><strong>No Registration</strong> — Start downloading immediately without creating an account</li>
              <li><strong>Fast Processing</strong> — Videos are processed quickly for instant downloads</li>
              <li><strong>All Formats Supported</strong> — Download videos in MP4, WebM, and more</li>
              <li><strong>Mobile Friendly</strong> — Works perfectly on phones, tablets, and desktops</li>
            </ul>

            <h3>Frequently Asked Questions</h3>

            <h4>Is it legal to download YouTube videos?</h4>
            <p>
              Downloading YouTube videos for personal, offline viewing is generally acceptable. However,
              redistributing or using copyrighted content without permission is illegal. Always respect
              the content creator's rights.
            </p>

            <h4>What video quality can I download?</h4>
            <p>
              The available quality depends on the original video upload. Our tool supports downloading
              videos in the highest quality available, including HD and Full HD when the video supports it.
            </p>

            <h4>Can I download YouTube Shorts?</h4>
            <p>
              Yes! Our YouTube Video Downloader supports regular videos, Shorts, and other YouTube
              content formats. Simply paste the Shorts URL and download.
            </p>

            <h4>Do I need to install any software?</h4>
            <p>
              No! Our tool works entirely in your browser. There's nothing to install or configure.
              Just paste the URL and download.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default YouTubeDownloader;
