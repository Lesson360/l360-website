'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OnboardingHeaderProps {
    currentStep?: number;
    totalSteps?: number;
    stepTitle?: string;
}

export default function OnboardingHeader({
    currentStep = 1,
    totalSteps = 3,
    stepTitle = 'Child Setup',
}: OnboardingHeaderProps) {
    return (
        <header className="w-full bg-white border-b border-gray-100 py-3.5 px-4 sm:px-8 shadow-xs">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="inline-block">
                    <Image
                        src="/lesson360-logo.png"
                        alt="Lesson 360 Logo"
                        width={140}
                        height={35}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Progress Badge */}
                {totalSteps > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-900">{stepTitle}</span>
                            <span className="text-[11px] text-gray-500 font-medium">
                                Step {currentStep} of {totalSteps}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-brand-peach px-3 py-1.5 rounded-full border border-brand-orange/20">
                            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                            <span className="text-xs font-bold text-brand-orange">
                                Step {currentStep}/{totalSteps}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
