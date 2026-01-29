import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types/database";
import Link from "next/link";

export default async function AdminCategoriesPage() {
    const supabase = await createClient();

    const { data: categories } = (await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true })) as { data: Category[] | null };

    return (
        <div>
            {/* Header */}
            <div className="admin-header">
                <h1>Kategoriler</h1>
                <Link
                    href="/admin/categories/new"
                    className="admin-btn admin-btn-primary"
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Yeni Kategori
                </Link>
            </div>

            {/* Categories Table */}
            <div className="admin-card overflow-hidden">
                {categories && categories.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Ad</th>
                                <th>Slug</th>
                                <th>Tarih</th>
                                <th className="text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="font-medium">{category.name}</td>
                                    <td className="text-sm text-gray-500">{category.slug}</td>
                                    <td className="text-sm text-gray-500">
                                        {new Date(category.created_at).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
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
                                            <DeleteCategoryButton categoryId={category.id} />
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
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                        <p className="text-gray-500 mb-4">Henüz kategori eklenmemiş</p>
                        <Link
                            href="/admin/categories/new"
                            className="admin-btn admin-btn-primary"
                        >
                            İlk Kategorinizi Ekleyin
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
