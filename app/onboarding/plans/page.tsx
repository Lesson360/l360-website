import React from 'react';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import SubscriptionPlans from '@/components/onboarding/SubscriptionPlans';

export default function PlansPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <OnboardingHeader currentStep={2} totalSteps={3} stepTitle="Choose Plan" />

            <main className="flex-1 py-4 sm:py-12 px-3 sm:px-6 flex items-start sm:items-center justify-center">
                <SubscriptionPlans />
            </main>
        </div>
    );
}
