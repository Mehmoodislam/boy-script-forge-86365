import type { Metadata } from "next";
import GradeContent from "./GradeContent";

export const metadata: Metadata = {
    title: "Grade Calculator Guide - Calculate Test & Final Grades Easily | FreeImagePrompt",
    description: "Use our free grade calculator to calculate test scores, weighted grades, and your final grade.",
    keywords: "grade calculator, calculate grade, final grade calculator, weighted grade calculator",
};

export default function GradePage() {
    return <GradeContent />;
}
