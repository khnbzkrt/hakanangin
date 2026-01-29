"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useRef, useState } from "react";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = "İçeriğinizi buraya yazın...",
}: MarkdownEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        const newText =
            value.substring(0, start) +
            before +
            selectedText +
            after +
            value.substring(end);

        onChange(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + before.length + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const handleBold = () => insertText("**", "**");
    const handleItalic = () => insertText("*", "*");
    const handleHeading = () => insertText("\n## ", "\n");
    const handleLink = () => insertText("[", "](url)");
    const handleQuote = () => insertText("\n> ", "\n");
    const handleList = () => insertText("\n- ", "\n");
    const handleCode = () => insertText("`", "`");
    const handleCodeBlock = () => insertText("\n```\n", "\n```\n");

    const uploadImage = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Lütfen bir resim dosyası seçin");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Dosya boyutu 5MB'dan küçük olmalı");
            return;
        }

        setIsUploading(true);

        try {
            const supabase = createClient();
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `content/${fileName}`;

            const { error: uploadError } = await supabase.storage
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

            insertText(`\n![${file.name}](${publicUrl})\n`);
        } catch (err: unknown) {
            console.error("Upload error:", err);
            const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
            alert(`Yükleme hatası: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
        e.target.value = "";
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                uploadImage(file);
            }
        },
        [value]
    );

    const handlePaste = useCallback(
        (e: React.ClipboardEvent) => {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith("image/")) {
                    e.preventDefault();
                    const file = items[i].getAsFile();
                    if (file) {
                        uploadImage(file);
                    }
                    break;
                }
            }
        },
        [value]
    );

    const renderPreview = (markdown: string) => {
        // Simple markdown to HTML conversion for preview
        let html = markdown
            // Escape HTML
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            // Headers
            .replace(/^### (.*$)/gim, "<h3>$1</h3>")
            .replace(/^## (.*$)/gim, "<h2>$1</h2>")
            .replace(/^# (.*$)/gim, "<h1>$1</h1>")
            // Bold
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            // Italic
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            // Images
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--accent)] underline">$1</a>')
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
            // Inline code
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
            // Blockquotes
            .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[var(--accent)] pl-4 italic my-4">$1</blockquote>')
            // Unordered lists
            .replace(/^\- (.*$)/gim, "<li>$1</li>")
            // Line breaks
            .replace(/\n\n/g, "</p><p>")
            .replace(/\n/g, "<br />");

        // Wrap in paragraph
        html = `<p>${html}</p>`;

        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, "").replace(/<p><br \/><\/p>/g, "");

        return html;
    };

    const toolbarButtons = [
        { icon: "B", title: "Kalın", onClick: handleBold, style: "font-bold" },
        { icon: "I", title: "İtalik", onClick: handleItalic, style: "italic" },
        { icon: "H", title: "Başlık", onClick: handleHeading, style: "font-bold" },
        { icon: "🔗", title: "Link", onClick: handleLink },
        { icon: "❝", title: "Alıntı", onClick: handleQuote },
        { icon: "•", title: "Liste", onClick: handleList },
        { icon: "<>", title: "Kod", onClick: handleCode, style: "font-mono text-xs" },
        { icon: "{ }", title: "Kod Bloğu", onClick: handleCodeBlock, style: "font-mono text-xs" },
    ];

    return (
        <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-2 md:px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] gap-2">
                <div className="flex items-center flex-wrap gap-0.5 md:gap-1">
                    {toolbarButtons.map((btn, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={btn.onClick}
                            title={btn.title}
                            className={`px-2 py-1 md:px-2.5 md:py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 rounded transition-colors ${btn.style || ""}`}
                        >
                            {btn.icon}
                        </button>
                    ))}

                    <div className="w-px h-5 bg-[var(--border-color)] mx-0.5 md:mx-1" />

                    {/* Image Upload Button */}
                    <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        title="Resim Ekle"
                        className="px-2 py-1 md:px-2.5 md:py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
                    >
                        {isUploading ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        )}
                        <span className="text-xs hidden sm:inline">Resim</span>
                    </button>
                </div>

                {/* Preview Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 self-start md:self-auto">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${!previewMode
                            ? "bg-white text-[var(--text-primary)] shadow-sm"
                            : "text-[var(--text-secondary)]"
                            }`}
                    >
                        Düzenle
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${previewMode
                            ? "bg-white text-[var(--text-primary)] shadow-sm"
                            : "text-[var(--text-secondary)]"
                            }`}
                    >
                        Önizleme
                    </button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Editor / Preview */}
            {previewMode ? (
                <div
                    className="p-4 min-h-[400px] prose prose-sm max-w-none font-['Lora']"
                    dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
                />
            ) : (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    onDragOver={(e) => e.preventDefault()}
                    placeholder={placeholder}
                    className="w-full min-h-[400px] p-4 font-['Source_Sans_3'] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-y focus:outline-none"
                    style={{ lineHeight: 1.8 }}
                />
            )}

            {/* Help Text */}
            <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <p className="text-xs text-[var(--text-muted)]">
                    Markdown desteklenir. Resim eklemek için yapıştırın veya sürükleyin.
                </p>
            </div>
        </div>
    );
}
