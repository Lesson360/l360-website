export const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    AFFILIATE: 'affiliate',
} as const;

export const TEACHER_PERMISSIONS = [
    'manage_subject',
    'manage_topics',
    'manage_videos',
    'manage_notes',
    'manage_worksheets',
    'manage_assessments',
    'grade_assessments',
    'manage_live_classes',
] as const;

export const NOTIFICATION_TYPES = {
    NEW_ASSIGNMENT: 'new_assignment',
    DUE_SOON: 'due_soon',
    SUBMITTED: 'submitted',
    OVERDUE: 'overdue',
    ANNOUNCEMENT: 'announcement',
    SUBMISSION_RECEIVED: 'submission_received',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY_OTP: '/auth/verify-otp',
        FORGOT_PASSWORD: '/auth/forgot-password',
        VERIFY_RESET_OTP: '/auth/verify-reset-otp',
        RESET_PASSWORD: '/auth/reset-password',
        PROFILE: '/auth/profile',
        ME: '/auth/me',
        RESEND_OTP: '/auth/resend-otp',
    },
    AFFILIATE: {
        LOGIN: '/affiliate-auth/login',
        REGISTER: '/affiliate-auth/register',
        VERIFY_EMAIL: '/affiliate-auth/verify-email',
        FORGOT_PASSWORD: '/affiliate-auth/forgot-password',
        RESET_PASSWORD: '/affiliate-auth/reset-password',
        ME: '/affiliate-auth/me',
        DASHBOARD: '/affiliates/me/dashboard',
        ATTRIBUTIONS: '/affiliates/me/attributions',
        LEDGER: '/affiliates/me/ledger',
        PAYOUT_DETAILS: '/affiliates/me/payout-details',
        PAYOUT_REQUESTS: '/affiliates/me/payout-requests',
    },
    REFERRAL: {
        VALIDATE: '/referrals/validate-code',
        ME: '/referrals/me',
        ATTRIBUTIONS: '/referrals/me/attributions',
        LEDGER: '/referrals/me/ledger',
    },
    ADMIN: {
        BOOTSTRAP: '/admin/bootstrap',
        TEACHERS: '/teachers',
        TEACHER_CATALOG: '/teachers/catalog',
        LEVELS: '/school-structure/levels',
        CLASSES: '/school-structure/classes',
    },
    CONTENT: {
        SUBJECTS: '/content/classes/:classId/subjects',
        TOPICS: '/content/subjects/:subjectId/topics',
        VIDEOS: '/content/topics/:topicId/videos',
        WORKSHEET: '/content/topics/:topicId/worksheet',
        NOTES: '/content/topics/:topicId/notes',
        ASSESSMENTS: '/content/topics/:topicId/assessments',
    },
};