'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, BookOpen, CreditCard, Loader2, Lock, X } from 'lucide-react';
import { LibraryBook, formatBookPrice, libraryApi, libraryErrorMessage } from '@/lib/api/library';
import { rememberPaymentReturn } from '@/lib/payment-return';
import { BookCover } from './BookCover';

export type BookState = 'readable' | 'buy' | 'subscribe' | 'unavailable';

export function bookState(book: LibraryBook): BookState {
    const a = book.access;
    if (a?.allowed) return 'readable';
    if (a?.reason === 'purchase_required' || (a?.purchaseRequired && book.accessType === 'paid')) return 'buy';
    if (a?.reason === 'active_subscription_required') return 'subscribe';
    // No access info: fall back to the book's own access type.
    if (!a) return book.accessType === 'free' ? 'readable' : book.accessType === 'paid' ? 'buy' : 'subscribe';
    return 'unavailable';
}

export function BookBadge({ book }: { book: LibraryBook }) {
    const state = bookState(book);
    const [label, cls] =
        book.accessType === 'paid' && state === 'readable' ? ['Owned', 'bg-emerald-100 text-emerald-700']
            : book.accessType === 'free' ? ['Free', 'bg-emerald-100 text-emerald-700']
                : book.accessType === 'subscriber' ? ['Included with subscription', 'bg-blue-100 text-blue-700']
                    : [formatBookPrice(book), 'bg-orange-100 text-[#C23A00]'];
    return <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${cls}`}>{label}</span>;
}

interface Props {
    book: LibraryBook;
    childId: string;
    childName?: string;
    onClose: () => void;
    /** Called when the server says the list is stale (409/404). */
    onStale: (message: string) => void;
}

export function BookDetailsModal({ book, childId, childName, onClose, onStale }: Props) {
    const [buying, setBuying] = useState(false);
    const [error, setError] = useState('');
    const closeRef = useRef<HTMLButtonElement>(null);
    const state = bookState(book);

    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !buying) onClose(); };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    }, [onClose, buying]);

    const buy = async () => {
        setBuying(true);
        setError('');
        try {
            const res = await libraryApi.checkout({
                childProfileId: childId,
                bookId: book.id,
                callbackUrl: `${window.location.origin}/payments/library/callback`,
            });
            const url = res?.payment?.checkout?.authorizationUrl;
            if (!url) throw new Error('missing authorizationUrl');
            rememberPaymentReturn({ to: `/dashboard/library/${book.id}`, bookId: book.id });
            window.location.href = url;
        } catch (err: any) {
            const status = err?.response?.status;
            if (status === 409) {
                onStale('You already own this book, or a payment for it is still being processed. We’ve refreshed the library.');
                return;
            }
            if (status === 404) {
                onStale('That book is no longer available.');
                return;
            }
            setError(status === 502
                ? 'We couldn’t reach the payment provider. Please try again in a moment.'
                : libraryErrorMessage(err, 'Could not start the payment. Please try again.'));
            setBuying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={e => { if (e.target === e.currentTarget && !buying) onClose(); }}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="book-title"
                className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-7"
            >
                <button ref={closeRef} type="button" onClick={onClose} disabled={buying} aria-label="Close"
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
                    <div className="mx-auto aspect-[3/4] w-36 flex-none overflow-hidden rounded-2xl bg-gray-100 shadow-md sm:mx-0 sm:w-44">
                        <BookCover book={book} />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <BookBadge book={book} />
                        <h2 id="book-title" className="pr-8 text-xl font-extrabold leading-snug text-gray-900 sm:text-2xl">{book.title}</h2>
                        {book.author && <p className="text-sm font-semibold text-gray-500">by {book.author}</p>}
                        {book.description && (
                            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{book.description}</p>
                        )}

                        {error && (
                            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="mt-auto pt-2">
                            {state === 'readable' && (
                                <Link href={`/dashboard/library/${book.id}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF4801] px-5 py-3.5 text-sm font-black text-white hover:bg-[#E03F00] sm:w-auto">
                                    <BookOpen className="h-4 w-4" /> Read book
                                </Link>
                            )}

                            {state === 'buy' && (
                                <div className="space-y-2">
                                    <button type="button" onClick={buy} disabled={buying}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF4801] px-5 py-3.5 text-sm font-black text-white hover:bg-[#E03F00] disabled:opacity-70 sm:w-auto cursor-pointer">
                                        {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                                        {buying ? 'Redirecting to payment…' : `Buy book · ${formatBookPrice(book)}`}
                                    </button>
                                    <p className="text-xs font-medium text-gray-500">
                                        One-off purchase{childName ? ` for ${childName}` : ''}. Secure payment with Paystack.
                                    </p>
                                </div>
                            )}

                            {state === 'subscribe' && (
                                <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                    <p className="flex items-center gap-2 text-sm font-bold text-blue-800">
                                        <Lock className="h-4 w-4" /> Available with subscription
                                    </p>
                                    <p className="text-xs font-medium text-blue-700">
                                        This book is included when {childName || 'your child'} has an active Lesson360 subscription.
                                    </p>
                                    <Link href="/dashboard/subscription?return=/dashboard/library"
                                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-700">
                                        See subscription plans
                                    </Link>
                                </div>
                            )}

                            {state === 'unavailable' && (
                                <p className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <Lock className="h-4 w-4" /> This book isn’t available for {childName || 'this child'}.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
