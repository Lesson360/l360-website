'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

export function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-[#fdeadd] px-6 py-4 flex justify-between items-center border-b border-orange-200">
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
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <span className="text-gray-800 font-semibold hidden sm:inline">
                            {user.fullName || user.email}
                        </span>
                        <button
                            onClick={logout}
                            className="text-gray-800 font-semibold hover:text-orange-600 transition-colors px-4 py-2"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="text-gray-800 font-semibold hover:text-orange-600 transition-colors px-4 py-2"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="border border-orange-400 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}