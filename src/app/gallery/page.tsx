import type { Metadata } from "next";
import GalleryContent from "./GalleryContent";

export const metadata: Metadata = {
    title: "Free AI Image Prompts for Stylish Boy Portraits | FreeImagePrompt",
    description: "Discover handcrafted AI image prompts for creating stunning stylish boy portraits. Perfect for Midjourney, DALL-E, and Stable Diffusion.",
    keywords: "AI image prompts, stylish boy portraits, midjourney prompts, dall-e prompts, stable diffusion prompts, boy photo creator",
};

export default function GalleryPage() {
    return <GalleryContent />;
}
