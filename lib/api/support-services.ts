import { apiClient } from './client';

export interface SupportServiceOffering {
    id: string;
    createdByUserId?: string;
    levelId: string;
    classId?: string;
    title: string;
    slug: string;
    shortDescription: string;
    description?: string;
    type: 'one_on_one' | 'group_live' | string;
    targetBand?: string;
    priceAmount: number;
    currency: string;
    sessionsIncluded: number;
    recommendationPriority?: number;
    allowDiagnosticRecommendation?: boolean;
    requiresSlotSelection: boolean;
    status: 'active' | 'inactive' | string;
    createdAt?: string;
    updatedAt?: string;
    recommendationFit?: 'primary' | 'secondary' | string;
}

export interface SupportRecommendationResponse {
    attempt: {
        id: string;
        childProfileId: string;
        levelId?: string;
        classId?: string;
        band?: string;
        percentageScore?: number;
        recommendation?: {
            summary?: string;
            primaryServiceType?: string;
            secondaryServiceType?: string;
            dominantPreferenceTag?: string;
            notes?: string[];
        };
    };
    items: SupportServiceOffering[];
    total: number;
}

export interface SupportCheckoutPayload {
    childProfileId: string;
    offeringId: string;
    diagnosticAttemptId?: string;
    provider?: string;
    callbackUrl?: string;
    reference?: string;
    metadata?: Record<string, any>;
    rawPayload?: Record<string, any>;
    adminNotes?: string;
}

export interface SupportEnrollment {
    id: string;
    userId: string;
    childProfileId: string;
    offeringId: string;
    diagnosticAttemptId?: string;
    levelId: string;
    classId?: string;
    serviceType: string;
    offeringTitle: string;
    targetBand?: string;
    priceAmount: number;
    sessionsIncluded: number;
    currency: string;
    status: 'pending_payment' | 'paid' | 'payment_failed' | 'cancelled' | 'completed' | string;
    teacherUserId?: string;
    selectedSlotId?: string;
    scheduleStatus: 'unbooked' | 'booked' | 'scheduled' | 'completed' | 'cancelled' | string;
    accessStatus: 'inactive' | 'active' | 'completed' | 'expired' | 'cancelled' | string;
    sessionsUsed: number;
    sessionsRemaining: number;
    paymentProvider?: string;
    providerReference?: string;
    providerTransactionId?: string;
    paidAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    offering?: SupportServiceOffering;
    slot?: SupportServiceSlot;
    teacher?: {
        id: string;
        firstName?: string;
        lastName?: string;
        fullName?: string;
        email?: string;
    };
}

export interface SupportCheckoutResponse {
    enrollment: SupportEnrollment;
    payment: {
        id: string;
        userId: string;
        childProfileId: string;
        enrollmentId: string;
        amount: number;
        currency: string;
        provider: string;
        reference: string;
        status: string;
        checkout: {
            provider: string;
            authorizationUrl: string;
            accessCode: string;
            reference: string;
        };
    };
    checkout: {
        provider: string;
        authorizationUrl: string;
        accessCode: string;
        reference: string;
    };
}

export interface SupportServiceSlot {
    id: string;
    offeringId: string;
    levelId: string;
    classId?: string;
    teacherUserId: string;
    serviceType: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    timezone: string;
    capacity: number;
    frequency?: string;
    startsFrom?: string;
    endsOn?: string | null;
    isActive: boolean;
    notes?: string;
    bookedCount: number;
    remainingCapacity: number;
    teacher?: {
        id: string;
        fullName: string;
        email: string;
    };
    offering?: Partial<SupportServiceOffering>;
}

export interface SupportSlotsResponse {
    enrollmentId: string;
    offering: Partial<SupportServiceOffering>;
    items: SupportServiceSlot[];
    total: number;
}

export const supportServicesApi = {
    // 1. Fetch recommended support service offerings based on diagnostic attempt
    getRecommendations: async (attemptId: string) => {
        return apiClient.get<SupportRecommendationResponse>(
            `/support-services/recommendations/attempts/${attemptId}`
        );
    },

    // 2. Fetch single offering detail
    getOfferingDetails: async (offeringId: string) => {
        return apiClient.get<{ item: SupportServiceOffering }>(
            `/support-services/offerings/${offeringId}`
        );
    },

    // 3. Start support service checkout
    checkout: async (payload: SupportCheckoutPayload) => {
        return apiClient.post<SupportCheckoutResponse>(
            '/support-services/enrollments/checkout',
            payload
        );
    },

    // 4. Verify payment with reference
    verifyPayment: async (reference: string) => {
        return apiClient.post<{ message: string; item: any }>(
            `/support-services/payments/${reference}/verify`,
            {}
        );
    },

    // 5. Fetch available schedule slots for paid enrollment
    getSlots: async (enrollmentId: string) => {
        return apiClient.get<SupportSlotsResponse>(
            `/support-services/enrollments/${enrollmentId}/slots`
        );
    },

    // 6. Select a schedule slot for enrollment
    selectSlot: async (enrollmentId: string, slotId: string) => {
        return apiClient.post<{ message: string; item: SupportEnrollment }>(
            `/support-services/enrollments/${enrollmentId}/select-slot`,
            { slotId }
        );
    },

    // 7. Get parent enrollments list
    getEnrollments: async (childProfileId?: string) => {
        const query = childProfileId ? `?childProfileId=${childProfileId}` : '';
        return apiClient.get<{ items: SupportEnrollment[]; total: number }>(
            `/support-services/enrollments${query}`
        );
    },

    // 8. Get single enrollment details
    getEnrollmentDetails: async (enrollmentId: string) => {
        return apiClient.get<{ item: SupportEnrollment }>(
            `/support-services/enrollments/${enrollmentId}`
        );
    },
};
