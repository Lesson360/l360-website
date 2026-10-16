'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Check, CreditCard, Loader2, X } from 'lucide-react';
import { useChildProfile } from '@/lib/context/ChildProfileContext';
import { subscriptionsApi, SubscriptionPlan, TestDrillerProduct } from '@/lib/api/subscriptions';
import { featuresOf, fetchActivePlans, periodOf, priceOf, subtitleOf } from '@/lib/subscription-plans';
import { getSafeRedirect } from '@/lib/redirect';
import { rememberPaymentReturn } from '@/lib/payment-return';

const planId = (p: SubscriptionPlan) => p.id || p._id || '';
const productId = (p: TestDrillerProduct) => p.id || p._id || '';

function authorizationUrlOf(res: any): string | undefined {
    const d = res?.data;
    return d?.checkout?.authorizationUrl || d?.checkout?.authorization_url
        || d?.payment?.checkout?.authorizationUrl || d?.payment?.checkout?.authorization_url
        || d?.authorizationUrl || d?.authorization_url;
}

/**
 * Subscribe (or add a plan) for an already-onboarded child, then come back to
 * wherever the parent started — e.g. a library book that needs a subscription.
 */
function SubscriptionContent() {
    const searchParams = useSearchParams();
    const returnTo = getSafeRedirect(searchParams.get('return')) || '/dashboard';
    const { activeChild } = useChildProfile();
    const childId = activeChild?.id || activeChild?._id || '';
    const childName = activeChild?.name || activeChild?.childName;

    const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
    const [loadError, setLoadError] = useState('');
    const [busyPlan, setBusyPlan] = useState('');
    const [error, setError] = useState('');

    // Test Driller pick for plans that bundle it
    const [tdPlan, setTdPlan] = useState<SubscriptionPlan | null>(null);
    const [tdProducts, setTdProducts] = useState<TestDrillerProduct[] | null>(null);
    const [tdChoice, setTdChoice] = useState('');

    useEffect(() => {
        let active = true;
        fetchActivePlans(subscriptionsApi)
            .then(items => { if (active) setPlans(items); })
            .catch(() => { if (active) { setPlans([]); setLoadError('Could not load subscription plans. Please refresh the page.'); } });
        return () => { active = false; };
    }, []);

    const checkout = async (plan: SubscriptionPlan, testDrillerProductId?: string) => {
        if (!childId) return;
        setBusyPlan(planId(plan));
        setError('');
        try {
            const res = await subscriptionsApi.checkout({
                planId: planId(plan),
                childProfileId: childId,
                levelId: activeChild?.currentLevelId,
                classId: activeChild?.currentClassId,
                selectedTestDrillerProductId: testDrillerProductId,
                provider: 'paystack',
                callbackUrl: `${window.location.origin}/payments/subscription/callback`,
                metadata: { source: 'web_dashboard' },
            });
            const url = authorizationUrlOf(res);
            if (!url) throw new Error('missing authorizationUrl');
            rememberPaymentReturn({ to: returnTo });
            window.location.href = url;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Could not start the payment. Please try again.');
            setBusyPlan('');
            setTdPlan(null);
        }
    };

    const choose = async (plan: SubscriptionPlan) => {
        if (!plan.includesTestDriller) return checkout(plan);
        setTdPlan(plan);
        setTdProducts(null);
        setTdChoice('');
        try {
            const res: any = await subscriptionsApi.getPlanTestDrillerProducts(planId(plan), activeChild?.currentLevelId, activeChild?.currentClassId);
            const items: TestDrillerProduct[] = Array.isArray(res?.data) ? res.data : res?.data?.items || [];
            setTdProducts(items);
            if (items.length === 1) setTdChoice(productId(items[0]));
        } catch {
            setTdProducts([]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FF4801] tracking-tight">Subscription</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Choose a plan{childName ? ` for ${childName}` : ''} to unlock lessons, quizzes, exams and subscriber books in the Digital Library.
                </p>
            </div>

            {(error || loadError) && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error || loadError}</span>
                </div>
            )}

            {!childId ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center text-sm font-bold text-gray-600">
                    Add or select a child to choose a plan.
                </div>
            ) : !plans ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {[0, 1, 2].map(i => <div key={i} className="h-96 rounded-3xl bg-white border border-gray-200 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {plans.map((plan, i) => {
                        const featured = plans.length === 3 && i === 1;
                        const busy = busyPlan === planId(plan);
                        return (
                            <div key={planId(plan) || i}
                                className={`flex flex-col gap-4 rounded-3xl border p-6 shadow-xs ${featured ? 'border-[#17153A] bg-[#17153A] text-white' : 'border-gray-200 bg-white text-gray-900'}`}>
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="text-xl font-extrabold">{plan.name || plan.title || `Plan ${i + 1}`}</h2>
                                    {featured && <span className="rounded-full bg-[#FF8A3D] px-2.5 py-1 text-[10px] font-black uppercase text-[#17153A]">Most popular</span>}
                                </div>
                                <div className="flex flex-wrap items-baseline gap-1.5">
                                    <span className="text-3xl font-black tracking-tight">{priceOf(plan)}</span>
                                    <span className={`text-sm font-semibold ${featured ? 'text-white/70' : 'text-gray-500'}`}>/ {periodOf(plan)}</span>
                                </div>
                                <p className={`text-sm ${featured ? 'text-white/80' : 'text-gray-500'}`}>{subtitleOf(plan)}</p>
                                <ul className="space-y-2">
                                    {featuresOf(plan).map(f => (
                                        <li key={f.name} className={`flex items-start gap-2 text-sm font-medium ${f.included ? '' : 'opacity-45'}`}>
                                            {f.included ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8A3D]" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
                                            <span>
                                                <span className="sr-only">{f.included ? 'Included: ' : 'Not included: '}</span>
                                                {f.name}{f.detail ? ` · ${f.detail}` : ''}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <button type="button" onClick={() => choose(plan)} disabled={!!busyPlan}
                                    className={`mt-auto flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-default ${featured ? 'bg-[#FF4801] text-white hover:bg-[#FF8A3D]' : 'bg-[#17153A] text-white hover:bg-[#FF4801]'}`}>
                                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                                    {busy ? 'Redirecting to payment…' : 'Subscribe'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {tdPlan && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/50 backdrop-blur-sm sm:items-center sm:p-4">
                    <div role="dialog" aria-modal="true" aria-labelledby="td-title" className="w-full max-w-md space-y-4 rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 id="td-title" className="text-lg font-extrabold text-gray-900">Choose your Test Driller pack</h2>
                                <p className="text-sm text-gray-500">{tdPlan.name} includes one Test Driller exam pack.</p>
                            </div>
                            <button type="button" onClick={() => setTdPlan(null)} disabled={!!busyPlan} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {!tdProducts ? (
                            <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-[#FF4801]" /></div>
                        ) : tdProducts.length === 0 ? (
                            <p className="rounded-xl bg-gray-50 p-4 text-sm font-medium text-gray-600">
                                There’s no Test Driller pack for {childName || 'this child'}’s class yet. You can still subscribe — the pack can be added later.
                            </p>
                        ) : (
                            <div className="space-y-2" role="radiogroup">
                                {tdProducts.map(p => (
                                    <label key={productId(p)} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${tdChoice === productId(p) ? 'border-[#FF4801] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="td" checked={tdChoice === productId(p)} onChange={() => setTdChoice(productId(p))} className="mt-1 accent-[#FF4801]" />
                                        <span>
                                            <span className="block text-sm font-extrabold text-gray-900">{p.title || p.name}</span>
                                            {p.description && <span className="mt-0.5 block text-xs text-gray-500">{p.description}</span>}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                        <button type="button"
                            onClick={() => checkout(tdPlan, tdChoice || undefined)}
                            disabled={!tdProducts || (tdProducts.length > 0 && !tdChoice) || !!busyPlan}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF4801] px-5 py-3.5 text-sm font-black text-white hover:bg-[#E03F00] disabled:opacity-50 cursor-pointer disabled:cursor-default">
                            {busyPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                            {busyPlan ? 'Redirecting to payment…' : `Continue to payment · ${priceOf(tdPlan)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<Loader2 className="mx-auto mt-10 h-7 w-7 animate-spin text-[#FF4801]" />}>
            <SubscriptionContent />
        </Suspense>
    );
}
