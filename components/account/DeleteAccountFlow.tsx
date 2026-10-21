'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2, Mail, Trash2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

type Step = 'request' | 'confirm' | 'done';

const errorMessage = (err: any, fallback: string) => err?.response?.data?.message || fallback;

/**
 * Two-step account deletion: request a code by email, then confirm it.
 * Rendered at /dashboard/settings/delete-account, which the mobile app links to.
 * Without `lockedEmail` the user types the email themselves.
 */
export function DeleteAccountFlow({ lockedEmail }: { lockedEmail?: string }) {
    const [step, setStep] = useState<Step>('request');
    const [email, setEmail] = useState(lockedEmail || '');
    const [otp, setOtp] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const targetEmail = (lockedEmail || email).trim();

    const handleRequest = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setInfo(null);

        if (!targetEmail) {
            setError('Please enter the email address on your account.');
            return;
        }
        if (step === 'request' && !acknowledged) {
            setError('Please confirm you understand that deletion is permanent.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await authApi.requestAccountDeletion({ email: targetEmail });
            setInfo(res?.message || `We sent a deletion code to ${targetEmail}.`);
            setStep('confirm');
        } catch (err: any) {
            setError(errorMessage(err, 'Could not send the deletion code. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!otp.trim()) {
            setError('Enter the code we sent to your email.');
            return;
        }

        setSubmitting(true);
        try {
            await authApi.confirmAccountDeletion({ email: targetEmail, otp: otp.trim() });
            // The account no longer exists, so any session on this device is dead.
            Cookies.remove('token');
            setStep('done');
        } catch (err: any) {
            setError(errorMessage(err, 'That code did not work. Check it and try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    if (step === 'done') {
        return (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm font-extrabold">Your account has been deleted.</p>
                </div>
                <p className="text-xs font-medium text-emerald-900/80">
                    Your Lesson360 account and its child profiles have been removed and you have been signed out.
                </p>
                <Link
                    href="/"
                    className="inline-flex px-5 py-2.5 rounded-full bg-[#1F1935] hover:bg-[#2B1741] text-white font-extrabold text-xs transition-all"
                >
                    Go to homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-xl">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex gap-3 text-red-900">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs font-medium space-y-1.5">
                    <p className="font-extrabold">This permanently deletes your account.</p>
                    <p>
                        Your parent account, every child profile, learning progress and subscription access will be
                        removed. This cannot be undone.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs font-bold">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {step === 'request' ? (
                <form onSubmit={handleRequest} className="space-y-5">
                    <div className="space-y-1.5">
                        <label htmlFor="delete-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Account Email
                        </label>
                        <input
                            id="delete-email"
                            type="email"
                            value={lockedEmail || email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={!!lockedEmail}
                            placeholder="parent@example.com"
                            autoComplete="email"
                            required
                            className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none transition-all ${lockedEmail ? 'bg-gray-200/60 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-brand-orange focus:bg-white'}`}
                        />
                    </div>

                    <label className="flex items-start gap-3 text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => setAcknowledged(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-red-600"
                        />
                        <span>I understand that deleting my account is permanent and cannot be undone.</span>
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Sending code...</span>
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4" />
                                <span>Send deletion code</span>
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleConfirm} className="space-y-5">
                    {info && (
                        <p className="text-xs font-semibold text-gray-600">
                            {info} Enter it below to delete <span className="font-extrabold text-gray-900">{targetEmail}</span>.
                        </p>
                    )}

                    <div className="space-y-1.5">
                        <label htmlFor="delete-otp" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Deletion Code
                        </label>
                        <input
                            id="delete-otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter code"
                            required
                            className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-sm font-semibold tracking-[.3em] text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    <span>Permanently delete account</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRequest()}
                            disabled={submitting}
                            className="px-4 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all disabled:opacity-70"
                        >
                            Resend code
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStep('request');
                                setOtp('');
                                setError(null);
                                setInfo(null);
                            }}
                            disabled={submitting}
                            className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
