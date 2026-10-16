'use client';

import { Globe } from 'lucide-react';
import { useCurrency } from '@/lib/currency/CurrencyProvider';
import { PICKER_CURRENCIES } from '@/lib/currency/countries';

const NAMES: Record<string, string> = {
    NGN: 'Naira', USD: 'US dollar', GBP: 'British pound', EUR: 'Euro', CAD: 'Canadian dollar', AUD: 'Australian dollar',
    GHS: 'Ghanaian cedi', KES: 'Kenyan shilling', ZAR: 'South African rand', AED: 'UAE dirham', INR: 'Indian rupee',
};

/**
 * "Prices in: [GBP ▾]" switcher. Shows nothing until live rates are available,
 * since without them every price stays in naira anyway.
 */
export function CurrencySelect({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
    const { currency, detectedCurrency, hasRates, setCurrency } = useCurrency();
    if (!hasRates) return null;

    const options = PICKER_CURRENCIES.includes(detectedCurrency) ? PICKER_CURRENCIES : [detectedCurrency, ...PICKER_CURRENCIES];
    const dark = tone === 'dark';

    return (
        <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold ${dark ? 'text-white/80' : 'text-gray-500'} ${className}`}>
            <label className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Prices in</span>
                <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-bold outline-none focus:ring-2 ${dark ? 'border-white/25 bg-white/10 text-white focus:ring-white/40' : 'border-gray-200 bg-white text-gray-800 focus:ring-orange-200'}`}
                >
                    {options.map(c => (
                        <option key={c} value={c} className="text-gray-900">{c} · {NAMES[c] || c}</option>
                    ))}
                </select>
            </label>
            {/* Attribution required by the free rates feed's terms. */}
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className={`underline-offset-2 hover:underline ${dark ? 'text-white/60' : 'text-gray-400'}`}>
                Rates by ExchangeRate-API
            </a>
        </div>
    );
}
