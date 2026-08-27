'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Check, User, Sparkles, AlertCircle } from 'lucide-react';
import { schoolStructureApi, AcademicLevel, SchoolClass } from '@/lib/api/school-structure';
import { authApi } from '@/lib/api/auth';

// Curated Vibrant Color Themes per Level (matching mobile app screenshot)
const CARD_THEMES: Record<string, { bg: string; text: string }> = {
    'early-years': {
        bg: 'bg-gradient-to-b from-[#FF5500] to-[#D84300]',
        text: 'text-white',
    },
    nursery: {
        bg: 'bg-gradient-to-b from-[#4A154B] to-[#2D0C2E]',
        text: 'text-white',
    },
    primary: {
        bg: 'bg-gradient-to-b from-[#F89667] to-[#DF7A49]',
        text: 'text-white',
    },
    'junior-secondary': {
        bg: 'bg-gradient-to-b from-[#C796D5] to-[#A970B9]',
        text: 'text-white',
    },
    'senior-secondary': {
        bg: 'bg-gradient-to-b from-[#38BDF8] to-[#0284C7]',
        text: 'text-white',
    },
    'pre-college': {
        bg: 'bg-gradient-to-b from-[#FFB5C5] to-[#E88A9E]',
        text: 'text-[#5C0A1E]',
    },
    default: {
        bg: 'bg-gradient-to-b from-[#26203B] to-[#171324]',
        text: 'text-white',
    },
};

export default function ChildSetupForm() {
    const router = useRouter();

    // Form State
    const [childName, setChildName] = useState('');
    const [selectedLevelId, setSelectedLevelId] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [mobileStep, setMobileStep] = useState<1 | 2>(1);

    // API Data State
    const [levels, setLevels] = useState<AcademicLevel[]>([]);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

    // Loading & Error State
    const [isFetchingLevels, setIsFetchingLevels] = useState(true);
    const [isFetchingClasses, setIsFetchingClasses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch levels on mount
    useEffect(() => {
        async function loadLevels() {
            setIsFetchingLevels(true);
            try {
                const res = await schoolStructureApi.getLevels();
                let items: AcademicLevel[] = [];

                if (Array.isArray(res.data)) {
                    items = res.data;
                } else if (res.data && Array.isArray((res.data as any).items)) {
                    items = (res.data as any).items;
                }

                if (items.length > 0) {
                    items.sort((a, b) => (a.order || 0) - (b.order || 0));
                    setLevels(items);
                }
            } catch (err) {
                console.warn('Could not fetch academic levels from API:', err);
            } finally {
                setIsFetchingLevels(false);
            }
        }

        loadLevels();
    }, []);

    // Update classes when selected level changes
    useEffect(() => {
        if (!selectedLevelId) {
            setClasses([]);
            setSelectedClassId('');
            return;
        }

        const currentLevel = levels.find(
            (l) => (l.id || l._id) === selectedLevelId
        );

        if (currentLevel?.classes && Array.isArray(currentLevel.classes) && currentLevel.classes.length > 0) {
            const sortedClasses = [...currentLevel.classes].sort((a, b) => (a.order || 0) - (b.order || 0));
            setClasses(sortedClasses);
            setSelectedClassId('');
            return;
        }

        async function loadClasses() {
            setIsFetchingClasses(true);
            setClasses([]);
            setSelectedClassId('');

            try {
                const res = await schoolStructureApi.getClassesByLevel(selectedLevelId);
                let classItems: SchoolClass[] = [];

                if (Array.isArray(res.data)) {
                    classItems = res.data;
                } else if (res.data && Array.isArray((res.data as any).items)) {
                    classItems = (res.data as any).items;
                }

                classItems.sort((a, b) => (a.order || 0) - (b.order || 0));
                setClasses(classItems);
            } catch (err) {
                console.warn('Could not fetch classes for level from API:', err);
                setClasses([]);
            } finally {
                setIsFetchingClasses(false);
            }
        }

        loadClasses();
    }, [selectedLevelId, levels]);

    const handleImageError = (levelId: string) => {
        setFailedImages((prev) => ({ ...prev, [levelId]: true }));
    };

    const getTheme = (slug?: string, name?: string) => {
        const key = (slug || name || '').toLowerCase().replace(/\s+/g, '-');
        for (const themeKey of Object.keys(CARD_THEMES)) {
            if (key.includes(themeKey)) return CARD_THEMES[themeKey];
        }
        return CARD_THEMES.default;
    };

    const selectedLevel = levels.find((l) => (l.id || l._id) === selectedLevelId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!childName.trim()) {
            setErrorMessage("Please enter your child's name.");
            setMobileStep(1);
            return;
        }

        if (!selectedLevelId) {
            setErrorMessage('Please select an academic level.');
            setMobileStep(1);
            return;
        }

        if (classes.length > 0 && !selectedClassId) {
            setErrorMessage('Please select a class/grade.');
            setMobileStep(2);
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: any = {
                name: childName.trim(),
                currentLevelId: selectedLevelId,
                levelId: selectedLevelId,
            };

            if (selectedClassId) {
                payload.currentClassId = selectedClassId;
                payload.classId = selectedClassId;
            }

            const createRes = await schoolStructureApi.createChildProfile(payload);
            const childProfileId =
                createRes.data?.childProfile?.id || (createRes.data?.childProfile as any)?._id;

            if (childProfileId) {
                await schoolStructureApi.setActiveChild(childProfileId).catch((err) => {
                    console.warn('Failed to set active child profile:', err);
                });

                if (typeof window !== 'undefined') {
                    localStorage.setItem(
                        'lesson360_active_child',
                        JSON.stringify({
                            id: childProfileId,
                            childProfileId: childProfileId,
                            name: childName.trim(),
                            childName: childName.trim(),
                            levelId: selectedLevelId,
                            classId: selectedClassId,
                        })
                    );
                }
            }

            const profileRes = await authApi.getProfile().catch(() => null);
            const nextScreen =
                (profileRes as any)?.data?.progress?.screen ||
                createRes.data?.childProfile?.nextScreen ||
                'subscription_plans';

            switch (nextScreen) {
                case 'subscription_plans':
                    router.push('/onboarding/plans');
                    break;
                case 'payment':
                    router.push('/onboarding/checkout');
                    break;
                case 'kindly_take_quiz':
                    router.push('/onboarding/diagnostic');
                    break;
                case 'home':
                default:
                    router.push('/onboarding/plans');
                    break;
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                'Failed to save child profile. Please try again.';
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-white p-5 sm:p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-md">
            {/* Mobile Progress Bar (< lg) */}
            <div className="block lg:hidden mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                    <span className="text-brand-orange uppercase tracking-wider">
                        Step {mobileStep} of 2
                    </span>
                    <span>
                        {mobileStep === 1 ? 'Child & Level' : 'Select Class'}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-orange transition-all duration-300 rounded-full"
                        style={{ width: mobileStep === 1 ? '50%' : '100%' }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Column (Desktop lg:col-span-5): Learner Details & Class Selector */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">

                    {/* Header Info (Visible always on Desktop, and on Mobile Step 1 & Step 2) */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-peach text-brand-orange text-xs font-bold">
                            <Sparkles className="w-4 h-4" />
                            <span>Learner Profile Setup</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Tell us about your child
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed hidden lg:block">
                            Enter your child&apos;s name and select their school level from the cards to personalize their learning subjects and quizzes.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Input 1: Child Name (Visible on Desktop always, on Mobile in Step 1) */}
                    <div className={`space-y-2 ${mobileStep === 1 ? 'block' : 'hidden lg:block'}`}>
                        <label className="block text-sm font-bold text-gray-800">
                            Child&apos;s Full Name <span className="text-brand-orange">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={childName}
                                onChange={(e) => setChildName(e.target.value)}
                                placeholder="e.g. Chidinma"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-medium text-sm shadow-xs"
                            />
                        </div>
                    </div>

                    {/* Mobile Step 2 Back Button & Selected Summary Card */}
                    <div className={`space-y-4 ${mobileStep === 2 ? 'block lg:hidden' : 'hidden'}`}>
                        <button
                            type="button"
                            onClick={() => setMobileStep(1)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-orange transition-colors"
                        >
                            <span>← Back to Child Name & Level</span>
                        </button>

                        <div className="p-4 rounded-2xl bg-brand-peach/30 border border-brand-orange/20 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-xs text-gray-500 font-medium">Selected Child & Level</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {childName || 'Child'} • <span className="text-brand-orange">{selectedLevel?.name || 'Level'}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileStep(1)}
                                className="text-xs font-bold text-brand-orange hover:underline"
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* Input 2: Class/Grade Selection (Visible on Desktop when level selected, and on Mobile in Step 2) */}
                    {(selectedLevelId || mobileStep === 2) && (
                        <div className={`space-y-3 pt-2 border-t border-gray-100 ${mobileStep === 2 ? 'block' : 'hidden lg:block'}`}>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-bold text-gray-800">
                                    Select Class / Grade <span className="text-brand-orange">*</span>
                                </label>
                                {classes.length > 0 && (
                                    <span className="text-xs font-medium text-gray-500">
                                        {classes.length} classes
                                    </span>
                                )}
                            </div>

                            {isFetchingClasses ? (
                                <div className="py-3 flex items-center gap-2 text-sm text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                                    <span>Fetching grade options...</span>
                                </div>
                            ) : classes.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                                    {classes.map((cls) => {
                                        const clsId = cls.id || cls._id || '';
                                        const isSelected = selectedClassId === clsId;
                                        return (
                                            <button
                                                key={clsId}
                                                type="button"
                                                onClick={() => setSelectedClassId(clsId)}
                                                className={`p-2.5 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${isSelected
                                                    ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-brand-orange/50 hover:bg-brand-peach/20'
                                                    }`}
                                            >
                                                {cls.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">
                                    No specific sub-classes listed for this level. You can proceed!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Primary Desktop Submit Button (Hidden on Mobile) */}
                    <div className="pt-2 hidden lg:block">
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !childName.trim() ||
                                !selectedLevelId ||
                                (classes.length > 0 && !selectedClassId)
                            }
                            className="w-full py-4 px-6 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save & Continue</span>
                            )}
                        </button>
                    </div>

                </div>

                {/* Right Column (Desktop lg:col-span-7 / Mobile Step 1): Academic Level Cards Grid */}
                <div className={`lg:col-span-7 space-y-4 ${mobileStep === 1 ? 'block' : 'hidden lg:block'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <label className="block text-sm font-bold text-gray-800">
                            Select Your Child&apos;s Academic Level <span className="text-brand-orange">*</span>
                        </label>
                        {levels.length > 0 && (
                            <span className="text-xs font-medium text-gray-500">
                                {levels.length} levels available
                            </span>
                        )}
                    </div>

                    {isFetchingLevels ? (
                        <div className="py-16 flex items-center justify-center gap-3 text-sm text-gray-500">
                            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                            <span>Loading academic levels...</span>
                        </div>
                    ) : levels.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-500">
                            No academic levels available at the moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {levels.map((lvl) => {
                                const lvlId = lvl.id || lvl._id || '';
                                const isSelected = selectedLevelId === lvlId;
                                const theme = getTheme(lvl.slug, lvl.name);
                                const rawUrl = lvl.imageAccessUrl || lvl.imageUrl;
                                const hasFailedImage = failedImages[lvlId] || !rawUrl;
                                const imageSrc = hasFailedImage ? '/fallback-image.png' : rawUrl;

                                let ageLabel = '';
                                if (lvl.ageRange?.min && lvl.ageRange?.max) {
                                    if (lvl.ageRange.max >= 18) {
                                        ageLabel = `${lvl.ageRange.min} And Above`;
                                    } else {
                                        ageLabel = `${lvl.ageRange.min} - ${lvl.ageRange.max} Years`;
                                    }
                                } else if (lvl.description) {
                                    ageLabel = lvl.description;
                                }

                                return (
                                    <button
                                        key={lvlId}
                                        type="button"
                                        onClick={() => setSelectedLevelId(lvlId)}
                                        className={`relative w-full h-60 sm:h-64 rounded-3xl ${theme.bg} ${theme.text} p-3.5 flex flex-col justify-between text-center transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-1 overflow-hidden cursor-pointer ${isSelected
                                            ? 'ring-4 ring-brand-orange ring-offset-2 scale-[1.02] shadow-2xl z-10'
                                            : 'opacity-95 hover:opacity-100'
                                            }`}
                                    >
                                        {/* Checkmark Badge */}
                                        {isSelected && (
                                            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white text-brand-orange flex items-center justify-center shadow-md z-20">
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </div>
                                        )}

                                        {/* Level Image with Fallback */}
                                        <div className="relative flex-1 w-full flex items-center justify-center p-1 min-h-0">
                                            <div className="relative w-full h-full max-h-[130px] sm:max-h-[145px] flex items-center justify-center">
                                                <img
                                                    src={imageSrc}
                                                    alt={lvl.name}
                                                    onError={() => handleImageError(lvlId)}
                                                    className="max-h-full max-w-full object-contain drop-shadow-md rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        {/* Bottom Title & Age Label */}
                                        <div className="pt-1.5 pb-0.5 space-y-0.5">
                                            <h3 className="text-base sm:text-lg font-bold font-comic leading-tight tracking-tight drop-shadow-xs">
                                                {lvl.name}
                                            </h3>
                                            {ageLabel && (
                                                <p className="text-[11px] font-semibold opacity-90 tracking-wide">
                                                    {ageLabel}
                                                </p>
                                            )}
                                        </div>

                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Mobile Step 1 Next Button */}
                    <div className="pt-4 block lg:hidden">
                        <button
                            type="button"
                            onClick={() => {
                                if (classes.length > 0) {
                                    setMobileStep(2);
                                } else {
                                    // Submit directly if level has no sub-classes
                                    const formEl = document.querySelector('form');
                                    if (formEl) formEl.requestSubmit();
                                }
                            }}
                            disabled={!childName.trim() || !selectedLevelId}
                            className="w-full py-4 px-6 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span>{classes.length > 0 ? 'Next: Select Class →' : 'Save & Continue'}</span>
                        </button>
                    </div>

                </div>

                {/* Mobile Step 2 Final Submit Button */}
                <div className={`pt-2 block lg:hidden col-span-full ${mobileStep === 2 ? 'block' : 'hidden'}`}>
                    <button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            !childName.trim() ||
                            !selectedLevelId ||
                            (classes.length > 0 && !selectedClassId)
                        }
                        className="w-full py-4 px-6 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Save & Continue</span>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
