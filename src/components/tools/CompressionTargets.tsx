import Link from "next/link";

const targets = [
    "5kb", "10kb", "15kb", "20kb", "25kb", "30kb", "40kb", "45kb", "50kb", "60kb", "70kb",
    "80kb", "90kb", "100kb", "150kb", "200kb", "250kb", "300kb", "400kb", "500kb", "1mb", "2mb", "5mb"
];

const CompressionTargets = () => {
    return (
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl font-bold mb-6 text-foreground/80">Other Compression Sizes</h2>
            <div className="flex flex-wrap gap-3">
                <Link
                    href="/tools/jpg-compress"
                    className="px-4 py-2 border-2 border-cyan-600/50 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400/30 rounded-xl font-bold hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all hover:scale-105"
                >
                    JPG Between 20kb to 50kb
                </Link>
                {targets.map(size => (
                    <Link
                        key={size}
                        href={size === "5kb" ? "/tools/compress-jpg-to-5kb" : size === "10kb" ? "/tools/compress-jpg-to-10kb" : size === "15kb" ? "/tools/compress-jpg-to-15kb" : `/tools/jpg-compress-to-${size}`}
                        className="px-4 py-2 border-2 border-cyan-600/50 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400/30 rounded-xl font-bold hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all hover:scale-105"
                    >
                        {size}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CompressionTargets;
