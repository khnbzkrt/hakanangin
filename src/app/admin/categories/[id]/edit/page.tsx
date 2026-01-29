import { CategoryForm } from "@/components/admin/CategoryForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: category, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !category) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategoriyi Düzenle</h1>
            <CategoryForm category={category} />
        </div>
    );
}
