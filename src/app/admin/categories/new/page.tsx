import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Yeni Kategori</h1>
            <CategoryForm />
        </div>
    );
}
