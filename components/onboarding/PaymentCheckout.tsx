'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { subscriptionsApi } from '@/lib/api/subscriptions';
import { authApi } from '@/lib/api/auth';

export default function PaymentCheckout() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';

    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        if (!reference) {
            // If no reference is provided in query params, redirect back to plan selection
            router.push('/onboarding/plans');
            return;
        }

        async function verify() {
            setStatus('verifying');
            setMessage('Verifying your payment...');

            try {
                const res = await subscriptionsApi.verifyPaymentCallback(reference);
                const rawData: any = res.data || res;
                const itemStatus = (
                    rawData?.item?.status ||
                    rawData?.payment?.status ||
                    rawData?.status ||
                    rawData?.subscription?.status ||
                    ''
                ).toLowerCase();

                const msg = (res.message || '').toLowerCase();
                const isSuccess =
                    ['success', 'paid', 'active', 'completed', 'verified'].includes(itemStatus) ||
                    msg.includes('completed') ||
                    msg.includes('success') ||
                    msg.includes('verified') ||
                    msg.includes('paid');

                if (isSuccess) {
                    setStatus('success');
                    setMessage('Payment successful! Finalizing your subscription setup...');

                    // Rehydrate user profile and route based on backend progress screen
                    setTimeout(async () => {
                        const profileRes = await authApi.getProfile().catch(() => null);
                        const nextScreen = (profileRes as any)?.data?.progress?.screen || 'kindly_take_quiz';
                        const targetUrl = nextScreen === 'home' ? '/dashboard' : '/onboarding/diagnostic';

                        if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
                            try {
                                window.opener.location.href = targetUrl;
                                window.close();
                                return;
                            } catch (e) { }
                        }
                        router.push(targetUrl);
                    }, 1500);
                } else {
                    setStatus('failed');
                    setMessage(res.message || 'Payment verification failed. Please try again.');
                }
            } catch (err: any) {
                const msg =
                    err.response?.data?.message ||
                    'Could not verify payment reference. Please try again or contact support.';
                setStatus('failed');
                setMessage(msg);
            }
        }

        verify();
    }, [reference, router]);

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-md text-center space-y-6">

            {status === 'verifying' && (
                <div className="space-y-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-brand-peach/50 text-brand-orange flex items-center justify-center mx-auto">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Verifying Payment</h2>
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-4 py-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Confirmed!</h2>
                    <p className="text-sm text-gray-600">{message}</p>
                    <div className="pt-2 flex items-center justify-center gap-2 text-xs text-brand-orange font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting to Diagnostic Quiz...</span>
                    </div>
                </div>
            )}

            {status === 'failed' && (
                <div className="space-y-6 py-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                        <XCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">Payment Unsuccessful</h2>
                        <p className="text-xs sm:text-sm text-gray-500">{message}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/onboarding/plans')}
                        className="w-full py-3.5 px-6 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Return to Subscription Plans</span>
                    </button>
                </div>
            )}

        </div>
    );
}
