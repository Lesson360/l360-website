import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

/** Page frame for Paystack return pages reached from the dashboard. */
export function PaymentReturnShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="border-b border-gray-100 bg-white">
                <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
                    <Link href="/dashboard" aria-label="Lesson360 dashboard">
                        <Image src="/lesson360-logo.png" alt="Lesson360" width={140} height={36} className="h-8 w-auto" priority />
                    </Link>
                </div>
            </header>
            <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-md sm:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

export function StatusIcon({ tone, children }: { tone: 'pending' | 'success' | 'error'; children: ReactNode }) {
    const cls = tone === 'success' ? 'bg-emerald-100 text-emerald-600' : tone === 'error' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-[#FF4801]';
    return <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${cls}`}>{children}</div>;
}
