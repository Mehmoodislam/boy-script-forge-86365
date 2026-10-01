import { Link } from "react-router-dom";
import { Layers, ChevronRight } from "lucide-react";
import AdBannerDouble from "@/components/ads/AdBannerDouble";

const OtherCompressionSizes = () => {
    const sizes = [
        { label: "5kb", to: "/tools/compress-jpg-to-5kb" },
        { label: "10kb", to: "/tools/compress-jpg-to-10kb" },
        { label: "15kb", to: "/tools/compress-jpg-to-15kb" },
        { label: "20kb", to: "/tools/compress-jpg-to-20kb" },
        { label: "25kb", to: "/tools/compress-jpg-to-25kb" },
        { label: "30kb", to: "/tools/compress-jpg-to-30kb" },
        { label: "35kb", to: "/tools/compress-jpg-to-35kb" },
        { label: "40kb", to: "/tools/compress-jpg-to-40kb" },
        { label: "45kb", to: "/tools/compress-jpg-to-45kb" },
        { label: "50kb", to: "/tools/compress-jpg-to-50kb" },
        { label: "60kb", to: "/tools/compress-jpg-to-60kb" },
        { label: "70kb", to: "/tools/compress-jpg-to-70kb" },
        { label: "80kb", to: "/tools/compress-jpg-to-80kb" },
        { label: "90kb", to: "/tools/compress-jpg-to-90kb" },
        { label: "100kb", to: "/tools/compress-jpg-to-100kb" },
        { label: "150kb", to: "/tools/compress-jpg-to-150kb" },
        { label: "200kb", to: "/tools/compress-jpg-to-200kb" },
        { label: "250kb", to: "/tools/compress-jpg-to-250kb" },
        { label: "300kb", to: "/tools/compress-jpg-to-300kb" },
        { label: "400kb", to: "/tools/compress-jpg-to-400kb" },
        { label: "500kb", to: "/tools/compress-jpg-to-500kb" },
        { label: "1mb", to: "/tools/compress-jpg-to-1mb" },
        { label: "2mb", to: "/tools/compress-jpg-to-2mb" },
        { label: "5mb", to: "/tools/compress-jpg-to-5mb" },
    ];

    return (
        <div className="mt-16">
            <AdBannerDouble className="mb-8" />
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00bcd4]/5 to-transparent rounded-[2.5rem] -m-4 blur-xl pointer-events-none" />

                <div className="relative bg-[#0c141d]/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-[#1a2b3b] shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Layers className="w-32 h-32 text-[#00bcd4]" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                                Other Compression Sizes
                            </h2>
                            <p className="text-gray-400 font-medium">
                                Quickly jump to your target file size for specific requirements.
                            </p>
                        </div>

                        <Link
                            to="/tools/jpg-compress"
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00bcd4] text-white font-black text-sm hover:shadow-[0_0_20px_rgba(0,188,212,0.4)] transition-all active:scale-95"
                        >
                            <div className="p-1 px-2 rounded bg-white/20 text-xs">BATCH</div>
                            JPG Between 20kb to 50kb
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {sizes.map((size) => (
                            <Link
                                key={size.to}
                                to={size.to}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#1a2b3b] bg-[#141d27]/50 text-[#00bcd4] font-bold text-sm hover:border-[#00bcd4] hover:bg-[#00bcd4]/10 hover:shadow-[0_0_15px_rgba(0,188,212,0.1)] transition-all group scale-100 hover:scale-105 active:scale-95"
                            >
                                <span className="text-[10px] uppercase opacity-40 mb-1 group-hover:opacity-100 transition-opacity">Target</span>
                                {size.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherCompressionSizes;
