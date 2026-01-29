import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
            {/* Header - Medium Style */}
            <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-50">
                <div className="container-wide">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="font-['Playfair_Display'] text-2xl font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                        >
                            Cesiha
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link
                                href="/"
                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                href="/blog"
                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors"
                            >
                                Yazılar
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/admin"
                                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors"
                                    >
                                        Yönetim
                                    </Link>
                                    <form action="/auth/signout" method="post">
                                        <button
                                            type="submit"
                                            className="btn-outline"
                                        >
                                            Çıkış
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <Link href="/login" className="btn-primary">
                                    Giriş Yap
                                </Link>
                            )}
                        </nav>

                        {/* Mobile Menu */}
                        <MobileMenu isLoggedIn={!!user} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-8">{children}</main>

            {/* Footer - Medium Style */}
            <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] py-8 mt-auto">
                <div className="text-center">
                    <p className="text-[var(--text-muted)] text-sm">
                        © {new Date().getFullYear()} Cesiha. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
        </div>
    );
}
