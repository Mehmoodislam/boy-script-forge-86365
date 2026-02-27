import type { Metadata } from "next";
import MockContent from "./MockContent";

export const metadata: Metadata = {
    title: "Mock Interview - Practice with AI | FreeImagePrompt",
    description: "Prepare for your job interview with AI-generated questions and feedback.",
    keywords: "mock interview, ai interview, practice interview, job interview preparation",
};

export default function MockPage() {
    return <MockContent />;
}
