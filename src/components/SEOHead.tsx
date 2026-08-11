import { useEffect } from "react";

const SITE_URL = "https://freeimageprompt.com";

interface SEOHeadProps {
    title: string;
    description: string;
    canonicalUrl?: string;
    keywords?: string;
    schema?: object | object[];
    image?: string;
}

const SEOHead = ({ title, description, canonicalUrl, keywords, schema, image }: SEOHeadProps) => {
    useEffect(() => {
        const canonical = canonicalUrl || `${SITE_URL}${window.location.pathname}`;
        const shareImage = image || `${SITE_URL}/og-share.png`;

        document.title = title;

        const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
            let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        const upsertLink = (rel: string, href: string) => {
            let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
            if (!el) {
                el = document.createElement("link");
                el.setAttribute("rel", rel);
                document.head.appendChild(el);
            }
            el.setAttribute("href", href);
        };

        upsertMeta("name", "description", description);
        if (keywords) upsertMeta("name", "keywords", keywords);

        upsertLink("canonical", canonical);

        upsertMeta("property", "og:type", "website");
        upsertMeta("property", "og:url", canonical);
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:image", shareImage);

        upsertMeta("name", "twitter:card", "summary_large_image");
        upsertMeta("name", "twitter:url", canonical);
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:image", shareImage);

        // Handle Schema Injection
        const effectiveSchema = schema || {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "url": canonical,
            "description": description,
        };
        const schemaContent = Array.isArray(effectiveSchema)
            ? JSON.stringify(effectiveSchema.map((s) => (s["@context"] ? s : { "@context": "https://schema.org", ...s })))
            : JSON.stringify(effectiveSchema);
        let scriptTag = document.getElementById("json-ld-schema");
        if (!scriptTag) {
            scriptTag = document.createElement("script");
            scriptTag.id = "json-ld-schema";
            scriptTag.setAttribute("type", "application/ld+json");
            document.head.appendChild(scriptTag);
        }
        scriptTag.innerHTML = schemaContent;

        return () => {
            // Cleanup on unmount
            const existingTag = document.getElementById("json-ld-schema");
            if (existingTag) existingTag.remove();
        };
    }, [title, description, canonicalUrl, keywords, schema, image]);

    return null;
};

export default SEOHead;
