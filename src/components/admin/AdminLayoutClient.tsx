"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminLayoutClientProps {
    children: React.ReactNode;
    userEmail: string;
}

export function AdminLayoutClient({ children, userEmail }: AdminLayoutClientProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(path);
    };

    return (
        <div className="admin-vintage min-h-screen bg-[var(--bg-primary)]">
            {/* Topbar */}
            <header className="admin-topbar fixed top-0 left-0 right-0 h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-[var(--text-secondary)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {sidebarOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Logo */}
                    <Link
                        href="/admin"
                        className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]"
                    >
                        Yönetim Paneli
                    </Link>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6">
                    <span className="text-sm text-[var(--text-secondary)]">{userEmail}</span>

                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                        Siteyi Gör
                    </Link>

                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Çıkış
                        </button>
                    </form>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`admin-sidebar-vintage fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-300 z-40 ${sidebarOpen ? "w-64" : "w-0 -translate-x-full"
                    }`}
            >
                <nav className="p-4 space-y-1">
                    <NavLink
                        href="/admin"
                        icon="dashboard"
                        active={isActive("/admin") && pathname === "/admin"}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        href="/admin/posts"
                        icon="posts"
                        active={isActive("/admin/posts")}
                    >
                        Yazılar
                    </NavLink>
                    <NavLink
                        href="/admin/categories"
                        icon="categories"
                        active={isActive("/admin/categories")}
                    >
                        Kategoriler
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main
                className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
                    }`}
            >
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}

function NavLink({
    href,
    icon,
    active,
    children,
}: {
    href: string;
    icon: "dashboard" | "posts" | "categories";
    active: boolean;
    children: React.ReactNode;
}) {
    const icons = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
            </svg>
        ),
        posts: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
        categories: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
            </svg>
        ),
    };

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${active
                ? "bg-[#242424] shadow-sm"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
                }`}
            style={active ? { color: '#ffffff' } : undefined}
        >
            {icons[icon]}
            {children}
        </Link>
    );
}
