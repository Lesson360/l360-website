'use client';

import React, { useState } from 'react';
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
    X,
    Loader2,
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

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function DashboardSidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } catch {
            setIsLoggingOut(false);
        } finally {
            setShowLogoutModal(false);
            if (onClose) onClose();
        }
    };

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
                />
            )}

            {/* Sidebar Container: Fixed on Mobile Drawer, Static on Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#3b0d49] h-full flex flex-col justify-between p-6 text-white shrink-0 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="space-y-8">
                    {/* Brand Logo & Mobile Close Button */}
                    <div className="px-3 pt-2 flex items-center justify-between">
                        <Link href="/dashboard/video-library" onClick={handleNavClick}>
                            <Image
                                src="https://cdn.magicpatterns.com/uploads/gCuHuVJSJspn2uVtMavkc6/l360-logo.png"
                                alt="Lesson360 Logo"
                                width={140}
                                height={32}
                                className="h-8 w-auto brightness-0 invert"
                                priority
                            />
                        </Link>

                        {/* Mobile Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close sidebar"
                            className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
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
                                    onClick={handleNavClick}
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

                {/* Bottom Log Out Button */}
                <div className="pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm text-red-200 hover:text-red-100 hover:bg-red-500/20 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Log Out Confirmation Modal Overlay */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 text-gray-900 shadow-2xl space-y-6 text-center border border-gray-100 transform scale-100 transition-all">
                        {/* Warning Icon Badge */}
                        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                            <LogOut className="w-7 h-7" />
                        </div>

                        {/* Modal Heading & Subtext */}
                        <div className="space-y-2">
                            <h3 className="text-xl font-extrabold text-gray-900">
                                Confirm Log Out
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Are you sure you want to log out of your Lesson360 account?
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all focus:outline-none disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={handleConfirmLogout}
                                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Logging out...</span>
                                    </>
                                ) : (
                                    <span>Log Out</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
