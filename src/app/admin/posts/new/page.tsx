import { PostForm } from "@/components/admin/PostForm";
import Link from "next/link";

export default function NewPostPage() {
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
                    <h1>Yeni Yazı</h1>
                </div>
            </div>

            <PostForm />
        </div>
    );
}
