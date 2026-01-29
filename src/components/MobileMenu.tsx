"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface MobileMenuProps {
    isLoggedIn: boolean;
}

export default function MobileMenu({ isLoggedIn }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
                aria-label="Menüyü aç/kapat"
            >
                <span
                    className={`block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""
                        }`}
                />
                <span
                    className={`block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${isOpen ? "opacity-0" : ""
                        }`}
                />
                <span
                    className={`block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
                        }`}
                />
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-[var(--bg-secondary)] z-50 transform transition-transform duration-300 ease-out shadow-2xl md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Menüyü kapat"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Menu Content */}
                <div className="flex flex-col h-full pt-20 px-6">
                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="py-3 px-4 text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-lg text-lg font-medium transition-colors"
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/blog"
                            onClick={() => setIsOpen(false)}
                            className="py-3 px-4 text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-lg text-lg font-medium transition-colors"
                        >
                            Yazılar
                        </Link>

                        {isLoggedIn && (
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="py-3 px-4 text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-lg text-lg font-medium transition-colors"
                            >
                                Yönetim
                            </Link>
                        )}
                    </nav>

                    {/* Auth Actions */}
                    <div className="mt-auto pb-8">
                        {isLoggedIn ? (
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-lg font-medium hover:bg-[var(--bg-primary)] transition-colors"
                                >
                                    Çıkış Yap
                                </button>
                            </form>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block w-full py-3 px-4 bg-[#1a1a1a] rounded-lg text-lg font-medium text-center hover:bg-[#333] transition-colors"
                                style={{ color: "#ffffff" }}
                            >
                                Giriş Yap
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
