import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/database";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = (await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()) as { data: Post | null };

    if (!post) {
        return { title: "Yazı Bulunamadı" };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cesiha.com";
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.excerpt || `${post.content.substring(0, 160)}...`,
        keywords: [post.title, "Türkiye", "gezi", "seyahat"],
        authors: [{ name: "Cesiha" }],
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            type: "article",
            title: post.title,
            description: post.excerpt || `${post.content.substring(0, 160)}...`,
            url: postUrl,
            siteName: "Cesiha",
            locale: "tr_TR",
            publishedTime: post.created_at,
            modifiedTime: post.updated_at,
            images: post.cover_image
                ? [
                    {
                        url: post.cover_image,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || `${post.content.substring(0, 160)}...`,
            images: post.cover_image ? [post.cover_image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = (await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()) as { data: Post | null };

    if (!post) {
        notFound();
    }

    const readingTime = Math.ceil(post.content.split(" ").length / 200);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cesiha.com";

    // JSON-LD Structured Data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt || post.content.substring(0, 160),
        image: post.cover_image || undefined,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        author: {
            "@type": "Organization",
            name: "Cesiha",
            url: siteUrl,
        },
        publisher: {
            "@type": "Organization",
            name: "Cesiha",
            url: siteUrl,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/blog/${post.slug}`,
        },
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article>
                {/* Header */}
                <header className="pt-12 pb-8">
                    <div className="container-narrow">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm mb-8 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Tüm Yazılar
                        </Link>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[var(--text-primary)] leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed mb-6">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] pb-6 border-b border-[var(--border-color)]">
                            <time dateTime={post.created_at}>
                                {format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}
                            </time>
                            <span>·</span>
                            <span>{readingTime} dk okuma</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.cover_image && (
                    <div className="mb-12">
                        <div className="container-wide">
                            <div className="relative aspect-[21/9] overflow-hidden rounded-sm bg-gray-100">
                                <Image
                                    src={post.cover_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="pb-16">
                    <div className="container-narrow">
                        <div className="article-body">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-3xl font-['Playfair_Display'] font-bold mt-12 mb-4">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-2xl font-['Playfair_Display'] font-semibold mt-10 mb-4">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-xl font-['Playfair_Display'] font-semibold mt-8 mb-3">
                                            {children}
                                        </h3>
                                    ),
                                    p: ({ children, node }) => {
                                        // Check if paragraph contains only an image
                                        const hasOnlyImage = node?.children?.length === 1 &&
                                            node?.children?.[0]?.type === 'element' &&
                                            (node?.children?.[0] as any)?.tagName === 'img';

                                        if (hasOnlyImage) {
                                            return <>{children}</>;
                                        }
                                        return <p className="mb-6 leading-[1.9]">{children}</p>;
                                    },
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-hover)]"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal pl-6 mb-6 space-y-2">
                                            {children}
                                        </ol>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-[3px] border-[var(--text-primary)] pl-6 my-8 italic text-[var(--text-secondary)]">
                                            {children}
                                        </blockquote>
                                    ),
                                    code: ({ children }) => (
                                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[0.9em] font-mono">
                                            {children}
                                        </code>
                                    ),
                                    pre: ({ children }) => (
                                        <pre className="bg-[#292929] text-gray-100 p-5 rounded overflow-x-auto my-6 text-sm">
                                            {children}
                                        </pre>
                                    ),
                                    img: ({ src, alt }) => {
                                        const imgSrc = typeof src === "string" ? src : "";
                                        return (
                                            <figure className="my-8">
                                                <Image
                                                    src={imgSrc}
                                                    alt={alt || ""}
                                                    width={800}
                                                    height={450}
                                                    className="rounded-sm w-full"
                                                />
                                                {alt && (
                                                    <figcaption className="text-center text-sm text-[var(--text-muted)] mt-3">
                                                        {alt}
                                                    </figcaption>
                                                )}
                                            </figure>
                                        );
                                    },
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--border-color)] py-8">
                    <div className="container-narrow">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Diğer yazıları gör
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
}
