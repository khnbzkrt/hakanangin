"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
}

export function ImageUpload({
    value,
    onChange,
    folder = "covers",
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Lütfen bir resim dosyası seçin");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Dosya boyutu 5MB'dan küçük olmalı");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const supabase = createClient();
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from("images")
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error("Supabase upload error:", uploadError);
                throw new Error(uploadError.message);
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("images").getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (err: unknown) {
            console.error("Upload error:", err);
            const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
            setError(`Yükleme hatası: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            uploadFile(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="space-y-3">
            {value ? (
                <div className="relative rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                    <div className="relative aspect-video">
                        <Image
                            src={value}
                            alt="Yüklenen resim"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                        >
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
                        ? "border-[var(--accent)] bg-[var(--accent)]/5"
                        : "border-[var(--border-color)] hover:border-[var(--accent)]/50"
                        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />

                    <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                            {isUploading ? (
                                <svg
                                    className="w-6 h-6 text-[var(--accent)] animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6 text-[var(--text-secondary)]"
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
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                {isUploading ? "Yükleniyor..." : "Resim yüklemek için sürükleyin"}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                veya tıklayarak dosya seçin
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-2">
                                PNG, JPG, GIF • Maksimum 5MB
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
