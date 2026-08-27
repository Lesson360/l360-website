import { apiClient } from './client';

export interface DiagnosticOption {
    key: string;
    text: string;
    score?: number;
}

export interface DiagnosticQuestion {
    id: string;
    _id?: string;
    prompt: string;
    helperText?: string;
    imageUrl?: string;
    type?: string;
    order?: number;
    difficulty?: string;
    skillTag?: string;
    weight?: number;
    options: DiagnosticOption[];
}

export interface DiagnosticTemplate {
    id: string;
    _id?: string;
    title: string;
    description?: string;
    estimatedMinutes?: number;
    questions: DiagnosticQuestion[];
}

export interface DiagnosticAnswer {
    questionId: string;
    selectedOptionKey: string;
}

export interface DiagnosticAttemptResult {
    id?: string;
    _id?: string;
    childProfileId?: string;
    templateId?: string;
    templateTitle?: string;
    status?: string;
    totalQuestions?: number;
    totalScore?: number;
    maxScore?: number;
    percentageScore?: number;
    band?: string;
    skillBreakdown?: Array<{
        skillTag: string;
        total: number;
        correct: number;
        percentage: number;
    }>;
    recommendation?: {
        headline?: string;
        summary?: string;
    };
}

export const diagnosticApi = {
    // GET /diagnostic/child-profiles/:profileId/template
    async getTemplate(profileId: string) {
        return await apiClient.get<any>(`/diagnostics/child-profiles/${profileId}/template`);
    },

    // POST /diagnostic/child-profiles/:profileId/attempts
    async submitAttempt(profileId: string, payload: { templateId: string; answers: DiagnosticAnswer[] }) {
        return await apiClient.post<any>(`/diagnostics/child-profiles/${profileId}/attempts`, payload);
    },

    // GET /diagnostic/child-profiles/:profileId/history
    async getHistory(profileId: string) {
        return await apiClient.get<any>(`/diagnostics/child-profiles/${profileId}/history`);
    },

    // GET /diagnostic/attempts/:attemptId
    async getAttemptDetails(attemptId: string) {
        return await apiClient.get<any>(`/diagnostics/attempts/${attemptId}`);
    },
};
