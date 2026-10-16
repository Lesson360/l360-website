'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { subscriptionsApi } from '@/lib/api/subscriptions';
import { clearPaymentReturn, readPaymentReturn } from '@/lib/payment-return';
import { PaymentReturnShell, StatusIcon } from '@/components/payments/PaymentReturnShell';

type State = 'verifying' | 'paid' | 'failed' | 'pending' | 'error';

/** Paystack return for subscriptions started from the dashboard (not onboarding). */
function SubscriptionPaymentResult() {
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
    const [state, setState] = useState<State>('verifying');
    const [message, setMessage] = useState('');
    const [ret] = useState(() => (typeof window === 'undefined' ? { to: '/dashboard' } : readPaymentReturn('/dashboard')));

    const verify = useCallback(async () => {
        if (!reference) {
            setState('error');
            setMessage('We couldn’t find a payment reference. If you were charged, your subscription will activate shortly.');
            return;
        }
        setState('verifying');
        try {
            const res = await subscriptionsApi.verifyPaymentCallback(reference);
            const status = res?.data?.status;
            if (status === 'success' || status === 'paid') {
                setState('paid');
                clearPaymentReturn();
            } else if (status === 'failed') {
                setState('failed');
            } else {
                setState('pending');
            }
        } catch (err: any) {
            setState('error');
            setMessage(err?.response?.data?.message || 'We couldn’t confirm your payment yet. Please try again.');
        }
    }, [reference]);

    useEffect(() => { verify(); }, [verify]);

    const primary = 'block w-full rounded-2xl bg-[#FF4801] px-5 py-3.5 text-sm font-black text-white hover:bg-[#E03F00]';
    const secondary = 'block w-full rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50';

    if (state === 'verifying') {
        return (
            <>
                <StatusIcon tone="pending"><Loader2 className="h-8 w-8 animate-spin" /></StatusIcon>
                <h1 className="text-xl font-extrabold text-gray-900">Confirming your subscription…</h1>
                <p className="mt-2 text-sm text-gray-500">This only takes a moment. Please don’t close this page.</p>
            </>
        );
    }

    if (state === 'paid') {
        return (
            <>
                <StatusIcon tone="success"><CheckCircle2 className="h-8 w-8" /></StatusIcon>
                <h1 className="text-xl font-extrabold text-gray-900">Subscription active!</h1>
                <p className="mt-2 text-sm text-gray-500">Your payment was successful and everything in your plan is now unlocked.</p>
                <div className="mt-6"><Link href={ret.to} className={primary}>Continue</Link></div>
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
                    ? 'The payment didn’t go through, so your plan hasn’t changed. You can try again.'
                    : state === 'pending'
                        ? 'Paystack hasn’t confirmed this payment yet. Check again in a moment.'
                        : message}
            </p>
            <div className="mt-6 space-y-2.5">
                {state !== 'failed' && <button type="button" onClick={verify} className={`${primary} cursor-pointer`}>Check again</button>}
                <Link href="/dashboard/subscription" className={state === 'failed' ? primary : secondary}>Back to plans</Link>
            </div>
        </>
    );
}

export default function SubscriptionPaymentCallbackPage() {
    return (
        <PaymentReturnShell>
            <Suspense fallback={<Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FF4801]" />}>
                <SubscriptionPaymentResult />
            </Suspense>
        </PaymentReturnShell>
    );
}
