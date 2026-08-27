'use client';

import React from 'react';
import { CountryCodeSelect, COUNTRY_CODES, CountryCode } from './CountryCodeSelect';

export type InputMode = 'phone' | 'email';

interface PhoneOrEmailInputProps {
    mode: InputMode;
    onModeChange: (mode: InputMode) => void;
    phoneValue: string;
    onPhoneChange: (val: string) => void;
    selectedCountry: CountryCode;
    onCountryChange: (country: CountryCode) => void;
    emailValue: string;
    onEmailChange: (val: string) => void;
    disabled?: boolean;
    error?: string;
}

export function PhoneOrEmailInput({
    mode,
    onModeChange,
    phoneValue,
    onPhoneChange,
    selectedCountry,
    onCountryChange,
    emailValue,
    onEmailChange,
    disabled = false,
    error,
}: PhoneOrEmailInputProps) {
    return (
        <div className="space-y-1.5 w-full">
            <label className="block text-sm font-medium text-gray-800">
                {mode === 'phone' ? 'Phone Number' : 'Email Address'}
            </label>

            {mode === 'phone' ? (
                <div className={`flex items-center rounded-xl border bg-white shadow-sm transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20'
                    }`}>
                    <CountryCodeSelect
                        selected={selectedCountry}
                        onChange={onCountryChange}
                        disabled={disabled}
                    />
                    <input
                        type="tel"
                        disabled={disabled}
                        value={phoneValue}
                        onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ''))}
                        placeholder="801 234 5678"
                        className="w-full py-3 px-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm rounded-r-xl"
                    />
                </div>
            ) : (
                <div className={`flex items-center rounded-xl border bg-white shadow-sm transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20'
                    }`}>
                    <input
                        type="email"
                        disabled={disabled}
                        value={emailValue}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full py-3 px-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm rounded-xl"
                    />
                </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            <div className="flex justify-start pt-0.5">
                <button
                    type="button"
                    onClick={() => onModeChange(mode === 'phone' ? 'email' : 'phone')}
                    className="text-xs text-brand-orange hover:text-brand-orange-deep font-semibold transition-colors focus:outline-none hover:underline"
                >
                    {mode === 'phone' ? 'Use email instead' : 'Use phone number instead'}
                </button>
            </div>
        </div>
    );
}
