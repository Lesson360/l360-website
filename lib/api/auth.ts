import { apiClient } from './client';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  OTPVerification,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  Affiliate,
  ReferralValidationResponse,
} from './types';

export const authApi = {
  // Parent/Student Auth
  register: (data: RegisterCredentials) =>
    apiClient.post<{ message: string; data: { user: any; token: string } }>(
      '/auth/register',
      data
    ),

  verifyOTP: (data: OTPVerification) =>
    apiClient.post<{ message: string; data: { user: any; token: string } }>(
      '/auth/verify-otp',
      data
    ),

  login: (data: LoginCredentials) =>
    apiClient.post<{ message: string; data: AuthResponse }>(
      '/auth/login',
      data
    ),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<{ message: string }>(
      '/auth/forgot-password',
      data
    ),

  verifyResetOTP: (data: OTPVerification & { channel?: string }) =>
    apiClient.post<{ message: string; data: { resetToken: string } }>(
      '/auth/verify-reset-otp',
      data
    ),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<{ message: string }>(
      '/auth/reset-password',
      data
    ),

  getProfile: () =>
    apiClient.get<{ message: string; data: { user: any } }>(
      '/auth/me'
    ),

  updateProfile: (data: any) =>
    apiClient.patch<{ message: string; data: { user: any } }>(
      '/auth/profile',
      data
    ),

  resendOTP: (data: { phoneNumber: string; purpose: string; channel: string }) =>
    apiClient.post<{ message: string }>(
      '/auth/resend-otp',
      data
    ),

  affiliateVerifyEmail: (data: { email: string; otp: string }) =>
    apiClient.post<{ message: string }>(
      '/affiliate-auth/verify-email',
      data
    ),

  affiliateForgotPassword: (data: { email: string }) =>
    apiClient.post<{ message: string }>(
      '/affiliate-auth/forgot-password',
      data
    ),

  affiliateResetPassword: (data: { email: string; otp: string; newPassword: string; confirmPassword: string }) =>
    apiClient.post<{ message: string }>(
      '/affiliate-auth/reset-password',
      data
    ),

  affiliateGetProfile: () =>
    apiClient.get<{ message: string; data: { affiliate: Affiliate } }>(
      '/affiliate-auth/me'
    ),
};

// Referral API
export const referralApi = {
  validateCode: (referralCode: string) =>
    apiClient.post<{ message: string; data: ReferralValidationResponse }>(
      '/referrals/validate-code',
      { referralCode }
    ),
};