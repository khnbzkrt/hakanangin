import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/database";
import Image from "next/image";
import Link from "next/link";


const POSTS_PER_PAGE = 5;
const PAGINATION_WINDOW = 5;



export default async function AdminPostsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const search = params.search || "";
    const offset = (currentPage - 1) * POSTS_PER_PAGE;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "";

    // Toplam yazı sayısını al
    let postQuery = supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId);
    if (search) {
        postQuery = postQuery.ilike("title", `%${search}%`);
    }
    const { count: totalPosts } = await postQuery;

    const totalPages = Math.ceil((totalPosts || 0) / POSTS_PER_PAGE);

    // Sayfalanmış yazıları al
    let postsQuery = supabase
        .from("posts")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1);
    if (search) {
        postsQuery = postsQuery.ilike("title", `%${search}%`);
    }
    const { data: posts } = (await postsQuery) as { data: Post[] | null };

    // Pagination window hesaplama
    let startPage = Math.max(1, currentPage - Math.floor(PAGINATION_WINDOW / 2));
    let endPage = startPage + PAGINATION_WINDOW - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - PAGINATION_WINDOW + 1);
    }

    return (
        <div>
            {/* Header */}
            <div className="admin-header flex-col sm:flex-row flex items-center justify-between gap-4">
                <h1>Yazılar</h1>
                <form className="flex items-center gap-2 w-full sm:w-auto" method="get">
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Başlıkta ara..."
                        className="admin-input w-full sm:w-64"
                    />
                    <button type="submit" className="admin-btn admin-btn-secondary">Ara</button>
                </form>
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

            {/* Posts Table */}
            <div className="admin-card overflow-hidden">
                {posts && posts.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="w-16">Görsel</th>
                                <th>Başlık</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th className="text-right!">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            {post.cover_image ? (
                                                <Image
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg
                                                        className="w-6 h-6"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <p className="font-medium text-gray-900">{post.title}</p>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className={`admin-badge ${post.published ? "success" : "warning"}`}
                                        >
                                            {post.published ? "Yayında" : "Taslak"}
                                        </span>
                                    </td>
                                    <td className="text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Düzenle"
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
                                            {post.published && (
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                    title="Görüntüle"
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
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </Link>
                                            )}
                                            <DeletePostButton postId={post.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <p className="text-sm text-gray-600">
                        Toplam <span className="font-medium">{totalPosts}</span> yazıdan{" "}
                        <span className="font-medium">{offset + 1}-{Math.min(offset + POSTS_PER_PAGE, totalPosts || 0)}</span> arası
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={currentPage > 1 ? `/admin/posts?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}` : "#"}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage > 1
                                ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                : "text-gray-400 bg-gray-100 cursor-not-allowed pointer-events-none"
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>

                        {startPage > 1 && (
                            <span className="px-2">...</span>
                        )}
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/posts?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                                className={`min-w-[40px] h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${page === currentPage
                                    ? "!text-white bg-gray-900"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </Link>
                        ))}
                        {endPage < totalPages && (
                            <span className="px-2">...</span>
                        )}

                        <Link
                            href={currentPage < totalPages ? `/admin/posts?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}` : "#"}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage < totalPages
                                ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                : "text-gray-400 bg-gray-100 cursor-not-allowed pointer-events-none"
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
