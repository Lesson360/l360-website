'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

interface DashboardHeaderProps {
    onOpenMobileSidebar?: () => void;
}

export function DashboardHeader({ onOpenMobileSidebar }: DashboardHeaderProps) {
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        // Read cached child profile if available
        if (typeof window !== 'undefined') {
            const cachedStr = localStorage.getItem('lesson360_active_child');
            if (cachedStr) {
                try {
                    const cached = JSON.parse(cachedStr);
                    if (cached.name || cached.childName) {
                        setUserName(cached.name || cached.childName);
                        return;
                    }
                } catch { }
            }
        }

        authApi.getProfile().then((res: any) => {
            const u = res?.data?.user || res?.data;
            if (u?.childProfiles?.[0]?.name) {
                setUserName(u.childProfiles[0].name);
            } else if (u?.fullName || u?.name) {
                setUserName(u.fullName || u.name);
            }
        }).catch(() => null);
    }, []);

    return (
        <header className="w-full bg-white border-b border-gray-100 py-3.5 px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-6 sticky top-0 z-30 shadow-2xs">

            {/* Left Section: Mobile Hamburger Toggle + Search Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-xl">
                {/* Mobile Sidebar Hamburger Button */}
                <button
                    type="button"
                    onClick={onOpenMobileSidebar}
                    aria-label="Open mobile menu"
                    className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors lg:hidden shrink-0"
                >
                    <Menu className="w-6 h-6 text-gray-800" />
                </button>

                {/* Search Input Bar */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="search"
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-full bg-gray-100/80 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-orange/40 focus:ring-2 focus:ring-brand-orange/20 text-xs sm:text-sm font-medium transition-all"
                    />
                </div>
            </div>

            {/* Right Action Icons & User Badge */}
            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                {/* Shopping Cart */}
                <button
                    type="button"
                    aria-label="Shopping Cart"
                    className="text-gray-700 hover:text-brand-orange transition-colors relative p-1.5"
                >
                    <ShoppingCart className="w-5 h-5" />
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-800 cursor-pointer hover:text-brand-orange transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                    </div>
                    <span className="truncate max-w-[90px] sm:max-w-xs">{userName}</span>
                </div>
            </div>

        </header>
    );
}
