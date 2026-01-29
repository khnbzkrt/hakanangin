"use client";

import { createClient } from "@/lib/supabase/client";
import { Post } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { MarkdownEditor } from "./MarkdownEditor";

interface PostFormProps {
    post?: Post;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function PostForm({ post }: PostFormProps) {
    const [title, setTitle] = useState(post?.title || "");
    const [slug, setSlug] = useState(post?.slug || "");
    const [excerpt, setExcerpt] = useState(post?.excerpt || "");
    const [content, setContent] = useState(post?.content || "");
    const [coverImage, setCoverImage] = useState(post?.cover_image || "");
    const [published, setPublished] = useState(post?.published || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();
    const isEditing = !!post;

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!isEditing) {
            setSlug(generateSlug(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("Oturum açmanız gerekiyor");
            }

            const postData = {
                title,
                slug,
                excerpt,
                content,
                cover_image: coverImage || null,
                published,
                author_id: user.id,
            };

            if (isEditing) {
                const { error } = await supabase
                    .from("posts")
                    .update(postData)
                    .eq("id", post.id);

                if (error) throw error;
            } else {
                const { error } = await supabase.from("posts").insert([postData]);

                if (error) throw error;
            }

            router.push("/admin/posts");
            router.refresh();
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Taraf - Ana İçerik (2 kolon) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Yazı Bilgileri */}
                    <div className="admin-card p-6">
                        <h2 className="text-lg font-['Playfair_Display'] font-semibold text-[var(--text-primary)] mb-5">
                            Yazı Bilgileri
                        </h2>

                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="admin-label">
                                    Başlık *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="admin-input font-['Playfair_Display'] text-lg"
                                    placeholder="Yazı başlığı"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label htmlFor="slug" className="admin-label">
                                    URL (Slug) *
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[var(--text-muted)]">/blog/</span>
                                    <input
                                        type="text"
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="admin-input flex-1"
                                        placeholder="yazi-basligi"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label htmlFor="excerpt" className="admin-label">
                                    Özet *
                                </label>
                                <textarea
                                    id="excerpt"
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={2}
                                    className="admin-input admin-textarea font-['Lora']"
                                    placeholder="Yazının kısa özeti"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* İçerik */}
                    <div className="admin-card p-6">
                        <h2 className="text-lg font-['Playfair_Display'] font-semibold text-[var(--text-primary)] mb-5">
                            İçerik *
                        </h2>
                        <MarkdownEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Yazı içeriğinizi buraya yazın... Markdown kullanabilirsiniz."
                        />
                    </div>
                </div>

                {/* Sağ Taraf - Yan Panel (1 kolon) */}
                <div className="space-y-6">
                    {/* Yayın Ayarları */}
                    <div className="admin-card p-6">
                        <h2 className="text-lg font-['Playfair_Display'] font-semibold text-[var(--text-primary)] mb-5">
                            Yayın Ayarları
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[var(--text-primary)]">Durum</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPublished(!published)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${published ? "bg-[var(--accent)]" : "bg-gray-300"}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${published ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                    <span className={`text-sm font-medium ${published ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>
                                        {published ? "Yayında" : "Taslak"}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--text-muted)]">
                                {published
                                    ? "Yazı yayında ve herkes tarafından görülebilir"
                                    : "Yazı taslak olarak kaydedilecek"}
                            </p>
                        </div>
                    </div>

                    {/* Kapak Görseli */}
                    <div className="admin-card p-6">
                        <h2 className="text-lg font-['Playfair_Display'] font-semibold text-[var(--text-primary)] mb-5">
                            Kapak Görseli
                        </h2>
                        <ImageUpload value={coverImage} onChange={setCoverImage} folder="covers" />
                        <p className="text-xs text-[var(--text-muted)] mt-3">
                            1200x630 piksel önerilir
                        </p>
                    </div>

                    {/* Kaydet Butonu */}
                    <div className="admin-card p-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="admin-btn admin-btn-primary w-full justify-center"
                            >
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {isEditing ? "Güncelle" : "Kaydet"}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="admin-btn admin-btn-secondary w-full justify-center"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
