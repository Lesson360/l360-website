'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { authApi } from '@/lib/api/auth';
import { PhoneOrEmailInput, InputMode } from '@/components/auth/PhoneOrEmailInput';
import { COUNTRY_CODES, CountryCode } from '@/components/auth/CountryCodeSelect';

export default function SignupPage() {
  const router = useRouter();

  const [inputMode, setInputMode] = useState<InputMode>('phone');
  const [phoneValue, setPhoneValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // NG (+234)
  const [emailValue, setEmailValue] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const formattedContact =
      inputMode === 'phone'
        ? `${selectedCountry.dialCode}${phoneValue.trim()}`
        : emailValue.trim();

    if (inputMode === 'phone' && !phoneValue.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    if (inputMode === 'email' && !emailValue.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const registerPayload: any = {
        password,
        confirmPassword,
      };

      if (inputMode === 'phone') {
        registerPayload.phoneNumber = formattedContact;
      } else {
        registerPayload.email = formattedContact;
      }

      if (referralCode.trim()) {
        registerPayload.referralCode = referralCode.trim();
      }

      await authApi.register(registerPayload);

      // Redirect to OTP verification page with contact parameters
      const searchParams = new URLSearchParams({
        contact: formattedContact,
        mode: inputMode,
      });
      router.push(`/verify-otp?${searchParams.toString()}`);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Create Account
        </h1>
        <p className="text-sm text-gray-500">
          Sign up to get started with Lesson360 self-service parent portal.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone or Email Input */}
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">
            Password
          </label>
          <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20 transition-all">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full py-3 px-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">
            Confirm Password
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

        {/* Optional Referral Code */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">
            Referral Code <span className="text-gray-400 text-xs font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. REF123"
            className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm transition-all"
          />
        </div>

        {/* Primary Orange Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>

      {/* Log In Prompt Link */}
      <div className="pt-2 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-bold text-brand-orange hover:text-brand-orange-deep transition-colors underline"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
