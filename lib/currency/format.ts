/** Rates are quoted as "1 NGN = x <currency>" (base NGN). */
export type Rates = Record<string, number>;

/** Format an amount in a currency, e.g. 9.1 GBP → "£9.10", 16000 NGN → "₦16,000". */
export function formatMoney(amount: number, currency: string): string {
    try {
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency,
            currencyDisplay: 'narrowSymbol',
            // Naira prices are whole numbers; show cents for converted amounts.
            maximumFractionDigits: currency === 'NGN' ? 0 : undefined,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString('en', { maximumFractionDigits: 2 })}`;
    }
}

/** Convert between any two currencies the rates table knows about. */
export function convert(amount: number, from: string, to: string, rates: Rates): number | null {
    if (from === to) return amount;
    const fromRate = from === 'NGN' ? 1 : rates[from];
    const toRate = to === 'NGN' ? 1 : rates[to];
    if (!fromRate || !toRate) return null;
    return (amount / fromRate) * toRate;
}
