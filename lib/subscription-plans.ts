import type { SubscriptionPlan, PlanDescriptionObject } from './api/subscriptions';

// Display helpers for subscription plans, shared by the landing pricing cards
// and the dashboard subscription page.

export interface PlanFeature { name: string; included: boolean; detail?: string }

const PERIOD_LABEL: Record<string, string> = { monthly: 'month', termly: 'term', school_year: 'school year', yearly: 'year' };

/** The plan's stored price and its currency (naira unless the API says otherwise). */
export function planAmount(plan: SubscriptionPlan): { amount: number; currency: string } {
    return { amount: plan.priceAmount ?? plan.price ?? plan.monthlyPrice ?? 0, currency: plan.currency || 'NGN' };
}

export function periodOf(plan: SubscriptionPlan) {
    const p = (plan.billingPeriod || 'monthly').toLowerCase();
    return PERIOD_LABEL[p] || p.replace(/_/g, ' ');
}

function descriptionObject(plan: SubscriptionPlan): PlanDescriptionObject | null {
    if (typeof plan.description === 'object' && plan.description !== null) return plan.description;
    if (typeof plan.description === 'string') {
        try { return JSON.parse(plan.description); } catch { return null; }
    }
    return null;
}

export function subtitleOf(plan: SubscriptionPlan) {
    const obj = descriptionObject(plan);
    if (obj?.textDescription) return obj.textDescription;
    if (typeof plan.description === 'string' && !obj && plan.description.trim()) return plan.description;
    return 'Access customised lessons, practice quizzes, and learning resources.';
}

export function featuresOf(plan: SubscriptionPlan): PlanFeature[] {
    if (Array.isArray(plan.features) && plan.features.length > 0) {
        return plan.features.map((f: any) => {
            if (typeof f === 'string') return { name: f, included: true };
            const value = f.value ?? 'check';
            return {
                name: f.name || f.title || 'Feature',
                included: value !== 'cross',
                detail: value !== 'check' && value !== 'cross' ? String(value) : undefined,
            };
        });
    }
    const d = descriptionObject(plan);
    return [
        { name: 'Video lessons', included: d?.videos !== false },
        { name: 'Worksheets & homework help', included: d?.worksheets !== false },
        { name: 'Learning resources & notes', included: d?.resources !== false },
        { name: 'Quizzes & progress tracking', included: d?.quizzes !== false },
        { name: 'Test Driller exam prep', included: !!plan.includesTestDriller },
    ];
}

export async function fetchActivePlans(api: { getPlans: (p: { status: string }) => Promise<any> }): Promise<SubscriptionPlan[]> {
    const res = await api.getPlans({ status: 'active' });
    const raw = res?.data;
    return Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
}
