'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { Menu, X } from 'lucide-react'; // or use any icon library

export function Header() {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <>
            <header className="w-full bg-brand-peach px-4 py-4 md:px-8 lg:px-16 flex justify-between items-center border-b border-brand-orange/20 relative z-50">
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="https://cdn.magicpatterns.com/uploads/gCuHuVJSJspn2uVtMavkc6/l360-logo.png"
                            alt="Lesson 360 Logo"
                            width={160}
                            height={36}
                            className="h-8 sm:h-9 object-contain"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {user ? (
                        <>
                            <span className="text-gray-800 font-semibold">
                                {user.fullName || user.email}
                            </span>
                            <button
                                onClick={logout}
                                className="text-gray-800 font-semibold hover:text-brand-orange transition-colors px-4 py-2"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-800 font-semibold hover:text-brand-orange transition-colors px-2 py-2"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="border border-brand-orange text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-brand-orange/5 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Menu */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-gray-800 hover:text-brand-orange transition-colors p-2"
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <span className="text-lg font-bold text-gray-800">Menu</span>
                        <button
                            onClick={closeSidebar}
                            className="text-gray-800 hover:text-brand-orange transition-colors"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex flex-col p-6 space-y-4 flex-1">
                        {user ? (
                            <>
                                <div className="pb-4 border-b">
                                    <p className="text-gray-800 font-semibold">
                                        {user.fullName || user.email}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        closeSidebar();
                                    }}
                                    className="w-full text-left text-gray-800 font-semibold hover:text-brand-orange transition-colors py-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={closeSidebar}
                                    className="text-gray-800 font-semibold hover:text-brand-orange transition-colors py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={closeSidebar}
                                    className="border border-brand-orange text-center text-gray-800 font-semibold px-6 py-3 rounded-md hover:bg-brand-orange/5 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}