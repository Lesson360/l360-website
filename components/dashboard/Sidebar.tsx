'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    User,
    Video,
    FileText,
    GraduationCap,
    Library,
    CreditCard,
    Settings,
    LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const NAV_ITEMS = [
    {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: User,
    },
    {
        name: 'Video Library',
        href: '/dashboard/video-library',
        icon: Video,
    },
    {
        name: 'Practice Exam',
        href: '/dashboard/practice-exam',
        icon: FileText,
    },
    {
        name: 'Enrichment Courses',
        href: '/dashboard/enrichment-courses',
        icon: GraduationCap,
    },
    {
        name: 'My Library',
        href: '/dashboard/my-library',
        icon: Library,
    },
    {
        name: 'Subscriptions',
        href: '/dashboard/subscriptions',
        icon: CreditCard,
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="w-64 bg-[#3b0d49] h-full flex flex-col justify-between p-6 text-white shrink-0 shadow-2xl overflow-y-auto">
            <div className="space-y-8">
                {/* Brand Logo */}
                <div className="px-3 pt-2">
                    <Link href="/dashboard/video-library">
                        <Image
                            src="https://cdn.magicpatterns.com/uploads/gCuHuVJSJspn2uVtMavkc6/l360-logo.png"
                            alt="Lesson360 Logo"
                            width={140}
                            height={32}
                            className="h-8 w-auto brightness-0 invert"
                            priority
                        />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href === '/dashboard/video-library' && pathname === '/dashboard');

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${isActive
                                    ? 'bg-white text-brand-orange shadow-md'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-orange' : 'text-white/80'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Log Out */}
            <div className="pt-6 border-t border-white/10">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm text-red-200 hover:text-red-100 hover:bg-red-500/20 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}
