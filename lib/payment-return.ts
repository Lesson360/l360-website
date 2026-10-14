import { getSafeRedirect } from './redirect';

// Where to take the parent after a Paystack round-trip. Kept in sessionStorage
// (same tab survives the redirect to Paystack and back) rather than in the
// callback URL, which Paystack appends its own query parameters to.
const KEY = 'lesson360_payment_return';

export interface PaymentReturn {
    /** Page to continue to once payment is verified. */
    to: string;
    /** Optional context, e.g. the book being bought. */
    bookId?: string;
}

export function rememberPaymentReturn(value: PaymentReturn) {
    try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

export function readPaymentReturn(fallback: string): PaymentReturn {
    try {
        const raw = sessionStorage.getItem(KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as PaymentReturn;
            const to = getSafeRedirect(parsed.to);
            if (to) return { ...parsed, to };
        }
    } catch { /* fall through */ }
    return { to: fallback };
}

export function clearPaymentReturn() {
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
