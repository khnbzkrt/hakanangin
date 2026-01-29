import { Post } from "@/types/database";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const readingTime = Math.ceil(post.content.split(" ").length / 200);

    return (
        <article className="group relative bg-white rounded-2xl overflow-hidden card-hover border border-stone-100">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

            {/* Cover Image */}
            <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden">
                <div className="relative h-52 bg-gradient-to-br from-emerald-500 via-green-500 to-amber-500">
                    {post.cover_image ? (
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 animate-float"></div>
                            <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }}></div>
                            <span className="text-white text-8xl font-black opacity-20 group-hover:scale-110 transition-transform duration-500">
                                {post.title.charAt(0)}
                            </span>
                        </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
            </Link>

            {/* Content */}
            <div className="relative p-6 z-20">
                {/* Meta tags */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500/10 to-amber-500/10 text-emerald-700 border border-emerald-200/50">
                        Keşfet
                    </span>
                    <div className="flex items-center gap-1 text-xs text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{readingTime} dk</span>
                    </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors duration-300 mb-3 line-clamp-2 leading-tight">
                        {post.title}
                    </h2>
                </Link>

                <p className="text-stone-500 mb-4 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <time dateTime={post.created_at}>
                            {format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}
                        </time>
                    </div>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group/link"
                    >
                        Devamını Oku
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
