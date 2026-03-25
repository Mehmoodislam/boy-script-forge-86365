import { useEffect } from "react";

interface SEOHeadProps {
    title: string;
    description: string;
    canonicalUrl?: string;
    keywords?: string;
    schema?: object;
}

const SEOHead = ({ title, description, schema }: SEOHeadProps) => {
    useEffect(() => {
        document.title = title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", description);
        }

        // Handle Schema Injection
        let scriptTag = document.getElementById("json-ld-schema");
        if (schema) {
            if (!scriptTag) {
                scriptTag = document.createElement("script");
                scriptTag.id = "json-ld-schema";
                scriptTag.setAttribute("type", "application/ld+json");
                document.head.appendChild(scriptTag);
            }
            scriptTag.innerHTML = JSON.stringify(schema);
        } else if (scriptTag) {
            scriptTag.remove();
        }

        return () => {
            // Cleanup on unmount
            const existingTag = document.getElementById("json-ld-schema");
            if (existingTag) existingTag.remove();
        };
    }, [title, description, schema]);

    return null;
};

export default SEOHead;
