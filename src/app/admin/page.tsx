import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/database";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "";

    // İstatistikler
    const { count: totalPosts } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId);

    const { count: publishedPosts } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId)
        .eq("published", true);

    const { count: draftPosts } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId)
        .eq("published", false);

    // Son yazılar
    const { data: recentPosts } = (await supabase
        .from("posts")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)) as { data: Post[] | null };

    return (
        <div>
            {/* Header */}
            <div className="admin-header">
                <h1>Dashboard</h1>
                <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Yeni Yazı
                </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="admin-stat-card">
                    <div className="flex items-center gap-4">
                        <div className="admin-stat-icon blue">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Toplam Yazı</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalPosts || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="flex items-center gap-4">
                        <div className="admin-stat-icon green">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Yayında</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {publishedPosts || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="flex items-center gap-4">
                        <div className="admin-stat-icon yellow">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Taslak</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {draftPosts || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="admin-card">
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Son Yazılar</h2>
                </div>

                {recentPosts && recentPosts.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="p-5 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate">
                                        {post.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(post.created_at).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    <span
                                        className={`admin-badge ${post.published ? "success" : "warning"}`}
                                    >
                                        {post.published ? "Yayında" : "Taslak"}
                                    </span>
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <svg
                            className="w-12 h-12 text-gray-300 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-gray-500 mb-4">Henüz yazı eklenmemiş</p>
                        <Link
                            href="/admin/posts/new"
                            className="admin-btn admin-btn-primary"
                        >
                            İlk Yazınızı Ekleyin
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
