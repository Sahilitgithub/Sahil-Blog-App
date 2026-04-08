import { getPosts } from "@/utils/prisma/prismaPost";
import type { MetadataRoute } from 'next'

// Sitemap.xml file for all web application
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
    // Fetch all posts together
    const posts = await getPosts();

    // Generate sitemap posts data
    const sitemapPostsData: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${process.env.BASE_URL}/product/${post.slug}`,
        lastModified: new Date(post.updatedAt),
    })) ?? [];

    return [
        ...sitemapPostsData
    ]
}