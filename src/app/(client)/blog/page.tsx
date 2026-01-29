import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/database";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Yazılar",
    description: "Türkiye'nin doğal güzellikleri, tarihi mekanları ve keşfedilmmemiş rotaları hakkında yazılarımız.",
    openGraph: {
        title: "Tüm Yazılar | Cesiha",
        description: "Türkiye'nin her köşesinden keşif notları ve gezi yazıları.",
    }
};

export default async function BlogPage() {
    const supabase = await createClient();

    const { data: posts } = (await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })) as { data: Post[] | null };

    return (
        <div className="py-12 md:py-16">
            <div className="container-wide">
                {/* Header */}
                <header className="mb-12 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-[var(--text-primary)] mb-4">
                        Tüm Yazılar
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)]">
                        Türkiye&apos;nin doğal güzellikleri ve zengin tarihi hakkında
                        yazılarımız
                    </p>
                </header>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogPostItem key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[var(--text-primary)] mb-3">
                            Henüz yazı yok
                        </h2>
                        <p className="text-[var(--text-secondary)]">
                            Yayınlanmış yazı bulunmuyor. Yakında yeni içerikler eklenecek!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function BlogPostItem({ post }: { post: Post }) {
    const readingTime = Math.ceil(post.content.split(" ").length / 200);

    return (
        <Link href={`/blog/${post.slug}`} className="group">
            <article className="h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 mb-4">
                    {post.cover_image ? (
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-300 text-5xl font-['Playfair_Display'] font-bold">
                                {post.title.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2 line-clamp-2">
                        {post.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <time dateTime={post.created_at}>
                            {format(new Date(post.created_at), "d MMM yyyy", { locale: tr })}
                        </time>
                        <span>•</span>
                        <span>{readingTime} dk okuma</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
