'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, User, Mail, AlertCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { schoolStructureApi, AcademicLevel, SchoolClass } from '@/lib/api/school-structure';
import { authApi } from '@/lib/api/auth';
import { CountryCodeSelect, COUNTRY_CODES, CountryCode } from '@/components/auth/CountryCodeSelect';

// Curated Vibrant Color Themes per Level (matching design system)
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

    // Setup Step: 1 (Child Name, Email, Phone) -> 2 (Select Level & Class)
    const [step, setStep] = useState<1 | 2>(1);

    // Form Fields - Step 1
    const [childName, setChildName] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // Default Nigeria (+234)
    const [parentPhone, setParentPhone] = useState('');
    const [createdChildId, setCreatedChildId] = useState<string>('');

    // Form Fields - Step 2
    const [selectedLevelId, setSelectedLevelId] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<string>('');

    // API Data State
    const [levels, setLevels] = useState<AcademicLevel[]>([]);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

    // Loading & Error State
    const [isInitializing, setIsInitializing] = useState(true);
    const [isFetchingClasses, setIsFetchingClasses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch user profile to prefill email/phone & fetch academic levels on mount
    useEffect(() => {
        async function initData() {
            setIsInitializing(true);
            try {
                // 1. Fetch user profile for prefill
                const profileRes = await authApi.getProfile().catch(() => null);
                if (profileRes?.data) {
                    const userObj = profileRes.data.user || profileRes.data;
                    if (userObj.email) setParentEmail(userObj.email);

                    const userPhoneVal = userObj.phone || userObj.phoneNumber || userObj.phone_number || '';
                    if (userPhoneVal) {
                        // Match country code if phone starts with dial code
                        const matchedCode = COUNTRY_CODES.find(c => userPhoneVal.startsWith(c.dialCode));
                        if (matchedCode) {
                            setSelectedCountry(matchedCode);
                            setParentPhone(userPhoneVal.replace(matchedCode.dialCode, '').replace(/\D/g, ''));
                        } else {
                            setParentPhone(userPhoneVal.replace(/\D/g, ''));
                        }
                    }

                    // Check if an active child already exists
                    const activeChild = (profileRes.data as any)?.activeChild || userObj.activeChild;
                    if (activeChild) {
                        const cId = activeChild.id || activeChild._id;
                        if (cId) setCreatedChildId(cId);
                        if (activeChild.name || activeChild.childName) {
                            setChildName(activeChild.name || activeChild.childName);
                        }
                        if (activeChild.currentLevelId || activeChild.levelId) {
                            setSelectedLevelId(activeChild.currentLevelId || activeChild.levelId);
                        }
                        if (activeChild.currentClassId || activeChild.classId) {
                            setSelectedClassId(activeChild.currentClassId || activeChild.classId);
                        }
                    }
                }

                // 2. Load academic levels
                const levelsRes = await schoolStructureApi.getLevels();
                let items: AcademicLevel[] = [];

                if (Array.isArray(levelsRes.data)) {
                    items = levelsRes.data;
                } else if (levelsRes.data && Array.isArray((levelsRes.data as any).items)) {
                    items = (levelsRes.data as any).items;
                }

                if (items.length > 0) {
                    items.sort((a, b) => (a.order || 0) - (b.order || 0));
                    setLevels(items);
                }
            } catch (err) {
                console.warn('Could not initialize child setup data:', err);
            } finally {
                setIsInitializing(false);
            }
        }

        initData();
    }, []);

    // Update classes list when selected level changes
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
                console.warn('Could not fetch classes for level:', err);
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

    // STEP 1 SUBMIT: Update Parent Profile with contact info & proceed to Step 2 screen
    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!childName.trim()) {
            setErrorMessage("Please enter your child's name.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Update parent profile with signup method provided (email or phone)
            const fullPhone = parentPhone.trim() ? `${selectedCountry.dialCode}${parentPhone.trim()}` : '';
            const updatePayload: Record<string, string> = {};
            if (parentEmail.trim()) updatePayload.email = parentEmail.trim();
            if (fullPhone) {
                updatePayload.phone = fullPhone;
                updatePayload.phoneNumber = fullPhone;
            }

            if (Object.keys(updatePayload).length > 0) {
                await authApi.updateProfile(updatePayload).catch((err) => {
                    console.warn('Parent profile update response:', err);
                });
            }

            // Advance to Step 2 screen (Select Level & Class)
            setStep(2);
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                'Failed to save details. Please try again.';
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // STEP 2 SUBMIT: Save Selected Academic Level & Class and navigate to next onboarding screen
    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!selectedLevelId) {
            setErrorMessage('Please select an academic level for your child.');
            return;
        }

        if (classes.length > 0 && !selectedClassId) {
            setErrorMessage('Please select a class / grade.');
            return;
        }

        setIsSubmitting(true);

        try {
            const updatePayload: any = {
                name: childName.trim(),
                currentLevelId: selectedLevelId,
                levelId: selectedLevelId,
            };

            if (selectedClassId) {
                updatePayload.currentClassId = selectedClassId;
                updatePayload.classId = selectedClassId;
            }

            // Create or update child profile with level & class
            let targetChildId = createdChildId;

            if (!targetChildId) {
                const createRes = await schoolStructureApi.createChildProfile(updatePayload);
                targetChildId =
                    createRes.data?.childProfile?.id ||
                    (createRes.data?.childProfile as any)?._id ||
                    createRes.data?.id ||
                    (createRes.data as any)?._id;
            } else {
                await schoolStructureApi.updateChildProfile(targetChildId, updatePayload).catch((err) => {
                    console.warn('Could not update child profile level via patch, fallback to create profile:', err);
                    return schoolStructureApi.createChildProfile(updatePayload);
                });
            }

            if (targetChildId) {
                setCreatedChildId(targetChildId);

                // Set active child profile
                await schoolStructureApi.setActiveChild(targetChildId).catch((err) => {
                    console.warn('Failed to set active child profile:', err);
                });

                // Update active child cache
                if (typeof window !== 'undefined') {
                    localStorage.setItem(
                        'lesson360_active_child',
                        JSON.stringify({
                            id: targetChildId,
                            childProfileId: targetChildId,
                            name: childName.trim(),
                            childName: childName.trim(),
                            levelId: selectedLevelId,
                            classId: selectedClassId,
                        })
                    );
                }
            }

            // Check next screen from profile progress
            const profileRes = await authApi.getProfile().catch(() => null);
            const nextScreen =
                (profileRes as any)?.data?.progress?.screen || 'subscription_plans';

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
                'Failed to complete child setup. Please try again.';
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isInitializing) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white p-12 rounded-3xl border border-gray-100 shadow-md text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
                <p className="text-gray-500 font-medium text-sm">
                    Loading your setup details...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-md space-y-8">

            {/* Stepper Header Indicator */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-brand-orange text-white' : 'bg-emerald-500 text-white'}`}>
                        {step === 1 ? '1' : <Check className="w-4 h-4 stroke-[3]" />}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                        Step 1: Parent & Child Info
                    </span>
                </div>

                <div className="w-12 sm:w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-orange transition-all duration-300 rounded-full"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
                        2
                    </span>
                    <span className={`text-xs sm:text-sm font-bold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                        Step 2: Level & Class
                    </span>
                </div>
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* SCREEN 1: STEP 1 - CHILD NAME & PARENT CONTACT FORM */}
            {step === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-peach text-brand-orange text-xs font-bold">
                            <Sparkles className="w-4 h-4" />
                            <span>Step 1 of 2</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Parent & Learner Profile
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                            Tell us your child&apos;s name and confirm your contact information to personalize their learning experience.
                        </p>
                    </div>

                    <div className="space-y-5 pt-2">

                        {/* Input 1: Child Name */}
                        <div className="space-y-2">
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
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-medium text-sm shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Input 2: Parent Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                Parent Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={parentEmail}
                                    onChange={(e) => setParentEmail(e.target.value)}
                                    placeholder="e.g. parent@example.com"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-medium text-sm shadow-xs"
                                />
                            </div>
                            <p className="text-[11px] text-gray-400">
                                Prefilled with your signup email. You can update it if needed.
                            </p>
                        </div>

                        {/* Input 3: Parent Phone */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                Phone Number
                            </label>
                            <div className="flex items-center rounded-2xl border border-gray-300 bg-white shadow-xs focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20 overflow-hidden">
                                <CountryCodeSelect
                                    selected={selectedCountry}
                                    onChange={setSelectedCountry}
                                    disabled={isSubmitting}
                                />
                                <input
                                    type="tel"
                                    disabled={isSubmitting}
                                    value={parentPhone}
                                    onChange={(e) => setParentPhone(e.target.value.replace(/\D/g, ''))}
                                    placeholder="801 234 5678"
                                    className="w-full py-3.5 px-3.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium"
                                />
                            </div>
                            <p className="text-[11px] text-gray-400">
                                Used for account security & SMS notifications.
                            </p>
                        </div>

                    </div>

                    {/* Step 1 Submit Button */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !childName.trim()}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving Child Profile...</span>
                                </>
                            ) : (
                                <>
                                    <span>Next: Select Level & Class</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* SCREEN 2: STEP 2 - SELECT LEVEL AND CLASS */}
            {step === 2 && (
                <form onSubmit={handleStep2Submit} className="space-y-8">
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-brand-orange transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Edit Child Name & Contact Info</span>
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                    Select Academic Level & Class
                                </h1>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Choose the grade level for <strong className="text-gray-900">{childName}</strong> to customize subjects and diagnostic tests.
                                </p>
                            </div>

                            <div className="px-4 py-2 rounded-2xl bg-brand-peach/30 border border-brand-orange/20 shrink-0">
                                <span className="text-xs font-bold text-brand-orange">
                                    Learner: {childName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Level Selection Cards */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-800">
                            Academic Level <span className="text-brand-orange">*</span>
                        </label>

                        {levels.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-500">
                                Loading academic levels...
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
                                            className={`relative w-full h-56 sm:h-64 rounded-3xl ${theme.bg} ${theme.text} p-3.5 flex flex-col justify-between text-center transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-1 overflow-hidden cursor-pointer ${isSelected
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

                                            {/* Level Image */}
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
                                                <h3 className="text-base sm:text-lg font-bold leading-tight tracking-tight drop-shadow-xs">
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
                    </div>

                    {/* Class / Grade Selection */}
                    {selectedLevelId && (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-bold text-gray-800">
                                    Select Class / Sub-Grade {classes.length > 0 && <span className="text-brand-orange">*</span>}
                                </label>
                                {classes.length > 0 && (
                                    <span className="text-xs font-medium text-gray-500">
                                        {classes.length} classes available
                                    </span>
                                )}
                            </div>

                            {isFetchingClasses ? (
                                <div className="py-4 flex items-center gap-2 text-sm text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                                    <span>Fetching classes...</span>
                                </div>
                            ) : classes.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                                    {classes.map((cls) => {
                                        const clsId = cls.id || cls._id || '';
                                        const isSelected = selectedClassId === clsId;
                                        return (
                                            <button
                                                key={clsId}
                                                type="button"
                                                onClick={() => setSelectedClassId(clsId)}
                                                className={`p-3 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${isSelected
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
                                <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-xl">
                                    No specific sub-classes listed for {selectedLevel?.name}. You can save and proceed directly!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 2 Submit Button */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !selectedLevelId ||
                                (classes.length > 0 && !selectedClassId)
                            }
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Completing Setup...</span>
                                </>
                            ) : (
                                <>
                                    <span>Save & Continue</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

        </div>
    );
}
