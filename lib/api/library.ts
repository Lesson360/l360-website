import { apiClient } from './client';

export type LibraryAccessType = 'free' | 'subscriber' | 'paid';

export type LibraryAccessReason =
    | 'purchase_required'
    | 'active_subscription_required'
    | 'not_for_child_class'
    | string;

export interface LibraryBookAccess {
    allowed: boolean;
    reason: LibraryAccessReason;
    purchaseRequired: boolean;
    purchaseId?: string;
}

export interface LibraryBook {
    id: string;
    title: string;
    slug?: string;
    author?: string;
    description?: string;
    accessType: LibraryAccessType;
    priceAmount?: number;
    currency?: string;
    scope?: 'general' | 'class';
    levelId?: string | null;
    classId?: string | null;
    allowDownload?: boolean;
    coverUrl?: string;
    publishedAt?: string | null;
    access?: LibraryBookAccess;
}

export interface LibraryReadResponse {
    item: Pick<LibraryBook, 'id' | 'title'>;
    access: LibraryBookAccess;
    read: { method: string; url: string; expiresInSeconds: number };
}

export interface LibraryPurchase {
    id: string;
    childProfileId: string;
    bookId: string;
    bookTitleSnapshot?: string;
    priceAmountSnapshot?: number;
    currencySnapshot?: string;
    status: 'pending_payment' | 'paid' | 'payment_failed' | string;
}

export interface LibraryCheckoutResponse {
    purchase: LibraryPurchase;
    payment: {
        id: string;
        reference: string;
        status: string;
        amount: number;
        currency: string;
        checkout: { provider: string; authorizationUrl: string; accessCode?: string; reference: string };
    };
}

export interface LibraryVerifyResponse {
    purchase?: LibraryPurchase;
    payment?: { reference?: string; status?: string };
}

// Some endpoints wrap payloads in `data`; accept both shapes.
const unwrap = <T,>(res: any): T => (res && typeof res === 'object' && 'data' in res && res.data && !('items' in res) && !('item' in res) ? res.data : res);

export const libraryApi = {
    /** Published books available to this child (general + the child's class). */
    listBooks: async (childProfileId: string, params?: { accessType?: LibraryAccessType }) => {
        const res = unwrap<{ items?: LibraryBook[]; total?: number } | LibraryBook[]>(
            await apiClient.get(`/library/child-profiles/${childProfileId}/books`, { params }),
        );
        const items = Array.isArray(res) ? res : res.items || [];
        return { items, total: Array.isArray(res) ? res.length : res.total ?? items.length };
    },

    /** Returns a short-lived signed URL for the PDF. Never persist it. */
    read: async (childProfileId: string, bookId: string) =>
        unwrap<LibraryReadResponse>(await apiClient.post(`/library/child-profiles/${childProfileId}/books/${bookId}/read`, {})),

    checkout: async (data: { childProfileId: string; bookId: string; callbackUrl?: string }) =>
        unwrap<LibraryCheckoutResponse>(await apiClient.post('/library/checkout', data)),

    verifyPayment: async (reference: string) =>
        unwrap<LibraryVerifyResponse>(await apiClient.post(`/library/payments/${encodeURIComponent(reference)}/verify`, {})),
};

export function formatBookPrice(book: Pick<LibraryBook, 'priceAmount' | 'currency'>) {
    const amount = book.priceAmount ?? 0;
    const symbol = !book.currency || book.currency === 'NGN' ? '₦' : `${book.currency} `;
    return `${symbol}${amount.toLocaleString()}`;
}

/** Human-readable label for an API error, falling back to a generic message. */
export function libraryErrorMessage(err: any, fallback: string) {
    return err?.response?.data?.message || fallback;
}
