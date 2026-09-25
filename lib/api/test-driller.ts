import { apiClient } from './client';

export interface ChildEntitlement {
    id: string;
    productId: string;
    productTitleSnapshot: string;
    status: string;
    startsAt: string;
    endsAt: string | null;
    // Per-product scope snapshot, confirmed present on the purchase/checkout response
    // (POST /test-driller/checkout -> data.purchase). Not documented on the /access
    // endpoint's entitlements in the handoff, but read defensively here in case the
    // backend attaches the same snapshot fields there too.
    examTypeIdsSnapshot?: string[];
    subjectIdsSnapshot?: string[];
    yearStartSnapshot?: number | null;
    yearEndSnapshot?: number | null;
}

export interface ChildAccessScope {
    allExamTypes: boolean;
    allSubjects: boolean;
    examTypeIds: string[];
    subjectIds: string[];
    yearStart: number | null;
    yearEnd: number | null;
}

export interface ChildAccessResponse {
    childProfileId: string;
    hasAccess: boolean;
    entitlements: ChildEntitlement[];
    accessScope: ChildAccessScope;
}

export interface ExamType {
    id: string;
    name: string;
    slug: string;
    description: string;
    sortOrder: number;
    status: string;
}

export interface SubjectItem {
    id: string;
    name: string;
    code?: string;
    iconUrl?: string;
}

export interface Paper {
    id: string;
    examTypeId: string;
    subjectId: string;
    title: string;
    year: number;
    instructions: string;
    durationMinutes: number;
    attemptMode: 'exam' | 'practice';
    maxAttempts: number | null;
    totalMarks: number;
    totalQuestions: number;
    status: string;
}

export interface QuestionOption {
    id?: string;
    _id?: string;
    key?: string;
    label?: string;
    text: string;
    isCorrect?: boolean;
}

export interface SessionQuestion {
    id: string;
    type: 'single_choice' | 'multiple_choice' | 'short_text';
    prompt: string;
    helperText?: string;
    imageUrl?: string;
    imageAltText?: string;
    options: QuestionOption[];
    marks: number;
    order: number;
}

export interface QuestionAnswerPayload {
    questionId: string;
    selectedOptionKeys?: string[];
    textAnswer?: string;
    // Populated on the response (attempt.answers / submit result), not sent in requests.
    isCorrect?: boolean;
    scoreAwarded?: number;
}

export interface AttemptItem {
    id: string;
    childProfileId: string;
    paperId: string;
    attemptNumber: number;
    attemptMode: 'exam' | 'practice';
    maxAttempts: number | null;
    status: 'in_progress' | 'submitted' | 'expired';
    startedAt: string;
    durationMinutes: number | null;
    expiresAt: string | null;
    remainingTimeSeconds: number | null;
    totalQuestions: number;
    totalCorrect?: number;
    score?: number;
    totalAvailableScore?: number;
    percentage?: number;
    reviewAvailable?: boolean;
    submissionReason?: 'manual' | 'time_expired';
    answers: QuestionAnswerPayload[];
}

export interface StartAttemptResponse {
    item: AttemptItem;
    session: {
        paper: Partial<Paper>;
        questions: SessionQuestion[];
    };
}

export interface ReviewQuestion {
    id: string;
    prompt: string;
    type?: string;
    options: QuestionOption[];
    correctTextAnswers?: string[];
    explanation?: string;
}

export interface SubmitAttemptResponse {
    item: AttemptItem;
    review?: {
        paper: Partial<Paper>;
        questions: ReviewQuestion[];
    };
}

// ==========================================
// Test Driller Product Catalogue & Standalone Checkout
// ==========================================
// Endpoints confirmed against TEST_DRILLER_MOBILE_IMPLEMENTATION.md (the mobile app's
// documented, already-working Test Driller integration).

export interface TestDrillerProductCatalogItem {
    id?: string;
    _id?: string;
    name: string;
    title?: string;
    description?: string;
    slug?: string;
    priceAmount?: number;
    currency?: string;
    durationDays?: number;
    durationMonths?: number;
    isMostPopular?: boolean;
    status?: string;
}

export interface TestDrillerProductCheckoutPayload {
    childProfileId: string;
    productId: string;
    provider?: string;
    callbackUrl?: string;
}

export interface TestDrillerProductPurchase {
    id: string;
    userId: string;
    childProfileId: string;
    productId: string;
    productTitleSnapshot?: string;
    priceAmountSnapshot?: number;
    currencySnapshot?: string;
    accessDurationDaysSnapshot?: number;
    examTypeIdsSnapshot?: string[];
    subjectIdsSnapshot?: string[];
    yearStartSnapshot?: number | null;
    yearEndSnapshot?: number | null;
    status: string;
}

export interface TestDrillerProductCheckoutResponse {
    data: {
        purchase?: TestDrillerProductPurchase;
        entitlement?: any;
        payment?: {
            reference?: string;
            amount?: number;
            currency?: string;
            status?: string;
        };
        checkout: {
            provider: string;
            authorizationUrl: string;
            accessCode?: string;
            reference: string;
        };
    };
}

export interface TestDrillerProductVerifyResponse {
    message?: string;
    item?: {
        reference?: string;
        status?: string;
    };
    data?: {
        item?: {
            reference?: string;
            status?: string;
        };
    };
}

// Statuses the mobile app treats as a successful payment.
const TEST_DRILLER_PAID_STATUSES = ['paid', 'success', 'successful', 'completed'];

export function isTestDrillerPaymentPaid(res: TestDrillerProductVerifyResponse | null | undefined): boolean {
    const status = res?.item?.status || res?.data?.item?.status;
    return !!status && TEST_DRILLER_PAID_STATUSES.includes(status.toLowerCase());
}

export const testDrillerApi = {
    // 1. Check Child Access
    async checkChildAccess(childProfileId: string): Promise<ChildAccessResponse> {
        const res: any = await apiClient.get(
            `/test-driller/child-profiles/${childProfileId}/access`
        );
        return res?.data || res;
    },

    // 2. Browse Exam Types
    async getExamTypes(childProfileId: string): Promise<{ items: ExamType[]; total: number }> {
        const res: any = await apiClient.get(
            `/test-driller/child-profiles/${childProfileId}/exam-types`
        );
        return res?.data || res;
    },

    // 3. Browse Subjects
    async getSubjects(
        childProfileId: string,
        examTypeId?: string
    ): Promise<{ items: SubjectItem[]; total: number }> {
        const query = examTypeId ? `?examTypeId=${encodeURIComponent(examTypeId)}` : '';
        const res: any = await apiClient.get(
            `/test-driller/child-profiles/${childProfileId}/subjects${query}`
        );
        return res?.data || res;
    },

    // 4. Browse Years
    async getYears(
        childProfileId: string,
        examTypeId?: string,
        subjectId?: string
    ): Promise<{ items: number[]; total: number }> {
        const params = new URLSearchParams();
        if (examTypeId) params.append('examTypeId', examTypeId);
        if (subjectId) params.append('subjectId', subjectId);
        const query = params.toString() ? `?${params.toString()}` : '';

        const res: any = await apiClient.get(
            `/test-driller/child-profiles/${childProfileId}/years${query}`
        );
        return res?.data || res;
    },

    // 5. Browse Papers
    async getPapers(
        childProfileId: string,
        filters?: { examTypeId?: string; subjectId?: string; year?: number }
    ): Promise<{ items: Paper[]; total: number }> {
        const params = new URLSearchParams();
        if (filters?.examTypeId) params.append('examTypeId', filters.examTypeId);
        if (filters?.subjectId) params.append('subjectId', filters.subjectId);
        if (filters?.year) params.append('year', filters.year.toString());
        const query = params.toString() ? `?${params.toString()}` : '';

        const res: any = await apiClient.get(
            `/test-driller/child-profiles/${childProfileId}/papers${query}`
        );
        return res?.data || res;
    },

    // 6. Get Attempts History
    async getAttempts(childProfileId: string): Promise<{ items: AttemptItem[]; total: number }> {
        const res: any = await apiClient.get(
            `/test-driller/child-profiles/${childProfileId}/attempts`
        );
        return res?.data || res;
    },

    // 7. Get Attempt Detail
    async getAttemptDetail(childProfileId: string, attemptId: string): Promise<{ item: AttemptItem }> {
        const res: any = await apiClient.get(
            `/test-driller/child-profiles/${childProfileId}/attempts/${attemptId}`
        );
        return res?.data || res;
    },

    // 8. Start / Resume Paper Attempt
    async startPaperAttempt(childProfileId: string, paperId: string): Promise<StartAttemptResponse> {
        const res: any = await apiClient.post(
            `/test-driller/child-profiles/${childProfileId}/papers/${paperId}/start`,
            {}
        );
        return res?.data || res;
    },

    // 9. Autosave Attempt Progress
    async saveAttemptProgress(
        childProfileId: string,
        attemptId: string,
        answers: QuestionAnswerPayload[]
    ): Promise<{ item: AttemptItem }> {
        const res: any = await apiClient.patch(
            `/test-driller/child-profiles/${childProfileId}/attempts/${attemptId}/progress`,
            { answers }
        );
        return res?.data || res;
    },  

    // 10. Submit Attempt
    async submitAttempt(
        childProfileId: string,
        attemptId: string,
        answers: QuestionAnswerPayload[]
    ): Promise<SubmitAttemptResponse> {
        const res: any = await apiClient.post(
            `/test-driller/child-profiles/${childProfileId}/attempts/${attemptId}/submit`,
            { answers }
        );
        return res?.data || res;
    },

    // 11. Product Catalogue (all sellable Test Driller combos, purchased or not).
    // The mobile app scopes this to the child's current class via `classId`.
    async getProductCatalog(classId?: string): Promise<{ items: TestDrillerProductCatalogItem[]; total: number }> {
        const query = classId ? `?classId=${encodeURIComponent(classId)}` : '';
        const res: any = await apiClient.get(`/test-driller/products/public${query}`);
        const raw = res?.data ?? res;
        const rawItems: any[] = Array.isArray(raw)
            ? raw
            : raw?.items || [];

        const items: TestDrillerProductCatalogItem[] = rawItems
            .filter((p) => p && (p.id || p._id))
            .map((p) => ({
                ...p,
                id: p.id || p._id,
                name: p.name || p.title || p.label || 'Test Driller Bundle'
            }));

        return { items, total: items.length };
    },

    // 12. Standalone Product Checkout (buy one combo directly, no subscription plan involved)
    async startProductCheckout(
        payload: TestDrillerProductCheckoutPayload
    ): Promise<TestDrillerProductCheckoutResponse> {
        // apiClient.post already unwraps axios's response.data, so `res` here is the full
        // backend envelope { message, data: { purchase, payment, checkout } } — matching
        // TestDrillerProductCheckoutResponse exactly. Do NOT strip `.data` here; the caller
        // reads `res.data.checkout.authorizationUrl`.
        const res: any = await apiClient.post('/test-driller/checkout', {
            provider: 'paystack',
            ...payload
        });
        return res;
    },

    // 13. Verify Standalone Product Payment
    async verifyProductPayment(reference: string): Promise<TestDrillerProductVerifyResponse> {
        const res: any = await apiClient.post(`/test-driller/payments/${reference}/verify`, {});
        return res?.data || res;
    }
};
