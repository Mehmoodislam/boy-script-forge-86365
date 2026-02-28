import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { blogPosts } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://freeimageprompt.com';

    const staticPages = [
        '',
        '/gallery',
        '/packs',
        '/blog',
        '/contact',
        '/privacy-policy',
        '/terms-of-services',
        '/tools/jpg-compress',
        '/tools/youtube-downloader',
        '/tools/grade-calculator',
        '/tools/mock-interview',
    ].map((url) => ({
        url: `${baseUrl}${url}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: url === '' ? 1 : 0.8,
    }));

    const blogPostPages = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...blogPostPages];
}
