'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

import { authApi } from '@/lib/api/auth';
import { PhoneOrEmailInput, InputMode } from '@/components/auth/PhoneOrEmailInput';
import { COUNTRY_CODES, CountryCode } from '@/components/auth/CountryCodeSelect';

type ResetStep = 'request' | 'verify' | 'reset' | 'success';

export default function ForgotPasswordPage() {
    const router = useRouter();

    // Flow Step State
    const [step, setStep] = useState<ResetStep>('request');

    // Input mode and contact info
    const [inputMode, setInputMode] = useState<InputMode>('phone');
    const [phoneValue, setPhoneValue] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // NG (+234)
    const [emailValue, setEmailValue] = useState('');

    // OTP Code state (4-digit)
    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];
    const [resendTimer, setResendTimer] = useState(30);
    const [isResending, setIsResending] = useState(false);

    // Password reset state
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Global loading & status messages
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Active contact string formatted
    const formattedContact =
        inputMode === 'phone'
            ? `${selectedCountry.dialCode}${phoneValue.trim()}`
            : emailValue.trim();

    // Resend countdown timer for Step 2
    useEffect(() => {
        if (step !== 'verify' || resendTimer <= 0) return;
        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [step, resendTimer]);

    // ------------------------------------------------------------------
    // STEP 1: REQUEST OTP
    // ------------------------------------------------------------------
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (inputMode === 'phone' && !phoneValue.trim()) {
            setErrorMessage('Please enter your phone number.');
            return;
        }

        if (inputMode === 'email' && !emailValue.trim()) {
            setErrorMessage('Please enter your email address.');
            return;
        }

        setIsLoading(true);

        try {
            const payload: any = {};
            if (inputMode === 'phone') {
                payload.phoneNumber = formattedContact;
                payload.channel = 'sms';
            } else {
                payload.email = formattedContact;
                payload.channel = 'email';
            }

            await authApi.forgotPassword(payload);
            setSuccessMessage(`A verification code has been sent to ${formattedContact}`);
            setResendTimer(30);
            setStep('verify');
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                'Failed to request password reset code. Please verify your contact information.';
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------------------------------------------------------
    // STEP 2: VERIFY OTP
    // ------------------------------------------------------------------
    const handleOTPChange = (index: number, value: string) => {
        if (value.length > 1) {
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

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleOTPPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
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

    const handleResendOTP = async () => {
        if (resendTimer > 0 || isResending) return;
        setIsResending(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const payload: any = {};
            if (inputMode === 'phone') {
                payload.phoneNumber = formattedContact;
                payload.channel = 'sms';
            } else {
                payload.email = formattedContact;
                payload.channel = 'email';
            }

            await authApi.forgotPassword(payload);
            setSuccessMessage(`A new verification code has been sent to ${formattedContact}`);
            setResendTimer(30);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to resend code.';
            setErrorMessage(msg);
        } finally {
            setIsResending(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const otpCode = otpValues.join('');
        if (otpCode.length < 4) {
            setErrorMessage('Please enter the 4-digit verification code.');
            return;
        }

        setIsLoading(true);

        try {
            const payload: any = {
                otp: otpCode,
            };

            if (inputMode === 'phone') {
                payload.phoneNumber = formattedContact;
            } else {
                payload.email = formattedContact;
                payload.channel = 'email';
            }

            const res = await authApi.verifyResetOTP(payload);

            const token = res.data?.resetToken || (res as any)?.resetToken;
            if (!token) {
                throw new Error('Reset token missing from response');
            }

            setResetToken(token);
            setStep('reset');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Invalid verification code. Please try again.';
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------------------------------------------------------
    // STEP 3: RESET PASSWORD
    // ------------------------------------------------------------------
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!newPassword || newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword({
                resetToken,
                password: newPassword,
                confirmPassword,
            });

            setStep('success');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to reset password. Please try again.';
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header Title Section */}
            <div className="space-y-1">
                {step !== 'success' && (
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-orange transition-colors mb-2"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
                    </Link>
                )}

                {step === 'request' && (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Forgot Password?
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            No worries! Enter your phone number or email address to receive a verification code.
                        </p>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Verify Code
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Enter the 4-digit code sent to{' '}
                            <span className="font-semibold text-gray-800">{formattedContact}</span>.
                        </p>
                    </>
                )}

                {step === 'reset' && (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Set New Password
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Create a strong, secure new password for your account.
                        </p>
                    </>
                )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {errorMessage}
                </div>
            )}

            {/* Success Message Alert */}
            {successMessage && step !== 'success' && (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                    {successMessage}
                </div>
            )}

            {/* STEP 1 FORM: REQUEST OTP */}
            {step === 'request' && (
                <form onSubmit={handleRequestOTP} className="space-y-5">
                    <PhoneOrEmailInput
                        mode={inputMode}
                        onModeChange={setInputMode}
                        phoneValue={phoneValue}
                        onPhoneChange={setPhoneValue}
                        selectedCountry={selectedCountry}
                        onCountryChange={setSelectedCountry}
                        emailValue={emailValue}
                        onEmailChange={setEmailValue}
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Sending Code...</span>
                            </>
                        ) : (
                            <span>Send Verification Code</span>
                        )}
                    </button>
                </form>
            )}

            {/* STEP 2 FORM: VERIFY OTP */}
            {step === 'verify' && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
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
                                onChange={(e) => handleOTPChange(idx, e.target.value)}
                                onKeyDown={(e) => handleOTPKeyDown(idx, e)}
                                onPaste={handleOTPPaste}
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
                                onClick={handleResendOTP}
                                disabled={isResending}
                                className="font-bold text-brand-orange hover:text-brand-orange-deep transition-colors underline focus:outline-none disabled:opacity-50"
                            >
                                {isResending ? 'Sending...' : 'Resend Code'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying Code...</span>
                                </>
                            ) : (
                                <span>Verify & Continue</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('request')}
                            className="w-full py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Change Contact Info
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 3 FORM: RESET PASSWORD */}
            {step === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    {/* New Password */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-800">
                            New Password
                        </label>
                        <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20 transition-all">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isLoading}
                                placeholder="••••••••"
                                className="w-full py-3 px-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm rounded-xl pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-800">
                            Confirm New Password
                        </label>
                        <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20 transition-all">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                placeholder="••••••••"
                                className="w-full py-3 px-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm rounded-xl pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Resetting Password...</span>
                            </>
                        ) : (
                            <span>Reset Password</span>
                        )}
                    </button>
                </form>
            )}

            {/* STEP 4: SUCCESS VIEW */}
            {step === 'success' && (
                <div className="text-center py-4 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            Password Reset Successful!
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                            Your password has been updated successfully. You can now log in with your new credentials.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30"
                    >
                        Back to Log In
                    </button>
                </div>
            )}
        </div>
    );
}
