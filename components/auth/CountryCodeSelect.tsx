'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CountryCode {
    code: string;
    dialCode: string;
    name: string;
    flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
    { code: 'NG', dialCode: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'GH', dialCode: '+233', name: 'Ghana', flag: '🇬🇭' },
    { code: 'KE', dialCode: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: 'ZA', dialCode: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
];

interface CountryCodeSelectProps {
    selected: CountryCode;
    onChange: (country: CountryCode) => void;
    disabled?: boolean;
}

export function CountryCodeSelect({
    selected,
    onChange,
    disabled = false,
}: CountryCodeSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-3 text-gray-700 bg-transparent hover:bg-gray-50 transition-colors rounded-l-lg border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-sm font-medium"
            >
                <span className="text-xl leading-none">{selected.flag}</span>
                <span className="text-gray-500 font-normal text-sm">{selected.dialCode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-lg bg-white shadow-lg border border-gray-200 z-50 py-1 max-h-60 overflow-y-auto">
                    {COUNTRY_CODES.map((country) => (
                        <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                                onChange(country);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-orange-50 transition-colors ${country.code === selected.code ? 'bg-orange-50/70 font-semibold text-brand-orange' : 'text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{country.flag}</span>
                                <span>{country.name}</span>
                            </div>
                            <span className="text-gray-400 text-xs">{country.dialCode}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
