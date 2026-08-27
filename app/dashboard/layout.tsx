import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full overflow-hidden flex bg-slate-50 font-sans">
            {/* Dark Viewport-Locked Sidebar */}
            <DashboardSidebar />

            {/* Main Dashboard Content Area (Scrolls independently) */}
            <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
                <DashboardHeader />

                <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
