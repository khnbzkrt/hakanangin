import { PostForm } from "@/components/admin/PostForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <div>
            {/* Header */}
            <div className="admin-header">
                <div>
                    <Link
                        href="/admin/posts"
                        className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1"
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
                        Yazılara Dön
                    </Link>
                    <h1>Yazıyı Düzenle</h1>
                </div>
            </div>

            <PostForm post={post} />
        </div>
    );
}
