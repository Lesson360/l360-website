'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { authApi } from '@/lib/api/auth';
import { PhoneOrEmailInput, InputMode } from '@/components/auth/PhoneOrEmailInput';
import { COUNTRY_CODES, CountryCode } from '@/components/auth/CountryCodeSelect';

export default function LoginPage() {
  const router = useRouter();

  const [inputMode, setInputMode] = useState<InputMode>('phone');
  const [phoneValue, setPhoneValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // NG (+234)
  const [emailValue, setEmailValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Submit login payload
      const loginPayload: any = {
        password,
      };

      if (inputMode === 'phone') {
        loginPayload.phoneNumber = formattedContact;
      } else {
        loginPayload.email = formattedContact;
      }

      const res = await authApi.login(loginPayload);

      // Save session token
      const token = res.data?.token;
      if (token) {
        Cookies.set('token', token, { expires: 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
      }

      // 2. Fetch session user context to inspect progress.screen
      const profileRes = await authApi.getProfile().catch(() => null);
      const progressScreen =
        res.data?.progress?.screen ||
        (profileRes as any)?.data?.progress?.screen ||
        (profileRes as any)?.data?.user?.childInfo?.[0]?.nextScreen;

      // 3. Route according to backend progress screen
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
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to log in. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500">
          Log in to access your parent account & learner journey.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* Password Input */}
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

          <div className="flex justify-end pt-1">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-gray-800 hover:text-brand-orange underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Primary Orange Log In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>

      {/* Sign Up Link Prompt */}
      <div className="pt-2 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-bold text-brand-orange hover:text-brand-orange-deep transition-colors underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
