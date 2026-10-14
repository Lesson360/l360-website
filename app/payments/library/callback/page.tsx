'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { libraryApi, libraryErrorMessage } from '@/lib/api/library';
import { clearPaymentReturn, readPaymentReturn } from '@/lib/payment-return';
import { PaymentReturnShell, StatusIcon } from '@/components/payments/PaymentReturnShell';

type State = 'verifying' | 'paid' | 'failed' | 'pending' | 'error';

function LibraryPaymentResult() {
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
    const [state, setState] = useState<State>('verifying');
    const [message, setMessage] = useState('');
    const [ret] = useState(() => (typeof window === 'undefined' ? { to: '/dashboard/library' } : readPaymentReturn('/dashboard/library')));

    // The book only unlocks once the backend has verified the reference with Paystack.
    const verify = useCallback(async () => {
        if (!reference) {
            setState('error');
            setMessage('We couldn’t find a payment reference. If you were charged, the book will unlock shortly — check your library.');
            return;
        }
        setState('verifying');
        try {
            const res = await libraryApi.verifyPayment(reference);
            const status = res?.purchase?.status || res?.payment?.status;
            if (status === 'paid' || status === 'success') {
                setState('paid');
                clearPaymentReturn();
            } else if (status === 'payment_failed' || status === 'failed') {
                setState('failed');
            } else {
                setState('pending');
            }
        } catch (err: any) {
            setState('error');
            setMessage(libraryErrorMessage(err, 'We couldn’t confirm your payment yet. Please try again.'));
        }
    }, [reference]);

    useEffect(() => { verify(); }, [verify]);

    const primary = 'block w-full rounded-2xl bg-[#FF4801] px-5 py-3.5 text-sm font-black text-white hover:bg-[#E03F00]';
    const secondary = 'block w-full rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50';

    if (state === 'verifying') {
        return (
            <>
                <StatusIcon tone="pending"><Loader2 className="h-8 w-8 animate-spin" /></StatusIcon>
                <h1 className="text-xl font-extrabold text-gray-900">Confirming your payment…</h1>
                <p className="mt-2 text-sm text-gray-500">This only takes a moment. Please don’t close this page.</p>
            </>
        );
    }

    if (state === 'paid') {
        return (
            <>
                <StatusIcon tone="success"><CheckCircle2 className="h-8 w-8" /></StatusIcon>
                <h1 className="text-xl font-extrabold text-gray-900">Book unlocked!</h1>
                <p className="mt-2 text-sm text-gray-500">Your payment was successful. The book is now in your library.</p>
                <div className="mt-6 space-y-2.5">
                    <Link href={ret.bookId ? `/dashboard/library/${ret.bookId}` : '/dashboard/library'} className={`${primary} inline-flex items-center justify-center gap-2`}>
                        <BookOpen className="h-4 w-4" /> {ret.bookId ? 'Read it now' : 'Go to library'}
                    </Link>
                    <Link href="/dashboard/library" className={secondary}>Back to library</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <StatusIcon tone={state === 'pending' ? 'pending' : 'error'}>
                {state === 'pending' ? <Loader2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            </StatusIcon>
            <h1 className="text-xl font-extrabold text-gray-900">
                {state === 'failed' ? 'Payment wasn’t completed' : state === 'pending' ? 'Payment still processing' : 'We couldn’t confirm your payment'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
                {state === 'failed'
                    ? 'The payment didn’t go through, so the book is still locked. You can try again from the library.'
                    : state === 'pending'
                        ? 'Paystack hasn’t confirmed this payment yet. Check again in a moment.'
                        : message}
            </p>
            <div className="mt-6 space-y-2.5">
                {state !== 'failed' && (
                    <button type="button" onClick={verify} className={`${primary} cursor-pointer`}>Check again</button>
                )}
                <Link href="/dashboard/library" className={state === 'failed' ? primary : secondary}>Back to library</Link>
            </div>
        </>
    );
}

export default function LibraryPaymentCallbackPage() {
    return (
        <PaymentReturnShell>
            <Suspense fallback={<Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FF4801]" />}>
                <LibraryPaymentResult />
            </Suspense>
        </PaymentReturnShell>
    );
}
