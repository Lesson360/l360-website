'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, GraduationCap } from 'lucide-react';
import { enrichmentCoursesApi } from '@/lib/api/enrichment-courses';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your enrichment course payment...');

    useEffect(() => {
        if (!reference) {
            const stored = localStorage.getItem('pending_enrichment_checkout');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed.reference) {
                        verifyRef(parsed.reference);
                        return;
                    }
                } catch (e) {
                    // Ignore parse error
                }
            }
            setStatus('failed');
            setMessage('No payment reference found. Please try purchasing again.');
            return;
        }

        verifyRef(reference);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reference]);

    const verifyRef = async (ref: string) => {
        try {
            const res = await enrichmentCoursesApi.verifyPayment(ref);
            if (res?.item?.status === 'paid' || res?.data?.item?.status === 'paid') {
                setStatus('success');
                setMessage('Payment verified successfully! Your child now has access to the enrichment course.');
                localStorage.removeItem('pending_enrichment_checkout');
            } else {
                setStatus('failed');
                setMessage(res?.message || 'Payment verification failed or status is still pending.');
            }
        } catch (err: any) {
            console.error('Enrichment payment verification error:', err);
            setStatus('failed');
            setMessage(err.response?.data?.message || 'Failed to verify payment with server. Please try checking again.');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 max-w-md w-full text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF4801] flex items-center justify-center mx-auto">
                    <GraduationCap className="w-8 h-8" />
                </div>

                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 className="w-10 h-10 text-[#FF4801] animate-spin mx-auto" />
                        <h2 className="text-xl font-extrabold text-gray-900">Verifying Payment...</h2>
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                        <h2 className="text-2xl font-extrabold text-gray-900">Payment Successful!</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                        <button
                            onClick={() => router.push('/dashboard/enrichment-courses')}
                            className="w-full py-3.5 px-6 rounded-xl bg-[#FF4801] hover:bg-[#e03d00] text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>Go to Enrichment Courses</span>
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="space-y-4">
                        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                        <h2 className="text-2xl font-extrabold text-gray-900">Verification Failed</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => router.push('/dashboard/enrichment-courses')}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Courses
                            </button>
                            {reference && (
                                <button
                                    onClick={() => {
                                        setStatus('verifying');
                                        verifyRef(reference);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl bg-[#FF4801] hover:bg-[#e03d00] text-white font-bold transition-colors text-sm"
                                >
                                    Retry Check
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EnrichmentCourseCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[70vh] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 max-w-md w-full text-center space-y-4">
                        <Loader2 className="w-10 h-10 text-[#FF4801] animate-spin mx-auto" />
                        <h2 className="text-xl font-extrabold text-gray-900">Loading...</h2>
                    </div>
                </div>
            }
        >
            <CallbackContent />
        </Suspense>
    );
}