'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loader2, ArrowLeft } from 'lucide-react';

import { authApi } from '@/lib/api/auth';

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const contact = searchParams.get('contact') || '';
    const mode = searchParams.get('mode') || 'phone';

    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [resendTimer, setResendTimer] = useState(30);
    const [isResending, setIsResending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Countdown timer for Resend OTP
    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pasted = value.slice(0, 4).split('');
            const newOtp = [...otpValues];
            pasted.forEach((char, i) => {
                if (i < 4) newOtp[i] = char;
            });
            setOtpValues(newOtp);
            const nextFocus = Math.min(pasted.length, 3);
            inputRefs[nextFocus].current?.focus();
            return;
        }

        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (pastedData) {
            const newOtp = ['', '', '', ''];
            pastedData.split('').forEach((char, i) => {
                newOtp[i] = char;
            });
            setOtpValues(newOtp);
            const nextFocus = Math.min(pastedData.length - 1, 3);
            inputRefs[nextFocus].current?.focus();
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0 || isResending) return;

        setIsResending(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const verifyPayload: any = {
                purpose: 'phone_verification',
                channel: mode === 'email' ? 'email' : 'sms',
            };

            if (mode === 'email') {
                verifyPayload.email = contact;
            } else {
                verifyPayload.phoneNumber = contact;
            }
            await authApi.resendOTP(verifyPayload);
            setSuccessMessage('A new verification code has been sent!');
            setResendTimer(30);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to resend OTP code.';
            setErrorMessage(msg);
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const otpCode = otpValues.join('');
        if (otpCode.length < 4) {
            setErrorMessage('Please enter the complete 4-digit code.');
            return;
        }

        setIsLoading(true);

        try {
            const verifyPayload: any = {
                otp: otpCode,
            };

            if (mode === 'email') {
                verifyPayload.email = contact;
            } else {
                verifyPayload.phoneNumber = contact;
            }

            const res = await authApi.verifyOTP(verifyPayload);

            // Store auth token
            const token = res.data?.token;
            if (token) {
                Cookies.set('token', token, { expires: 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
            }

            // Rehydrate user profile to check backend screen state
            const profileRes = await authApi.getProfile().catch(() => null);
            const progressScreen =
                res.data?.user?.childInfo?.[0]?.nextScreen ||
                (profileRes as any)?.data?.progress?.screen ||
                'academic_level_home';

            // Branch to expected screen
            switch (progressScreen) {
                case 'academic_level_home':
                    router.push('/onboarding/child-setup');
                    break;
                case 'subscription_plans':
                    router.push('/onboarding/plans');
                    break;
                case 'payment':
                    router.push('/onboarding/checkout');
                    break;
                case 'kindly_take_quiz':
                    router.push('/onboarding/diagnostic');
                    break;
                case 'home':
                default:
                    router.push('/home');
                    break;
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Invalid OTP verification code. Please try again.';
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="space-y-1">
                <Link
                    href="/signup"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-brand-orange transition-colors mb-2"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign Up
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Verify OTP
                </h1>
                <p className="text-sm text-gray-500">
                    Enter the 4-digit code sent to{' '}
                    <span className="font-semibold text-gray-800">{contact || 'your contact'}</span>.
                </p>
            </div>

            {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 4-Digit Input Grid */}
                <div className="flex items-center justify-center gap-3">
                    {otpValues.map((val, idx) => (
                        <input
                            key={idx}
                            ref={inputRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            disabled={isLoading}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            onPaste={handlePaste}
                            className="w-14 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all shadow-sm"
                        />
                    ))}
                </div>

                {/* Resend OTP Section */}
                <div className="text-center text-sm text-gray-500">
                    Didn&apos;t receive the code?{' '}
                    {resendTimer > 0 ? (
                        <span className="font-medium text-gray-400">
                            Resend in {resendTimer}s
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="font-bold text-brand-orange hover:text-brand-orange-deep transition-colors underline focus:outline-none disabled:opacity-50"
                        >
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </button>
                    )}
                </div>

                {/* Primary Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <span>Verify & Continue</span>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="w-full py-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}
