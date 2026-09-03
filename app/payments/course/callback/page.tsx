import React, { Suspense } from 'react';
import { Loader2, BookOpen } from 'lucide-react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';

function CourseCallbackLoadingFallback() {
    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verifying Course Payment...</h2>
            <p className="text-sm text-gray-500">Please wait while we activate your standalone course access.</p>
        </div>
    );
}

export default function CoursePaymentCallbackPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <OnboardingHeader currentStep={2} totalSteps={3} stepTitle="Course Payment Verification" />

            <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
                <Suspense fallback={<CourseCallbackLoadingFallback />}>
                    <div className="w-full max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-md text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Standalone Course Callback</h2>
                        <p className="text-sm text-gray-500">
                            Course payment verification callback ready for standalone course checkout.
                        </p>
                    </div>
                </Suspense>
            </main>
        </div>
    );
}
