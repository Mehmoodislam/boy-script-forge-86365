import React from "react";
import AdBanner300x250 from "./AdBanner300x250";

interface AdBannerDoubleProps {
  className?: string;
  label?: string;
}

const AdBannerDouble: React.FC<AdBannerDoubleProps> = ({
  className = "",
  label = "Sponsored Links",
}) => {
  return (
    <div className={`my-8 py-4 px-2 w-full flex flex-col items-center justify-center ${className}`}>
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-3 select-none">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center justify-center gap-6 max-w-5xl mx-auto">
        <AdBanner300x250 label="" className="my-0" />
        <AdBanner300x250 label="" className="my-0" />
      </div>
    </div>
  );
};

export default AdBannerDouble;
