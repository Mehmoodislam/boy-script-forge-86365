import type { Metadata } from "next";
import YouTubeContent from "./YouTubeContent";

export const metadata: Metadata = {
    title: "YouTube Video Downloader - Free Online Tool | FreeImagePrompt",
    description: "Download YouTube videos for free in HD quality. Paste the video URL and download instantly. Fast, free, and easy to use YouTube video downloader.",
    keywords: "youtube video downloader, download youtube videos, free youtube downloader, youtube to mp4, youtube download online",
};

export default function YouTubePage() {
    return <YouTubeContent />;
}
