import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
  ogType?: string;
}

const SEOHead = ({ 
  title, 
  description, 
  canonicalUrl, 
  keywords,
  ogType = "website" 
}: SEOHeadProps) => {
  useEffect(() => {
    // Update page title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Helper to update or create OG tags
    const updateOGTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update meta description
    updateMetaTag('description', description);
    
    // Update keywords if provided
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update OG tags
    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:type', ogType);
    updateOGTag('og:url', canonicalUrl);

    // Add/update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Cleanup function
    return () => {
      // Reset title on unmount if needed
    };
  }, [title, description, canonicalUrl, keywords, ogType]);

  return null;
};

export default SEOHead;
