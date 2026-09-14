import { apiClient } from './client';

export interface StandaloneCourseCategory {
    id: string;
    _id?: string;
    title: string;
    name?: string;
    slug: string;
    description?: string;
    sortOrder?: number;
}

export interface StandaloneCourseItem {
    id: string;
    _id?: string;
    title: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    thumbnailUrl?: string;
    thumbnailAccessUrl?: string;
    bannerUrl?: string;
    bannerAccessUrl?: string;
    category?: string;
    accessModel?: 'lifetime' | 'timed_access' | string;
    durationDays?: number;
    priceAmount: number;
    currency: string;
    status?: string;
    isPublicListed?: boolean;
    accessStatus?: 'active' | 'expired' | 'none';
    startsAt?: string;
    endsAt?: string | null;
    activatedAt?: string;
    entitlementId?: string;
    purchaseId?: string;
}

export interface CourseSectionItem {
    id: string;
    _id?: string;
    courseId: string;
    title: string;
    slug?: string;
    description?: string;
    order: number;
    status?: string;
    worksheet?: {
        fileName?: string;
        contentType?: string;
        sizeBytes?: number;
        uploadedAt?: string;
    } | null;
    notes?: {
        fileName?: string;
        contentType?: string;
        sizeBytes?: number;
        uploadedAt?: string;
    } | null;
}

export interface SectionVideoItem {
    id: string;
    _id?: string;
    courseId?: string;
    sectionId?: string;
    title: string;
    description?: string;
    order: number;
    durationSeconds?: number;
    durationLabel?: string;
    thumbnailAccessUrl?: string;
    transcriptUrl?: string;
    isPreview?: boolean;
}

export interface VideoPlaybackSession {
    item: {
        id: string;
        title: string;
        provider?: string;
        durationSeconds?: number;
    };
    playback: {
        provider?: string;
        url: string;
        expiresAt?: string;
    };
}

export interface DownloadUrlResponse {
    download: {
        url: string;
        expiresAt?: string;
    };
    notes?: any;
    worksheet?: any;
}

export interface CheckoutResponseData {
    purchase: {
        id: string;
        userId: string;
        childProfileId: string;
        courseId: string;
        courseTitleSnapshot?: string;
        priceAmountSnapshot?: number;
        currencySnapshot?: string;
        accessModelSnapshot?: string;
        durationDaysSnapshot?: number;
        status: string;
    };
    payment: {
        id: string;
        userId: string;
        childProfileId: string;
        purchaseId: string;
        amount: number;
        currency: string;
        provider: string;
        reference: string;
        status: string;
    };
    checkout: {
        provider: string;
        authorizationUrl: string;
        accessCode?: string;
        reference: string;
    };
}

export interface VerifyPaymentResponseData {
    message: string;
    item: {
        id: string;
        childProfileId: string;
        purchaseId: string;
        amount: number;
        currency: string;
        provider: string;
        reference: string;
        status: 'paid' | 'pending' | 'failed';
        paidAt?: string;
    };
}

export const enrichmentCoursesApi = {
    // 1. Public Catalogue
    getCategories: () =>
        apiClient.get<StandaloneCourseCategory[]>('/standalone-course-categories/public'),

    getPublicCourses: (category?: string) =>
        apiClient.get<{ data: {items: StandaloneCourseItem[]; total: number }}>(
            category ? `/standalone-courses/public?category=${encodeURIComponent(category)}` : '/standalone-courses/public'
        ),

    getPublicCourseDetail: (courseId: string) =>
        apiClient.get<{ item: StandaloneCourseItem }>(`/standalone-courses/${courseId}/public`),

    // 2. Checkout & Payment Verification
    startCheckout: (data: { childProfileId: string; courseId: string; provider?: string; callbackUrl?: string }) =>
        apiClient.post<CheckoutResponseData>('/standalone-course-checkout', {
            provider: 'paystack',
            ...data
        }),

    verifyPayment: (reference: string) =>
        apiClient.post<VerifyPaymentResponseData>(`/standalone-course-payments/${reference}/verify`, {}),

    getPaymentByRef: (reference: string) =>
        apiClient.get<{ item: any }>(`/standalone-course-payments/${reference}`),

    // 3. Child-Scoped Course Library
    getChildCourses: (childProfileId: string) =>
        apiClient.get<{ items: StandaloneCourseItem[]; total: number }>(
            `/child-profiles/${childProfileId}/standalone-courses`
        ),

    getChildCourseDetail: (childProfileId: string, courseId: string) =>
        apiClient.get<{ item: StandaloneCourseItem }>(
            `/child-profiles/${childProfileId}/standalone-courses/${courseId}`
        ),

    // 4. Sections, Videos & Downloads
    getSections: (childProfileId: string, courseId: string) =>
        apiClient.get<{ items: CourseSectionItem[]; total: number }>(
            `/child-profiles/${childProfileId}/standalone-courses/${courseId}/sections`
        ),

    getSectionVideos: (childProfileId: string, sectionId: string) =>
        apiClient.get<{ items: SectionVideoItem[]; total: number }>(
            `/child-profiles/${childProfileId}/standalone-sections/${sectionId}/videos`
        ),

    createVideoPlayback: (childProfileId: string, videoId: string) =>
        apiClient.post<VideoPlaybackSession>(
            `/child-profiles/${childProfileId}/standalone-videos/${videoId}/playback`,
            {}
        ),

    getNotesDownload: (childProfileId: string, sectionId: string) =>
        apiClient.post<DownloadUrlResponse>(
            `/child-profiles/${childProfileId}/standalone-sections/${sectionId}/notes/download`,
            {}
        ),

    getWorksheetDownload: (childProfileId: string, sectionId: string) =>
        apiClient.post<DownloadUrlResponse>(
            `/child-profiles/${childProfileId}/standalone-sections/${sectionId}/worksheet/download`,
            {}
        ),
};
