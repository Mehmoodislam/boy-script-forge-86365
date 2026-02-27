"use client";

import { useState } from "react";
import { Youtube, Download, Loader2, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function YouTubeContent() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState<{
        title: string;
        thumbnail: string;
        formats: Array<{
            quality: string;
            downloadUrl: string;
        }>;
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
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/youtube-download`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url }),
                }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to process video");

            if (data.formats && data.formats.length > 0) {
                setVideoInfo({
                    title: data.title || "YouTube Video",
                    thumbnail: data.thumbnail || "",
                    formats: data.formats,
                });
                toast.success("Video ready for download!");
            } else {
                toast.error("No download formats available");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to process video. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
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

                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste YouTube video URL here..."
                                className="flex-1 h-12 rounded-xl border border-input bg-background px-4 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                            />
                            <button
                                onClick={handleDownload}
                                disabled={loading}
                                className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
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

                        {videoInfo && (
                            <div className="mt-6 p-4 rounded-xl border border-border bg-background">
                                <div className="flex flex-col sm:flex-row gap-4 items-start mb-4">
                                    {videoInfo.thumbnail && (
                                        <img
                                            src={videoInfo.thumbnail}
                                            alt={videoInfo.title}
                                            className="w-full sm:w-48 rounded-lg object-cover aspect-video"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-foreground mb-3">{videoInfo.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {videoInfo.formats.map((format, index) => (
                                                <a
                                                    key={index}
                                                    href={format.downloadUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    {format.quality}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border mb-12">
                        <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                            This tool is for personal use only. Please respect copyright laws and YouTube's terms of service.
                        </p>
                    </div>

                    <article className="prose prose-lg dark:prose-invert max-w-none">
                        <h2>How to Download YouTube Videos Online Free</h2>
                        <p>Our YouTube Video Downloader is a fast, free, and easy-to-use tool.</p>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
