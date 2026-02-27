"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import { analytics } from "@/firebase";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        if (analytics) {
            console.log("✅ Firebase Analytics initialized");
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <TooltipProvider>
                    {children}
                    <Toaster />
                    <Sonner />
                    <Analytics />
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
