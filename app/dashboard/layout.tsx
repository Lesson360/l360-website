'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="h-screen w-full overflow-hidden flex bg-slate-50 font-sans relative">
            {/* Dark Sidebar (Fixed on Desktop, Slide-over Drawer on Mobile) */}
            <DashboardSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Dashboard Content Area */}
            <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
                <DashboardHeader
                    onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
