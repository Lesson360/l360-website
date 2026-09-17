'use client';

import React from 'react';
import { Search, Menu } from 'lucide-react';
import { ChildSwitcher } from './ChildSwitcher';

interface DashboardHeaderProps {
    onOpenMobileSidebar?: () => void;
}

export function DashboardHeader({ onOpenMobileSidebar }: DashboardHeaderProps) {
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

            {/* Right Action Icons & Child Profile Switcher */}
            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                <ChildSwitcher />
            </div>

        </header>
    );
}
