import { apiClient } from './client';

export interface PlanDescriptionObject {
    videos?: boolean;
    worksheets?: boolean;
    quizzes?: boolean;
    notes?: boolean;
    resources?: boolean;
    textDescription?: string;
    [key: string]: any;
}

export interface SubscriptionPlan {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    slug?: string;
    description?: string | PlanDescriptionObject;
    priceAmount?: number;
    price?: number;
    monthlyPrice?: number;
    yearlyPrice?: number;
    currency?: string;
    billingPeriod?: 'monthly' | 'termly' | 'school_year' | 'yearly' | string;
    features?: string[] | any[];
    includesTestDriller?: boolean;
    includedTestDrillerProductIds?: string[];
    sortOrder?: number;
    status?: string;
}

export interface TestDrillerProduct {
    id?: string;
    _id?: string;
    name: string;
    title?: string;
    description?: string;
    slug?: string;
    status?: string;
}

export interface CheckoutPayload {
    childProfileId?: string;
    planId: string;
    levelId?: string;
    classId?: string;
    selectedTestDrillerProductId?: string;
    provider?: string;
    callbackUrl?: string;
    metadata?: Record<string, any>;
    billingPeriod?: string;
}

export interface CheckoutResponse {
    message?: string;
    data?: {
        subscription?: any;
        payment?: {
            reference?: string;
            checkout?: {
                authorizationUrl?: string;
                authorization_url?: string;
                reference?: string;
            };
        };
        checkout?: {
            authorizationUrl?: string;
            authorization_url?: string;
            reference?: string;
        };
        authorizationUrl?: string;
        authorization_url?: string;
        reference?: string;
    };
}

export interface VerifyPaymentResponse {
    message: string;
    data?: {
        status?: 'success' | 'paid' | 'failed' | 'pending';
        reference?: string;
        subscription?: any;
        payment?: any;
        nextAction?: string;
        nextScreen?: string;
    };
}

export const subscriptionsApi = {
    // Fetch active subscription plans
    getPlans: (params?: { status?: string; billingPeriod?: string }) =>
        apiClient.get<{ message: string; data: SubscriptionPlan[] | { items: SubscriptionPlan[]; total: number } }>(
            '/subscription-plans',
            { params }
        ),

    // Fetch TestDriller products
    getTestDrillerProducts: () =>
        apiClient.get<{ message: string; data: TestDrillerProduct[] | { items: TestDrillerProduct[] } }>(
            '/test-driller-products'
        ).catch(() =>
            apiClient.get<{ message: string; data: TestDrillerProduct[] | { items: TestDrillerProduct[] } }>(
                '/test-driller/products'
            )
        ).catch(() => ({ data: [] as TestDrillerProduct[] })),

    // Preferred Checkout endpoint: POST /api/v1/subscriptions/checkout
    checkout: (payload: CheckoutPayload) =>
        apiClient.post<CheckoutResponse>(
            '/subscriptions/checkout',
            payload
        ),

    // Verify payment endpoint: GET /api/v1/subscriptions/payments/callback?reference=...
    verifyPaymentCallback: (reference: string) =>
        apiClient.get<VerifyPaymentResponse>(
            `/subscriptions/payments/callback`,
            { params: { reference } }
        ).catch(() =>
            // Fallback verification endpoint if callback alias isn't matched
            apiClient.get<VerifyPaymentResponse>(
                `/subscriptions/verify/${reference}`
            )
        ),
};
