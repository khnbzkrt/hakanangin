import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/database";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Cesiha - Türkiye'nin Keşfedilmemiş Rotaları",
    description: "Türkiye'nin doğal güzellikleri, tarihi dokusu ve kültürel mirasları hakkında derinlemesine yazılar ve keşif rotaları.",
};

export default async function HomePage() {
    const supabase = await createClient();

    const { data: posts } = (await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(10)) as { data: Post[] | null };

    if (!posts || posts.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="container-wide pb-8 md:pb-12">
            {/* Featured Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Hero - Left */}
                {posts[0] && <FeaturedCard post={posts[0]} size="large" />}

                {/* Right Side - 2x2 Grid or Stack */}
                <div className="grid grid-cols-2 gap-5">
                    {posts[1] && <FeaturedCard post={posts[1]} size="small" />}
                    {posts[2] && <FeaturedCard post={posts[2]} size="small" />}
                    {posts[3] && <FeaturedCard post={posts[3]} size="small" />}
                    {posts[4] && <FeaturedCard post={posts[4]} size="small" />}
                </div>
            </div>

            {/* Latest Posts */}
            {posts.length > 5 && (
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-(--text-primary)">
                            Son Yazılar
                        </h2>
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-(--accent) hover:underline flex items-center gap-1"
                        >
                            Tümünü Gör
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice(5, 11).map((post) => (
                            <ArticleCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function FeaturedCard({ post, size }: { post: Post; size: "large" | "small" }) {
    const readingTime = Math.ceil(post.content.split(" ").length / 200);
    const isLarge = size === "large";

    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`group block relative overflow-hidden rounded-2xl ${isLarge ? "row-span-2 min-h-[500px]" : "min-h-[240px]"}`}
        >
            {/* Background */}
            {post.cover_image ? (
                <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority={isLarge}
                />
            ) : (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <svg className={`text-slate-300 ${isLarge ? "w-24 h-24" : "w-16 h-16"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )}

            {/* Overlay - Darker and more consistent */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-2 text-white/90 text-xs font-medium mb-3">
                    <time dateTime={post.created_at}>
                        {format(new Date(post.created_at), "d MMM yyyy", { locale: tr })}
                    </time>
                    <span className="opacity-60">·</span>
                    <span>{readingTime} dk</span>
                </div>

                <h2 className={`font-['Playfair_Display'] font-bold !text-white leading-tight group-hover:text-emerald-300 transition-colors ${isLarge ? "text-2xl md:text-3xl lg:text-4xl mb-4" : "text-lg md:text-xl line-clamp-2"}`}>
                    {post.title}
                </h2>

                {isLarge && post.excerpt && (
                    <p className="!text-white/90 line-clamp-2 text-sm md:text-base max-w-lg leading-relaxed">
                        {post.excerpt}
                    </p>
                )}
            </div>
        </Link>
    );
}

function ArticleCard({ post }: { post: Post }) {
    const readingTime = Math.ceil(post.content.split(" ").length / 200);

    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <article>
                {/* Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-5 bg-slate-100 shadow-sm">
                    {post.cover_image ? (
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium mb-3">
                    <time dateTime={post.created_at}>
                        {format(new Date(post.created_at), "d MMM yyyy", { locale: tr })}
                    </time>
                    <span className="opacity-40">·</span>
                    <span>{readingTime} dk okuma</span>
                </div>

                <h3 className="text-xl font-['Playfair_Display'] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-3 line-clamp-2">
                    {post.title}
                </h3>

                {post.excerpt && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                        {post.excerpt}
                    </p>
                )}
            </article>
        </Link>
    );
}

function EmptyState() {
    return (
        <div className="container-wide py-24">
            <div className="max-w-lg mx-auto text-center">
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-linear-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-['Playfair_Display'] font-bold text-(--text-primary) mb-4">
                    Yakında Burada
                </h1>

                <p className="text-lg text-(--text-secondary) leading-relaxed">
                    Türkiye&apos;nin eşsiz doğal güzellikleri ve zengin tarihi hakkında yazılarımız çok yakında burada olacak.
                </p>
            </div>
        </div>
    );
}
