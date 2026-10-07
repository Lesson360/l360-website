'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 2) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <button
            onClick={handleBack}
            className="fixed top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-[100] flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-lg hover:bg-white transition-all duration-200 text-gray-700 hover:text-brand-orange active:scale-95 group"
            aria-label="Go back"
            title="Go Back"
        >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:-translate-x-1" />
        </button>
    );
}
