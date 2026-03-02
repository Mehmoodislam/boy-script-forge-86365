import { useEffect } from "react";

interface SEOHeadProps {
    title: string;
    description: string;
    canonicalUrl?: string;
    keywords?: string;
}

const SEOHead = ({ title, description }: SEOHeadProps) => {
    useEffect(() => {
        document.title = title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", description);
        }
    }, [title, description]);

    return null;
};

export default SEOHead;
