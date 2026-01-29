import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cesiha.com";
    const supabase = await createClient();

    // Fetch all published posts
    const { data: posts } = await supabase
        .from("posts")
        .select("slug, updated_at")
        .eq("published", true);

    const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        ...postEntries,
    ];
}
