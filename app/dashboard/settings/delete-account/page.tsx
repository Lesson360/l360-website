'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { DeleteAccountFlow } from '@/components/account/DeleteAccountFlow';

export default function DeleteAccountPage() {
    const [loading, setLoading] = useState(true);
    const [accountEmail, setAccountEmail] = useState<string | null>(null);

    useEffect(() => {
        authApi
            .getProfile()
            .then((res: any) => {
                const user = res?.data?.user || res?.data;
                if (user?.email) setAccountEmail(user.email);
            })
            .catch((err) => console.error('Failed to load account for deletion:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8 pb-16 max-w-5xl mx-auto">
            <div className="space-y-3">
                <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Settings</span>
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                        Delete Account
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Permanently remove your Lesson360 account. We will email you a code to confirm.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-red-200 p-6 sm:p-10 shadow-xs">
                {loading ? (
                    <div className="py-8 flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                        <Loader2 className="w-5 h-5 text-brand-orange animate-spin" />
                        <span>Loading account...</span>
                    </div>
                ) : (
                    <DeleteAccountFlow lockedEmail={accountEmail || undefined} />
                )}
            </div>
        </div>
    );
}
