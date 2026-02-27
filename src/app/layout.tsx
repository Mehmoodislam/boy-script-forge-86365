import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Boy Script Forge - Tools & Resources",
    description: "A collection of useful tools and resources for developers and creators.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
