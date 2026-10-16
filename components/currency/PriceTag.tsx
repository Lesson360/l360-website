'use client';

import { useCurrency } from '@/lib/currency/CurrencyProvider';

interface Props {
    amount: number;
    /** Currency the price is stored in. Defaults to naira. */
    currency?: string;
    className?: string;
}

/** Price shown in the visitor's currency, e.g. "≈ £9.10" (or "₦16,000" in Nigeria). */
export function PriceText({ amount, currency = 'NGN', className }: Props) {
    const { price } = useCurrency();
    return <span className={className}>{price(amount, currency).main}</span>;
}

/** What the card is actually charged, when that differs from the displayed price. */
export function PriceNote({ amount, currency = 'NGN', className = 'block text-[11px] font-semibold text-gray-500' }: Props) {
    const { price } = useCurrency();
    const note = price(amount, currency).note;
    return note ? <span className={className}>{note}</span> : null;
}
