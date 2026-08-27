import React from 'react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import ChildSetupForm from '@/components/onboarding/ChildSetupForm';

export default function ChildSetupPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <OnboardingHeader currentStep={1} totalSteps={3} stepTitle="Child Setup" />

            <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
                <ChildSetupForm />
            </main>
        </div>
    );
}
