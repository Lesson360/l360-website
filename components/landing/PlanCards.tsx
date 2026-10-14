'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { subscriptionsApi, SubscriptionPlan } from '@/lib/api/subscriptions';
import { featuresOf, periodOf, priceOf, subtitleOf } from '@/lib/subscription-plans';

// Shown only if the plans endpoint is unreachable or empty.
const FALLBACK_PLANS: SubscriptionPlan[] = [
    { id: 'basic-plan', name: 'Basic', billingPeriod: 'monthly', priceAmount: 15000, currency: 'NGN', description: 'Standard monthly learning access for core subject modules & quizzes.' },
    { id: 'standard-plan', name: 'Standard', billingPeriod: 'termly', priceAmount: 45000, currency: 'NGN', description: 'Complete termly academic package with full video library & worksheets.' },
    { id: 'premium-plan', name: 'Premium', billingPeriod: 'school_year', priceAmount: 70000, currency: 'NGN', description: 'Full school year access with Test Driller CBT prep & 1-on-1 tutoring.', includesTestDriller: true },
];

export function PlanCards() {
    const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);

    useEffect(() => {
        let active = true;
        subscriptionsApi.getPlans({ status: 'active' })
            .then(res => {
                const raw = res?.data;
                const items = Array.isArray(raw) ? raw : Array.isArray((raw as any)?.items) ? (raw as any).items : [];
                if (active) setPlans(items.length ? items : FALLBACK_PLANS);
            })
            .catch(() => { if (active) setPlans(FALLBACK_PLANS); });
        return () => { active = false; };
    }, []);

    const grid = 'grid w-full max-w-[1120px] items-stretch gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]';

    if (!plans) {
        return (
            <div className={grid} aria-busy="true" aria-label="Loading subscription plans">
                {[0, 1, 2].map(i => <div key={i} className="h-[380px] animate-pulse rounded-[28px] bg-cream/60" />)}
            </div>
        );
    }

    // With three plans, the middle one is the featured (dark) card, as in the design.
    const featured = plans.length === 3 ? 1 : -1;

    return (
        <div className={grid}>
            {plans.map((plan, i) => {
                const dark = i === featured;
                const id = plan.id || plan._id || '';
                const name = plan.name || plan.title || `Plan ${i + 1}`;
                return (
                    <div
                        key={id || name}
                        className={`pointer-events-auto flex flex-col gap-[18px] rounded-[28px] p-6 text-left shadow-[0_24px_50px_-30px_rgba(23,21,58,.55)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 sm:p-7 ${dark ? 'bg-ink text-cream' : 'bg-cream text-ink'}`}
                    >
                        {featured >= 0 && (dark
                            ? <span className="self-start rounded-full bg-[#FF8A3D] px-3 py-1.5 font-jetbrains text-[11px] font-bold tracking-[.1em] text-ink">MOST POPULAR</span>
                            : <span aria-hidden="true" className="hidden h-[27px] md:block" />)}
                        <div className="font-grotesk text-[26px] font-extrabold tracking-[-.02em]">{name}</div>
                        <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="font-grotesk text-[clamp(38px,4vw,48px)] font-extrabold leading-none tracking-[-.04em]">{priceOf(plan)}</span>
                            <span className={`text-[15px] ${dark ? 'text-[#CFCBE8]' : 'text-[#4A4770]'}`}>/ {periodOf(plan)}</span>
                        </div>
                        <p className={`m-0 text-[15px] leading-snug ${dark ? 'text-[#CFCBE8]' : 'text-[#4A4770]'}`}>{subtitleOf(plan)}</p>
                        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                            {featuresOf(plan).map(f => (
                                <li key={f.name} className={`flex items-start gap-2.5 text-[15px] leading-[1.4] ${f.included ? '' : 'opacity-45'}`}>
                                    <span aria-hidden="true" className={`font-extrabold ${dark ? 'text-[#FF8A3D]' : 'text-flame'}`}>{f.included ? '✓' : '✕'}</span>
                                    <span>
                                        <span className="sr-only">{f.included ? 'Included: ' : 'Not included: '}</span>
                                        {f.name}{f.detail ? ` · ${f.detail}` : ''}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={id ? `/signup?planId=${encodeURIComponent(id)}` : '/signup'}
                            className={`mt-auto rounded-full px-[22px] py-[15px] text-center text-base font-bold transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-[#FF8A3D] hover:text-ink ${dark ? 'bg-flame text-cream' : 'bg-ink text-cream'}`}
                        >
                            Subscribe
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
