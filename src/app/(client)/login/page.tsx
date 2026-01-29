"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setError("Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/admin");
                router.refresh();
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link
                        href="/"
                        className="text-3xl font-['Playfair_Display'] font-semibold text-[var(--text-primary)]"
                    >
                        Cesiha
                    </Link>
                    <h1 className="mt-6 text-2xl font-['Playfair_Display'] font-semibold text-[var(--text-primary)]">
                        {isSignUp ? "Hesap Oluştur" : "Hoş Geldiniz"}
                    </h1>
                    <p className="mt-2 text-[var(--text-secondary)]">
                        {isSignUp
                            ? "Yazı eklemek için hesap oluşturun"
                            : "Admin paneline erişmek için giriş yapın"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                        >
                            E-posta
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="ornek@email.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                        >
                            Şifre
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className={`text-sm p-3 rounded ${error.includes("başarılı")
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[var(--text-primary)] text-white font-medium rounded transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {isSignUp ? "Kaydediliyor..." : "Giriş yapılıyor..."}
                            </span>
                        ) : isSignUp ? (
                            "Hesap Oluştur"
                        ) : (
                            "Giriş Yap"
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                        }}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        {isSignUp ? (
                            <>
                                Zaten hesabınız var mı?{" "}
                                <span className="font-medium text-[var(--text-primary)]">
                                    Giriş yapın
                                </span>
                            </>
                        ) : (
                            <>
                                Hesabınız yok mu?{" "}
                                <span className="font-medium text-[var(--text-primary)]">
                                    Kayıt olun
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        ← Ana sayfaya dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
