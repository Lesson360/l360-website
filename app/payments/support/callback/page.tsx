import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import SupportPaymentCallback from '@/components/payments/SupportPaymentCallback';

function CallbackLoadingFallback() {
    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-peach/50 text-brand-orange flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verifying Support Payment...</h2>
            <p className="text-sm text-gray-500">Please wait while we confirm your support service enrollment.</p>
        </div>
    );
}

export default function SupportPaymentCallbackPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <OnboardingHeader currentStep={2} totalSteps={3} stepTitle="Support Service Payment Verification" />

            <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
                <Suspense fallback={<CallbackLoadingFallback />}>
                    <SupportPaymentCallback />
                </Suspense>
            </main>
        </div>
    );
}
