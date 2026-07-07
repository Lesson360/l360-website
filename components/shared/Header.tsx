'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

export function Header() {
    const { user, logout } = useAuth();
    

    return (
        <header className="w-full bg-brand-peach px-6 py-4 md:px-12 lg:px-16 flex justify-between items-center border-b border-brand-orange/20">
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
            <div className="flex items-center space-x-6">
                {user ? (
                    <>
                        <span className="text-gray-800 font-semibold hidden sm:inline">
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
        </header>
    );
}