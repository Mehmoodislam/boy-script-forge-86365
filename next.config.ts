import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        unoptimized: true, // For easier deployment to static sites if needed, or adjust as necessary
    },
};

export default nextConfig;
