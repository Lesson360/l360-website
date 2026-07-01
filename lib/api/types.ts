// Base response types
export interface ApiResponse<T = any> {
    message?: string;
    data?: T;
    items?: T[];
    total?: number;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    referralCode?: string;
}

export interface AdminRegisterCredentials {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
}

export interface User {
    id: string;
    email: string;
    phoneNumber: string;
    role: 'admin' | 'teacher' | 'student' | 'affiliate';
    firstName?: string;
    lastName?: string;
    fullName?: string;
    status?: string;
    phoneVerified?: boolean;
    onboardingCompleted?: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
    progress?: {
        flow: string;
        screen: string;
        status: string;
        meta: any;
        updatedAt: string;
        shouldResume: boolean;
    };
}

export interface OTPVerification {
    phoneNumber: string;
    otp: string;
}

export interface ForgotPasswordRequest {
    phoneNumber: string;
    channel?: 'sms' | 'email';
}

export interface ResetPasswordRequest {
    resetToken: string;
    password: string;
    confirmPassword: string;
}

// Affiliate types
export interface AffiliateRegisterCredentials {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface Affiliate {
    id: string;
    email: string;
    fullName?: string;
    affiliateCode: string;
}

// Referral types
export interface ReferralValidationResponse {
    valid: boolean;
    referrerType: string;
    referrerName: string;
}