import React from 'react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import DiagnosticQuiz from '@/components/onboarding/DiagnosticQuiz';

export default function DiagnosticPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <OnboardingHeader currentStep={3} totalSteps={3} stepTitle="Diagnostic Quiz" />

            <main className="flex-1 py-4 sm:py-12 px-3 sm:px-6 flex items-start sm:items-center justify-center">
                <DiagnosticQuiz />
            </main>
        </div>
    );
}
