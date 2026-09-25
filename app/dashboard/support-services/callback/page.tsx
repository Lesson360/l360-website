'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, HeartHandshake, Loader2, XCircle } from 'lucide-react';
import { supportServicesApi } from '@/lib/api/support-services';

// Paystack return page for support-service purchases made from the dashboard. Unlike the
// onboarding confirmation, the parent is already inside the app, so there's no "confirmation"
// screen: verify the payment, then send them straight back to Support Services.
function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';

    const [status, setStatus] = useState<'verifying' | 'failed'>('verifying');
    const [message, setMessage] = useState('');
    const startedFor = useRef<string | null>(null);

    const verify = async (ref: string) => {
        setStatus('verifying');
        setMessage('');
        try {
            const res: any = await supportServicesApi.verifyPayment(ref);
            const body = res?.data ?? res;
            const enrollmentId =
                body?.item?.enrollmentId ||
                body?.item?.id ||
                body?.enrollment?.id ||
                body?.enrollmentId ||
                '';

            if (!enrollmentId) {
                setStatus('failed');
                setMessage(res?.message || 'We could not confirm this payment. If you were charged, please contact support.');
                return;
            }

            router.replace(`/dashboard/support-services?payment=success&enrollment=${encodeURIComponent(enrollmentId)}`);
        } catch (err: any) {
            setStatus('failed');
            setMessage(err?.response?.data?.message || 'We could not verify this payment. Please try again or contact support.');
        }
    };

    useEffect(() => {
        if (!reference) {
            router.replace('/dashboard/support-services');
            return;
        }
        // Guard against the double-invoke in dev/StrictMode so we only verify once per reference.
        if (startedFor.current === reference) return;
        startedFor.current = reference;
        verify(reference);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reference]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 max-w-md w-full text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF4801] flex items-center justify-center mx-auto">
                    <HeartHandshake className="w-8 h-8" />
                </div>

                {status === 'verifying' ? (
                    <div className="space-y-3">
                        <Loader2 className="w-9 h-9 text-[#FF4801] animate-spin mx-auto" />
                        <h2 className="text-xl font-extrabold text-gray-900">Confirming your payment...</h2>
                        <p className="text-sm text-gray-500">You&apos;ll be taken back to Support Services in a moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                        <h2 className="text-xl font-extrabold text-gray-900">Payment not confirmed</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                        <div className="flex gap-3 pt-1">
                            <Link
                                href="/dashboard/support-services"
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Link>
                            {reference && (
                                <button
                                    type="button"
                                    onClick={() => verify(reference)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-[#FF4801] hover:bg-[#e03d00] text-white font-bold transition-colors text-sm cursor-pointer"
                                >
                                    Retry check
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardSupportCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-9 h-9 text-[#FF4801] animate-spin" />
                </div>
            }
        >
            <CallbackContent />
        </Suspense>
    );
}
