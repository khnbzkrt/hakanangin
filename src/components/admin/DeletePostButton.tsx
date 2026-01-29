"use client";

import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeletePostButtonProps {
    postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleDelete = async () => {
        setLoading(true);

        try {
            const { error } = await supabase.from("posts").delete().eq("id", postId);

            if (error) throw error;

            router.refresh();
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sil"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                >
                    İptal
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Sil"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    );
}
