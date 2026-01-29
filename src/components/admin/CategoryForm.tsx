"use client";

import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/database";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryFormProps {
    category?: Category;
}

function generateSlug(name: string): string {
    return name
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

export function CategoryForm({ category }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || "");
    const [slug, setSlug] = useState(category?.slug || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();
    const isEditing = !!category;

    const handleNameChange = (value: string) => {
        setName(value);
        if (!isEditing) {
            setSlug(generateSlug(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing && category) {
                const { error } = await supabase
                    .from("categories")
                    .update({ name, slug })
                    .eq("id", category.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("categories")
                    .insert({ name, slug });

                if (error) throw error;
            }

            router.push("/admin/categories");
            router.refresh();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                {/* Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Kategori Adı *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Kategori adı"
                        required
                    />
                </div>

                {/* Slug */}
                <div>
                    <label
                        htmlFor="slug"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        URL (Slug) *
                    </label>
                    <input
                        type="text"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="kategori-adi"
                        required
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isEditing ? "Güncelle" : "Kaydet"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        İptal
                    </button>
                </div>
            </div>
        </form>
    );
}
