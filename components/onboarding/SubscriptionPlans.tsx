'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ShieldCheck, Check, Sparkles, X, Gift, CheckCircle } from 'lucide-react';
import { subscriptionsApi, SubscriptionPlan, TestDrillerProduct, PlanDescriptionObject } from '@/lib/api/subscriptions';
import { schoolStructureApi } from '@/lib/api/school-structure';
import { authApi } from '@/lib/api/auth';

// Homepage Card Themes per Billing Cycle / Plan Order
const CARD_THEMES = [
    {
        cardBg: 'bg-[#FDE4E6]',
        titleColor: 'text-[#FF4800]',
        priceColor: 'text-[#FF4800]',
        subtitleColor: 'text-[#FF4800]/70',
        dividerColor: 'border-[#FF4800]/20',
        textColor: 'text-[#1E1B3A]',
        buttonBg: 'bg-[#FF1E00] hover:bg-[#E01A00] text-white',
        badgeBg: 'bg-[#FF4800] text-white',
    },
    {
        cardBg: 'bg-[#3F114C]',
        titleColor: 'text-white',
        priceColor: 'text-white',
        subtitleColor: 'text-purple-200/80',
        dividerColor: 'border-white/20',
        textColor: 'text-white',
        buttonBg: 'bg-white hover:bg-gray-100 text-[#3F114C]',
        badgeBg: 'bg-purple-800 text-purple-100',
    },
    {
        cardBg: 'bg-[#FF4800]',
        titleColor: 'text-white',
        priceColor: 'text-white',
        subtitleColor: 'text-orange-100/80',
        dividerColor: 'border-white/20',
        textColor: 'text-white',
        buttonBg: 'bg-white hover:bg-gray-100 text-[#FF4800]',
        badgeBg: 'bg-white text-[#FF4800]',
    },
];

// Fallback TestDriller Products if API endpoint returns empty array
const DEFAULT_TEST_DRILLER_PRODUCTS: TestDrillerProduct[] = [
    { id: '6a8ebd63bac2be1a209407f0', name: 'BECE / Junior Secondary Exam Prep', description: 'Past questions, solutions & mock tests for JSS 1 - JSS 3.' },
    { id: '6a8c3bf39117ec00347ce914', name: 'SSCE / Senior Secondary Exam Prep', description: 'WAEC & NECO CBT practice questions and detailed solutions.' },
    { id: 'utme-jamb-prep', name: 'UTME / JAMB Exam Prep', description: 'Full CBT UTME exam simulation & speed drills.' },
];

// Fallback plans if API returns empty array
const FALLBACK_PLANS: SubscriptionPlan[] = [
    {
        id: 'monthly-plan',
        name: 'Monthly Learning',
        billingPeriod: 'monthly',
        priceAmount: 16000,
        currency: 'NGN',
        description: JSON.stringify({
            videos: true,
            worksheets: true,
            quizzes: true,
            notes: true,
            resources: true,
            textDescription: 'One month access for one child profile',
        }),
        includesTestDriller: true,
        includedTestDrillerProductIds: ['6a8ebd63bac2be1a209407f0', '6a8c3bf39117ec00347ce914'],
    },
    {
        id: 'termly-plan',
        name: 'Termly Learning',
        billingPeriod: 'termly',
        priceAmount: 40000,
        currency: 'NGN',
        description: JSON.stringify({
            videos: true,
            worksheets: true,
            quizzes: true,
            notes: true,
            resources: true,
            textDescription: 'One school term access for one child profile',
        }),
        includesTestDriller: false,
    },
    {
        id: 'school-year-plan',
        name: 'School Year Learning',
        billingPeriod: 'school_year',
        priceAmount: 100000,
        currency: 'NGN',
        description: JSON.stringify({
            videos: true,
            worksheets: true,
            quizzes: true,
            notes: true,
            resources: true,
            textDescription: 'Full school year access for one child profile',
        }),
        includesTestDriller: true,
        includedTestDrillerProductIds: ['6a8ebd63bac2be1a209407f0', '6a8c3bf39117ec00347ce914'],
    },
];

export default function SubscriptionPlans() {
    const router = useRouter();

    // Active Child Context State
    const [childProfileId, setChildProfileId] = useState<string>('');
    const [levelId, setLevelId] = useState<string>('');
    const [classId, setClassId] = useState<string>('');

    // Plans & TestDriller State
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [testDrillerProducts, setTestDrillerProducts] = useState<TestDrillerProduct[]>([]);

    // Modal State for TestDriller Package Selection
    const [activeModalPlan, setActiveModalPlan] = useState<SubscriptionPlan | null>(null);
    const [modalSelectedTdId, setModalSelectedTdId] = useState<string>('');

    const [selectedCycle, setSelectedCycle] = useState<string>('all');
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');

    // Loading & Error State
    const [isFetchingPlans, setIsFetchingPlans] = useState(true);
    const [isInitializing, setIsInitializing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Helper to safely extract String ID from string or populated Object {_id, id}
    const extractId = (val: any): string => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') return val._id || val.id || '';
        return '';
    };

    // Robust multi-source academic context resolver
    const resolveChildAndAcademicInfo = async () => {
        let resolvedChildId = childProfileId;
        let resolvedChildName = '';
        let resolvedLevelId = levelId;
        let resolvedClassId = classId;

        // 1. Check localStorage cache
        if (typeof window !== 'undefined') {
            const cachedStr = localStorage.getItem('lesson360_active_child');
            if (cachedStr) {
                try {
                    const cachedObj = JSON.parse(cachedStr);
                    if (!resolvedChildId) resolvedChildId = extractId(cachedObj.id || cachedObj._id || cachedObj.childProfileId);
                    if (!resolvedChildName) resolvedChildName = cachedObj.name || cachedObj.childName || '';
                    if (!resolvedLevelId) resolvedLevelId = extractId(cachedObj.levelId || cachedObj.currentLevelId);
                    if (!resolvedClassId) resolvedClassId = extractId(cachedObj.classId || cachedObj.currentClassId);
                } catch { }
            }
        }

        // 2. Fetch User Profile (GET /api/v1/auth/me)
        const profileRes = await authApi.getProfile().catch(() => null);
        const profileData = (profileRes as any)?.data;
        const userObj = profileData?.user || profileData;
        const activeChild =
            profileData?.activeChild ||
            userObj?.activeChild ||
            userObj?.childInfo ||
            (userObj?.childProfiles && userObj.childProfiles[0]) ||
            profileData?.progress?.meta?.childProfile;

        if (activeChild) {
            if (!resolvedChildId) resolvedChildId = extractId(activeChild.id) || extractId(activeChild._id);
            if (!resolvedChildName) resolvedChildName = activeChild.name || activeChild.childName || '';
            if (!resolvedLevelId) resolvedLevelId = extractId(activeChild.currentLevelId) || extractId(activeChild.levelId) || extractId(activeChild.level);
            if (!resolvedClassId) resolvedClassId = extractId(activeChild.currentClassId) || extractId(activeChild.classId) || extractId(activeChild.class);
        }

        // 3. Fallback to GET /api/v1/child-profiles
        if (!resolvedLevelId || !resolvedChildId) {
            const cpRes = await schoolStructureApi.getChildProfiles().catch(() => null);
            let cpList: any[] = [];
            if (Array.isArray(cpRes?.data)) {
                cpList = cpRes.data;
            } else if (Array.isArray((cpRes?.data as any)?.items)) {
                cpList = (cpRes?.data as any).items;
            }

            if (cpList.length > 0) {
                const firstChild = cpList[0];
                if (!resolvedChildId) resolvedChildId = extractId(firstChild.id) || extractId(firstChild._id);
                if (!resolvedChildName) resolvedChildName = firstChild.name || firstChild.childName || '';
                if (!resolvedLevelId) resolvedLevelId = extractId(firstChild.currentLevelId) || extractId(firstChild.levelId) || extractId(firstChild.level);
                if (!resolvedClassId) resolvedClassId = extractId(firstChild.currentClassId) || extractId(firstChild.classId) || extractId(firstChild.class);
            }
        }

        // 4. Ultimate Fallback: Fetch school structure levels if levelId is still missing
        if (!resolvedLevelId) {
            const levelsRes = await schoolStructureApi.getLevels().catch(() => null);
            let levelsList: any[] = [];
            if (Array.isArray(levelsRes?.data)) {
                levelsList = levelsRes.data;
            } else if (Array.isArray((levelsRes?.data as any)?.items)) {
                levelsList = (levelsRes?.data as any).items;
            }

            if (levelsList.length > 0) {
                resolvedLevelId = extractId(levelsList[0].id) || extractId(levelsList[0]._id);
                if (levelsList[0].classes && levelsList[0].classes.length > 0) {
                    resolvedClassId = extractId(levelsList[0].classes[0].id) || extractId(levelsList[0].classes[0]._id);
                }
            }
        }

        if (!resolvedChildName && userObj?.name) {
            resolvedChildName = userObj.name;
        }

        return {
            childProfileId: resolvedChildId,
            childName: resolvedChildName,
            levelId: resolvedLevelId,
            classId: resolvedClassId,
        };
    };

    // Load Active Child, Plans & TestDriller products on mount
    useEffect(() => {
        async function loadData() {
            setIsFetchingPlans(true);
            try {
                const academicInfo = await resolveChildAndAcademicInfo();
                if (academicInfo.childProfileId) setChildProfileId(academicInfo.childProfileId);
                if (academicInfo.levelId) setLevelId(academicInfo.levelId);
                if (academicInfo.classId) setClassId(academicInfo.classId);

                // Fetch Subscription Plans
                const plansRes = await subscriptionsApi.getPlans();
                let items: SubscriptionPlan[] = [];

                if (Array.isArray(plansRes.data)) {
                    items = plansRes.data;
                } else if (plansRes.data && Array.isArray((plansRes.data as any).items)) {
                    items = (plansRes.data as any).items;
                }

                if (items.length > 0) {
                    items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                    setPlans(items);
                } else {
                    setPlans(FALLBACK_PLANS);
                }

                // Fetch TestDriller Products
                const tdRes = await subscriptionsApi.getTestDrillerProducts().catch(() => null);
                let tdItems: TestDrillerProduct[] = [];
                if (tdRes?.data) {
                    if (Array.isArray(tdRes.data)) {
                        tdItems = tdRes.data;
                    } else if (Array.isArray((tdRes.data as any).items)) {
                        tdItems = (tdRes.data as any).items;
                    }
                }

                if (tdItems.length > 0) {
                    setTestDrillerProducts(tdItems);
                } else {
                    setTestDrillerProducts(DEFAULT_TEST_DRILLER_PRODUCTS);
                }
            } catch (err) {
                console.warn('Could not fetch subscription plans from API, using fallback data:', err);
                setPlans(FALLBACK_PLANS);
                setTestDrillerProducts(DEFAULT_TEST_DRILLER_PRODUCTS);
            } finally {
                setIsFetchingPlans(false);
            }
        }

        loadData();
    }, []);

    // Primary Subscribe Button Handler
    const handlePlanClick = (plan: SubscriptionPlan) => {
        setErrorMessage('');

        // If plan includes TestDriller, open selection modal first!
        if (plan.includesTestDriller) {
            setActiveModalPlan(plan);
            setModalSelectedTdId('');
        } else {
            // Trigger checkout directly for plans without TestDriller
            executeCheckout(plan, undefined);
        }
    };

    // Execute Checkout Payload API
    const executeCheckout = async (plan: SubscriptionPlan, selectedTdId?: string) => {
        const planId = plan.id || plan._id || '';
        setSelectedPlanId(planId);
        setIsInitializing(true);
        setErrorMessage('');

        try {
            // Ensure levelId, classId, childProfileId, childName are resolved synchronously/asynchronously
            const academicInfo = await resolveChildAndAcademicInfo();
            const activeChildId = academicInfo.childProfileId;
            const activeChildName = academicInfo.childName;
            const activeLevelId = academicInfo.levelId;
            const activeClassId = academicInfo.classId;

            const callbackUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/onboarding/checkout`
                : '/onboarding/checkout';

            const payload: any = {
                planId,
                provider: 'paystack',
                callbackUrl,
                metadata: {
                    source: 'web_onboarding',
                },
            };

            if (activeChildId) payload.childProfileId = activeChildId;
            if (activeChildName) payload.childName = activeChildName;
            if (!payload.childProfileId && !payload.childName) {
                payload.childName = 'Child';
            }

            if (activeLevelId) payload.levelId = activeLevelId;
            if (activeClassId) payload.classId = activeClassId;
            if (plan.includesTestDriller && selectedTdId) {
                payload.selectedTestDrillerProductId = selectedTdId;
            }

            // Endpoint: POST /api/v1/subscriptions/checkout
            const res = await subscriptionsApi.checkout(payload);

            const redirectUrl =
                res.data?.checkout?.authorizationUrl ||
                res.data?.checkout?.authorization_url ||
                res.data?.payment?.checkout?.authorizationUrl ||
                res.data?.payment?.checkout?.authorization_url ||
                res.data?.authorizationUrl ||
                res.data?.authorization_url;

            const paymentRef =
                res.data?.payment?.reference ||
                res.data?.checkout?.reference ||
                res.data?.reference;

            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else if (paymentRef) {
                router.push(`/onboarding/checkout?reference=${paymentRef}`);
            } else {
                setErrorMessage('Could not initialize payment checkout. Please try again.');
                setIsInitializing(false);
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                'Failed to start payment checkout. Please try again.';
            setErrorMessage(msg);
            setIsInitializing(false);
        }
    };

    const formatCurrency = (amount?: number, currency: string = 'NGN') => {
        if (typeof amount !== 'number') return '₦0';
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency === 'NGN' ? 'NGN' : 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const parseDescription = (desc?: string | PlanDescriptionObject): { text: string; details: PlanDescriptionObject } => {
        if (!desc) return { text: '', details: {} };
        if (typeof desc === 'object') return { text: desc.textDescription || '', details: desc };

        try {
            const parsed = JSON.parse(desc);
            if (typeof parsed === 'object') {
                return { text: parsed.textDescription || '', details: parsed };
            }
        } catch {
            // String format
        }
        return { text: String(desc), details: {} };
    };

    // Filter plans based on cycle tab
    const displayedPlans = selectedCycle === 'all'
        ? plans
        : plans.filter((p) => (p.billingPeriod || '').toLowerCase() === selectedCycle.toLowerCase());

    // Filter allowed TestDriller products for active modal plan
    const modalAvailableTdProducts = activeModalPlan && activeModalPlan.includedTestDrillerProductIds && activeModalPlan.includedTestDrillerProductIds.length > 0
        ? testDrillerProducts.filter((p) => {
            const pId = p.id || p._id;
            return pId && activeModalPlan.includedTestDrillerProductIds?.includes(pId);
        })
        : testDrillerProducts;

    const modalTdList = modalAvailableTdProducts.length > 0 ? modalAvailableTdProducts : testDrillerProducts;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-md relative">

            {/* Header matching homepage Pricing title style */}
            <div className="text-center space-y-3 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-comic text-[#FF4800] leading-tight">
                    Choose your plan
                </h2>
                <p className="hidden text-gray-500 text-sm sm:text-base font-comic">
                    Select the learning plan that best fits your child&apos;s academic journey.
                </p>

                {/* Cycle Filter Tabs */}
                <div className="pt-4 flex items-center justify-center">
                    <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
                        <button
                            type="button"
                            onClick={() => setSelectedCycle('all')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-comic font-bold transition-all cursor-pointer ${selectedCycle === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedCycle('monthly')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-comic font-bold transition-all cursor-pointer ${selectedCycle === 'monthly' ? 'bg-[#FF4800] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedCycle('termly')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-comic font-bold transition-all cursor-pointer ${selectedCycle === 'termly' ? 'bg-[#3F114C] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Termly
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedCycle('school_year')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-comic font-bold transition-all cursor-pointer ${selectedCycle === 'school_year' ? 'bg-[#FF4800] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            School Year
                        </button>
                    </div>
                </div>

            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2 max-w-2xl mx-auto">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* 3 Cards Grid matching Homepage Pricing.tsx */}
            {isFetchingPlans ? (
                <div className="py-16 flex items-center justify-center gap-3 text-sm text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                    <span>Loading subscription plans...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-2">
                    {displayedPlans.map((plan, index) => {
                        const planId = plan.id || plan._id || '';
                        const theme = CARD_THEMES[index % CARD_THEMES.length];
                        const { text: subText, details } = parseDescription(plan.description);
                        const priceVal = plan.priceAmount ?? plan.price ?? 0;
                        const isSelecting = isInitializing && selectedPlanId === planId;

                        // Billing label formatting
                        const periodKey = (plan.billingPeriod || '').toLowerCase();
                        const periodLabel =
                            periodKey === 'school_year' || periodKey === 'yearly'
                                ? 'School Year'
                                : periodKey === 'termly'
                                    ? 'School Term'
                                    : 'Monthly';

                        // Feature items built from API description JSON
                        const features = [
                            { name: 'Interactive Videos', value: details.videos !== false ? 'check' : 'cross', icon: '🎥', iconBg: 'bg-purple-100 text-purple-600' },
                            { name: 'Worksheets & Exercises', value: details.worksheets !== false ? 'check' : 'cross', icon: '📝', iconBg: 'bg-pink-100 text-pink-600' },
                            { name: 'Practice Quizzes', value: details.quizzes !== false ? 'check' : 'cross', icon: '📚', iconBg: 'bg-green-100 text-green-600' },
                            { name: 'Study Notes', value: details.notes !== false ? 'check' : 'cross', icon: '📈', iconBg: 'bg-blue-100 text-blue-600' },
                            { name: 'Learning Resources', value: details.resources !== false ? 'check' : 'cross', icon: '👤', iconBg: 'bg-amber-100 text-amber-600' },
                        ];

                        return (
                            <motion.div
                                key={planId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`${theme.cardBg} rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-lg relative border border-black/5`}
                            >
                                {/* Top Section */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <h3 className={`text-2xl sm:text-3xl font-comic font-normal ${theme.titleColor}`}>
                                            {plan.name || plan.title}
                                        </h3>
                                    </div>

                                    {/* Price & Billing Cycle Tag */}
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className={`text-3xl sm:text-4xl font-black font-comic tracking-tight ${theme.priceColor}`}>
                                            {formatCurrency(priceVal, plan.currency)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {plan.includesTestDriller && (
                                            <span className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-400 text-gray-900 uppercase tracking-wider shadow-xs">
                                                + Free TestDriller
                                            </span>
                                        )}
                                        {/* Cycle Tag */}
                                        <div className="bg-white/90 backdrop-blur-xs px-3 py-1 rounded-xl border border-gray-200/80 shadow-xs flex items-center gap-1">
                                            <span className="text-xs font-comic font-bold text-gray-800">
                                                {periodLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtitle / Description Text */}
                                    <p className={`text-xs font-light mb-6 min-h-[32px] ${theme.subtitleColor}`}>
                                        {subText || 'Complete access to curriculum & diagnostic testing for one child.'}
                                    </p>

                                    {/* Divider Line */}
                                    <div className={`w-full border-t ${theme.dividerColor} mb-6`} />

                                    {/* Features List */}
                                    <div className="space-y-4">
                                        {features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center justify-between text-xs sm:text-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${feature.iconBg}`}>
                                                        {feature.icon}
                                                    </div>
                                                    <span className={`font-comic font-light text-xs sm:text-sm ${theme.textColor}`}>
                                                        {feature.name}
                                                    </span>
                                                </div>

                                                <div>
                                                    {feature.value === 'check' ? (
                                                        <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-[10px] font-bold">
                                                            ✓
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-[10px] font-bold">
                                                            ✕
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>

                                {/* Bottom Subscribe Button */}
                                <div className="mt-8 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => handlePlanClick(plan)}
                                        disabled={isInitializing}
                                        className={`w-full py-3.5 px-6 rounded-2xl font-comic text-base sm:text-lg font-normal transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${theme.buttonBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isSelecting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Connecting...</span>
                                            </>
                                        ) : (
                                            <span>Subscribe Now</span>
                                        )}
                                    </button>
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Trust Footer */}
            <div className="border-t border-gray-100 pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-comic">
                <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Secured by Paystack</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#FF4800]" />
                    <span>Instant Activation & Diagnostic Test</span>
                </div>
            </div>

            {/* TestDriller Package Selection Modal / Bottom Drawer */}
            <AnimatePresence>
                {activeModalPlan && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6">

                        {/* Modal Backdrop overlay click */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0"
                            onClick={() => {
                                if (!isInitializing) {
                                    setActiveModalPlan(null);
                                    setModalSelectedTdId('');
                                }
                            }}
                        />

                        {/* Modal Content Drawer */}
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 z-10 space-y-6 overflow-hidden"
                        >

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (!isInitializing) {
                                        setActiveModalPlan(null);
                                        setModalSelectedTdId('');
                                    }
                                }}
                                disabled={isInitializing}
                                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Modal Header */}
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-comic">
                                    <Gift className="w-4 h-4 text-amber-600" />
                                    <span>Free Bonus Included</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-comic font-bold text-gray-900 leading-tight">
                                    Choose Your TestDriller Package
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 font-comic">
                                    Your selected plan (<strong className="text-gray-800">{activeModalPlan.name || activeModalPlan.title}</strong>) includes 1 free TestDriller prep package. Pick one for your child:
                                </p>
                            </div>

                            {/* Product Selection Options List */}
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {modalTdList.map((tdProd) => {
                                    const tdId = tdProd.id || tdProd._id || '';
                                    const isSelected = modalSelectedTdId === tdId;

                                    return (
                                        <div
                                            key={tdId}
                                            onClick={() => setModalSelectedTdId(tdId)}
                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${isSelected
                                                ? 'border-brand-orange bg-brand-peach/20 shadow-xs'
                                                : 'border-gray-200 bg-gray-50/50 hover:border-brand-orange/40 hover:bg-white'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${isSelected ? 'border-brand-orange bg-brand-orange text-white' : 'border-gray-300 bg-white'
                                                }`}>
                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>

                                            <div className="space-y-0.5 font-comic">
                                                <h4 className="text-sm font-bold text-gray-900">
                                                    {tdProd.name || tdProd.title}
                                                </h4>
                                                {tdProd.description && (
                                                    <p className="text-xs text-gray-500 font-light">
                                                        {tdProd.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 space-y-2">
                                <button
                                    type="button"
                                    disabled={!modalSelectedTdId || isInitializing}
                                    onClick={() => executeCheckout(activeModalPlan, modalSelectedTdId)}
                                    className="w-full py-4 px-6 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-comic font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isInitializing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Connecting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Confirm & Proceed</span>
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>

                        </motion.div>

                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
