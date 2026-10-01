import React, { useEffect, useRef } from "react";

interface AdBannerProps {
  className?: string;
  label?: string;
}

const AdBanner300x250: React.FC<AdBannerProps> = ({
  className = "",
  label = "Advertisement",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create an iframe to safely isolate window.atOptions and prevent duplicate variable clash
    const iframe = document.createElement("iframe");
    iframe.width = "300";
    iframe.height = "250";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    iframe.title = "Sponsored Advertisement";

    const iframeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              background: transparent; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              width: 300px; 
              height: 250px; 
              overflow: hidden; 
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : 'ce490c1a7dc0157c49100d28a4756101',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highrevenueformat.com/ce490c1a7dc0157c49100d28a4756101/invoke.js"></script>
        </body>
      </html>
    `;

    iframe.srcdoc = iframeHtml;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(iframe);
  }, []);

  return (
    <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1.5 select-none">
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-w-[300px] min-h-[250px] bg-muted/10 border border-border/40 rounded-xl overflow-hidden shadow-sm flex items-center justify-center transition-all hover:border-primary/20"
      />
    </div>
  );
};

export default AdBanner300x250;
