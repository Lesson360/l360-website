import { apiClient } from './client';

export interface AnalyticsOverview {
    totalVideosWatched?: number;
    totalQuizAttempts?: number;
    averageQuizScore?: number;
    completedTopicsCount?: number;
    totalSubjectsCount?: number;
    activeClassName?: string;
    levelName?: string;
    recentActivity?: Array<{
        id: string;
        title: string;
        type: 'video' | 'quiz' | 'note';
        subjectName?: string;
        timestamp?: string;
        progress?: number;
    }>;
}

export interface SubjectItem {
    id?: string;
    _id?: string;
    name: string;
    description?: string;
    code?: string;
    icon?: string;
    bgColor?: string;
    order?: number;
    status?: string;
    classId?: string;
    topicsCount?: number;
    completedVideos?: number;
    totalVideos?: number;
}

export interface TopicVideo {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    description?: string;
    duration?: number;
    durationSeconds?: number;
    thumbnailUrl?: string;
    thumbnailAccessUrl?: string;
    videoUrl?: string;
    muxPlaybackId?: string;
    playbackId?: string;
    isCompleted?: boolean;
    progressSeconds?: number;
}

export interface VideoPlaybackInfo {
    provider?: string;
    policy?: string;
    playbackId?: string;
    token?: string;
    url?: string;
    expiresAt?: string;
}

export interface VideoPlaybackResponseData {
    item?: TopicVideo;
    playback?: VideoPlaybackInfo;
    playbackUrl?: string;
    playbackId?: string;
    videoUrl?: string;
}

export interface WorksheetFileInfo {
    fileName?: string;
    contentType?: string;
    sizeBytes?: number;
    uploadedAt?: string;
    fileUrl?: string;
}

export interface TopicWorksheetData {
    topic?: any;
    worksheet?: WorksheetFileInfo;
    worksheetPdf?: WorksheetFileInfo;
    worksheetWord?: WorksheetFileInfo;
    worksheets?: {
        pdf?: WorksheetFileInfo;
        word?: WorksheetFileInfo;
        availableFormats?: string[];
    };
}

export interface NotesFileInfo {
    fileName?: string;
    contentType?: string;
    sizeBytes?: number;
    uploadedAt?: string;
    content?: string;
    fileUrl?: string;
    downloadUrl?: string;
}

export interface TopicNotesData {
    topic?: any;
    notes?: NotesFileInfo;
}

export interface TopicItem {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    description?: string;
    order?: number;
    videos?: TopicVideo[];
    videoList?: TopicVideo[];
    topicVideos?: TopicVideo[];
    videosList?: TopicVideo[];
    media?: TopicVideo[];
    video?: TopicVideo;
    hasNotes?: boolean;
    hasWorksheet?: boolean;
    hasQuiz?: boolean;
    worksheet?: WorksheetFileInfo;
    notes?: NotesFileInfo;
}

export interface QuizQuestion {
    id?: string;
    _id?: string;
    prompt?: string;
    questionText?: string;
    type?: string;
    points?: number;
    options: Array<{
        id?: string;
        _id?: string;
        key?: string;
        text: string;
        isCorrect?: boolean;
    }>;
    explanation?: string;
}

export interface TopicAssessment {
    id?: string;
    _id?: string;
    title: string;
    description?: string;
    topicId?: string;
    passingScore?: number;
    passMark?: number;
    timeLimitMinutes?: number;
    durationMinutes?: number;
    totalQuestions?: number;
    totalScore?: number;
    attemptPolicy?: string;
    questions?: QuizQuestion[];
}

export interface TopicAssessmentData {
    topic?: any;
    items?: TopicAssessment[];
    total?: number;
}

export interface QuizSubmissionPayload {
    answers: Array<{
        questionId: string;
        selectedOptionId?: string;
        selectedOptionKeys?: string[];
        selectedOptionIds?: string[];
        textAnswer?: string;
    }>;
}

export interface QuizAttemptAnswer {
    questionId: string;
    questionPrompt?: string;
    questionType?: string;
    selectedOptionKeys?: string[];
    textAnswer?: string;
    isCorrect?: boolean;
    awardedScore?: number;
    maxScore?: number;
    gradingStatus?: string;
    teacherRemark?: string;
}

export interface QuizAttemptResult {
    id: string;
    childProfileId?: string;
    assessmentId?: string;
    assessmentTitle?: string;
    status?: string;
    totalQuestions?: number;
    scoreEarned?: number;
    maxScore?: number;
    percentageScore?: number;
    submittedAt?: string;
    gradedAt?: string;
    answers?: QuizAttemptAnswer[];
}

export interface QuizSubmissionResponseData {
    assessment?: TopicAssessment;
    attempt?: QuizAttemptResult;
}

export const contentApi = {
    // Analytics overview for child profile
    getChildAnalytics: (profileId: string) =>
        apiClient.get<{ message: string; data: AnalyticsOverview }>(
            `/child-profiles/${profileId}/analytics/overview`
        ),

    // Subjects available for child profile
    getChildSubjects: (profileId: string) =>
        apiClient.get<{ message: string; data: SubjectItem[] | { items: SubjectItem[]; total: number } }>(
            `/content/child-profiles/${profileId}/subjects`
        ),

    // Subjects in a class (fallback)
    getClassSubjects: (classId: string) =>
        apiClient.get<{ message: string; data: SubjectItem[] | { items: SubjectItem[]; total: number } }>(
            `/content/classes/${classId}/subjects`
        ),

    // Topics for a subject under a child profile (Student Endpoint)
    getSubjectTopics: (profileId: string, subjectId: string) =>
        apiClient.get<{ message: string; data: TopicItem[] | { items: TopicItem[]; total: number } }>(
            `/content/child-profiles/${profileId}/subjects/${subjectId}/topics`
        ),

    // Public/general topics for a subject (Fallback)
    getTopicsBySubject: (subjectId: string) =>
        apiClient.get<{ message: string; data: TopicItem[] | { items: TopicItem[]; total: number } }>(
            `/content/subjects/${subjectId}/topics`
        ),

    // Videos for a topic under a child profile (Student Endpoint)
    getTopicVideos: (profileId: string, topicId: string) =>
        apiClient.get<{ message: string; data: TopicVideo[] | { items: TopicVideo[]; total: number } }>(
            `/content/child-profiles/${profileId}/topics/${topicId}/videos`
        ),

    // Get video playback URL / Mux ID for student child profile
    getVideoPlayback: (profileId: string, videoId: string) =>
        apiClient.post<{ message: string; data: VideoPlaybackResponseData }>(
            `/content/child-profiles/${profileId}/videos/${videoId}/playback`
        ),

    // Video progress tracking for student child profile
    getVideoProgress: (profileId: string, videoId: string) =>
        apiClient.get<{ message: string; data: { progressSeconds: number; duration: number; isCompleted: boolean } }>(
            `/content/child-profiles/${profileId}/videos/${videoId}/progress`
        ),

    updateVideoProgress: (profileId: string, videoId: string, data: { lastPositionSeconds: number; durationSeconds?: number; event?: string; isPlaying?: boolean }) =>
        apiClient.post<{ message: string; data: any }>(
            `/content/child-profiles/${profileId}/videos/${videoId}/progress`,
            data
        ),

    markVideoComplete: (profileId: string, videoId: string) =>
        apiClient.post<{ message: string; data: any }>(
            `/content/child-profiles/${profileId}/videos/${videoId}/complete`
        ),

    // Notes metadata for a topic
    getTopicNotes: (profileId: string, topicId: string) =>
        apiClient.get<{ message: string; data: TopicNotesData }>(
            `/content/child-profiles/${profileId}/topics/${topicId}/notes`
        ),

    getTopicNotesDownload: (profileId: string, topicId: string) =>
        apiClient.post<{ message: string; data: { downloadUrl: string } }>(
            `/content/child-profiles/${profileId}/topics/${topicId}/notes/download`
        ),

    // Worksheet metadata for a topic
    getTopicWorksheet: (profileId: string, topicId: string) =>
        apiClient.get<{ message: string; data: TopicWorksheetData }>(
            `/content/child-profiles/${profileId}/topics/${topicId}/worksheet`
        ),

    getTopicWorksheetDownload: (profileId: string, topicId: string, format: 'pdf' | 'word' = 'pdf') =>
        apiClient.post<{ message: string; data: { downloadUrl: string } }>(
            `/content/child-profiles/${profileId}/topics/${topicId}/worksheet/download`,
            { format }
        ),

    // Assessments / Quizzes for a topic
    getTopicAssessments: (profileId: string, topicId: string) =>
        apiClient.get<{ message: string; data: TopicAssessmentData | TopicAssessment[] }>(
            `/content/child-profiles/${profileId}/topics/${topicId}/assessments`
        ),

    submitAssessmentAttempt: (profileId: string, assessmentId: string, payload: QuizSubmissionPayload) =>
        apiClient.post<{ message: string; data: QuizSubmissionResponseData }>(
            `/content/child-profiles/${profileId}/assessments/${assessmentId}/attempts`,
            payload
        ),
};
