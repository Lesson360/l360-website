'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_CURRENCY } from './countries';
import { convert, formatMoney, type Rates } from './format';

const STORAGE_KEY = 'lesson360_currency';

/**
 * When true, visitors not viewing prices in naira are charged in US dollars.
 * Leave off until the backend converts NGN → USD at checkout (see
 * CURRENCY_CONVERSION_HANDOFF.md); until then they pay the naira price.
 */
export const USD_CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_USD_CHECKOUT_ENABLED === 'true';

export interface DisplayPrice {
    /** Headline price in the visitor's currency, e.g. "≈ £9.10" or "₦16,000". */
    main: string;
    /** What the card will actually be charged, when that differs from `main`. */
    note: string | null;
    converted: boolean;
}

interface CurrencyContextValue {
    /** Currency prices are shown in. */
    currency: string;
    /** Currency detected from the visitor's location. */
    detectedCurrency: string;
    country: string | null;
    ready: boolean;
    hasRates: boolean;
    setCurrency: (currency: string) => void;
    /** Display a price that's stored in `source` currency (naira by default). */
    price: (amount: number, source?: string) => DisplayPrice;
    /** Currency to request at checkout, or undefined to keep the default (naira). */
    chargeCurrency: 'USD' | undefined;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [rates, setRates] = useState<Rates | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [detectedCurrency, setDetected] = useState(DEFAULT_CURRENCY);
    const [chosen, setChosen] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try { setChosen(localStorage.getItem(STORAGE_KEY)); } catch { /* storage unavailable */ }
        let active = true;
        fetch('/api/fx')
            .then(r => r.json())
            .then(data => {
                if (!active) return;
                setRates(data?.rates || null);
                setCountry(data?.country || null);
                setDetected(data?.currency || DEFAULT_CURRENCY);
            })
            .catch(() => { /* keep naira prices */ })
            .finally(() => { if (active) setReady(true); });
        return () => { active = false; };
    }, []);

    const setCurrency = useCallback((c: string) => {
        setChosen(c);
        try { localStorage.setItem(STORAGE_KEY, c); } catch { /* ignore */ }
    }, []);

    // Without rates we can only show naira.
    const currency = rates ? (chosen && (chosen === 'NGN' || rates[chosen]) ? chosen : detectedCurrency) : DEFAULT_CURRENCY;
    const chargeCurrency: 'USD' | undefined = USD_CHECKOUT_ENABLED && currency !== 'NGN' && !!rates?.USD ? 'USD' : undefined;

    const price = useCallback((amount: number, source = 'NGN'): DisplayPrice => {
        const plain: DisplayPrice = { main: formatMoney(amount, source), note: null, converted: false };
        if (!rates) return plain;
        const local = convert(amount, source, currency, rates);
        if (local == null) return plain;
        // Converted amounts are estimates (rates move daily), so mark them "≈".
        const show = (value: number, cur: string) => `${cur === source ? '' : '≈ '}${formatMoney(value, cur)}`;

        if (currency === 'NGN') return { main: show(local, 'NGN'), note: null, converted: source !== 'NGN' };

        if (chargeCurrency === 'USD') {
            const usd = convert(amount, source, 'USD', rates);
            if (usd != null) {
                return currency === 'USD'
                    ? { main: show(usd, 'USD'), note: 'Charged in US dollars', converted: true }
                    : { main: show(local, currency), note: `Charged in US dollars (${show(usd, 'USD')})`, converted: true };
            }
        }
        // USD checkout not live yet: the card is charged the naira price.
        const naira = convert(amount, source, 'NGN', rates);
        return { main: show(local, currency), note: naira != null ? `Charged as ${formatMoney(naira, 'NGN')}` : null, converted: true };
    }, [rates, currency, chargeCurrency]);

    const value = useMemo<CurrencyContextValue>(() => ({
        currency, detectedCurrency, country, ready, hasRates: !!rates, setCurrency, price, chargeCurrency,
    }), [currency, detectedCurrency, country, ready, rates, setCurrency, price, chargeCurrency]);

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
    return ctx;
}
