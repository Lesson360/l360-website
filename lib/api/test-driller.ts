import { apiClient } from './client';

export interface ChildEntitlement {
    id: string;
    productId: string;
    productTitleSnapshot: string;
    status: string;
    startsAt: string;
    endsAt: string | null;
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
    key: string;
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
            { submissionReason: 'manual' }
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
        answers: QuestionAnswerPayload[],
        submissionReason: string = 'manual'
    ): Promise<SubmitAttemptResponse> {
        const res: any = await apiClient.post(
            `/test-driller/child-profiles/${childProfileId}/attempts/${attemptId}/submit`,
            { answers, submissionReason }
        );
        return res?.data || res;
    }
};
