'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCurrency } from '@/lib/currency/CurrencyProvider';
import {
    testDrillerApi,
    ChildAccessResponse,
    ChildEntitlement,
    ExamType,
    SubjectItem,
    Paper,
    StartAttemptResponse,
    SubmitAttemptResponse,
    AttemptItem,
    TestDrillerProductCatalogItem
} from '@/lib/api/test-driller';

import { authApi } from '@/lib/api/auth';
import { schoolStructureApi } from '@/lib/api/school-structure';
import { useChildProfile } from '@/lib/context/ChildProfileContext';
import { SubjectExam } from '@/lib/data/practiceExamsData';
import {
    CbtAnswerMap,
    CbtQuestion,
    CbtResult,
    answersFromAttempt,
    fromPracticeSubject,
    fromSessionQuestions,
    resultFromApi,
    resultFromPracticeSubject,
    toAnswerPayload
} from '@/lib/practice-exam/cbt';

import { TestDrillerCatalog } from '@/components/practice-exam/TestDrillerCatalog';
import { PaperInstructions } from '@/components/practice-exam/PaperInstructions';
import { ExamSelectionGrid } from '@/components/practice-exam/ExamSelectionGrid';
import { CbtExamScreen } from '@/components/practice-exam/CbtExamScreen';
import { CbtResultSlip } from '@/components/practice-exam/CbtResultSlip';
import {
    Loader2,
    BookOpen,
    Calendar,
    ArrowLeft,
    ChevronRight
} from 'lucide-react';

// While an attempt is open, autosave at least this often (handoff: every 20-30 seconds).
const PERIODIC_SAVE_MS = 25000;

// Fallback only: if an entitlement has no examTypeIdsSnapshot (see below), match a product
// to the exam type(s) it covers by name/slug (e.g. "Jamb Combo" -> the "JAMB" exam type).
function matchExamTypesForProduct(product: TestDrillerProductCatalogItem, examTypes: ExamType[]): ExamType[] {
    const productKey = (product.slug || product.name || product.title || '').toLowerCase();
    if (!productKey) return [];
    return examTypes.filter((et) => {
        const etKey = (et.slug || et.name || '').toLowerCase();
        if (!etKey) return false;
        return productKey.includes(etKey) || etKey.includes(productKey.split(/[\s-]+/)[0]);
    });
}

// Restrict the year list to an entitlement's purchased year range, when it has one.
function filterYearsByEntitlement(years: number[], entitlement: ChildEntitlement | null): number[] {
    if (!entitlement || (entitlement.yearStartSnapshot == null && entitlement.yearEndSnapshot == null)) {
        return years;
    }
    const start = entitlement.yearStartSnapshot ?? -Infinity;
    const end = entitlement.yearEndSnapshot ?? Infinity;
    return years.filter((y) => y >= start && y <= end);
}

// Local-clock deadline from the server's remainingTimeSeconds (the device clock may be off,
// so expiresAt is only a fallback). null means the paper is untimed.
function deadlineFromAttempt(item: AttemptItem): number | null {
    if (item.remainingTimeSeconds != null) return Date.now() + item.remainingTimeSeconds * 1000;
    if (item.expiresAt) return Date.parse(item.expiresAt);
    return null;
}

type Stage = 'catalog' | 'filters' | 'papers' | 'instructions' | 'taking' | 'result';

export default function PracticeExamPage() {
    // Globally-selected child (from the dashboard-wide child switcher) — every page reacts to
    // this so switching a child on one page updates practice exam access/data as well.
    const { activeChild: contextActiveChild } = useChildProfile();
    const { chargeCurrency } = useCurrency();

    // 1. Child Profile & Access Context
    const [childProfileId, setChildProfileId] = useState<string>('');
    const [childName, setChildName] = useState<string>('');
    const [accessData, setAccessData] = useState<ChildAccessResponse | null>(null);
    const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);

    // 2. Product Catalogue (landing screen)
    const [stage, setStage] = useState<Stage>('catalog');
    const [catalogTab, setCatalogTab] = useState<'explore' | 'my-courses'>('explore');
    const [products, setProducts] = useState<TestDrillerProductCatalogItem[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
    const [checkingOutProductId, setCheckingOutProductId] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<TestDrillerProductCatalogItem | null>(null);
    // The specific entitlement/purchase behind the selected product — when it carries a
    // snapshot scope (examTypeIdsSnapshot/subjectIdsSnapshot/year range), we use it to
    // scope the filter screen precisely instead of the name/slug heuristic.
    const [selectedEntitlement, setSelectedEntitlement] = useState<ChildEntitlement | null>(null);

    // Purchased product IDs derived from the child's active Test Driller entitlements
    const purchasedProductIds = new Set(
        (accessData?.entitlements || [])
            .filter((e) => e.status === 'active')
            .map((e) => e.productId)
    );

    // 3. Filter Screen State (exam type -> year -> subject), scoped to the selected product
    const [examTypes, setExamTypes] = useState<ExamType[]>([]);
    const [productExamTypes, setProductExamTypes] = useState<ExamType[]>([]);
    const [selectedExamTypeId, setSelectedExamTypeId] = useState<string>('');

    const [apiSubjects, setApiSubjects] = useState<SubjectItem[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    const [papers, setPapers] = useState<Paper[]>([]);
    const [isLoadingPapers, setIsLoadingPapers] = useState<boolean>(false);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

    // 4. Attempt State (Live API)
    const [activeAttemptId, setActiveAttemptId] = useState<string>('');
    const [cbtQuestions, setCbtQuestions] = useState<CbtQuestion[]>([]);
    const [isStartingAttempt, setIsStartingAttempt] = useState<boolean>(false);
    const [isSubmittingAttempt, setIsSubmittingAttempt] = useState<boolean>(false);
    const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

    // Answers map: questionId -> selected option keys, e.g. ['b']; short_text is [typedText]
    const [liveAnswers, setLiveAnswers] = useState<CbtAnswerMap>({});

    // Timer: deadline on the local clock (null = untimed) and when this screen opened
    const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
    const [startedAtMs, setStartedAtMs] = useState<number>(0);

    // Result slip, built from the submit response (or locally for the fallback)
    const [cbtResult, setCbtResult] = useState<CbtResult | null>(null);

    // 5. Fallback Mock Simulation States (used only if the backend has no exam types/papers at all)
    const [useMockFallback, setUseMockFallback] = useState<boolean>(false);
    const [selectedSubjectMock, setSelectedSubjectMock] = useState<SubjectExam | null>(null);

    // Refs so timers and event listeners always see the latest attempt values
    const answersRef = useRef<CbtAnswerMap>({});
    const questionsRef = useRef<CbtQuestion[]>([]);
    const attemptIdRef = useRef<string>('');
    const dirtyRef = useRef<boolean>(false);
    const submittingRef = useRef<boolean>(false);
    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ==========================================
    // INIT: RESOLVE CHILD, LOAD ACCESS + PRODUCT CATALOGUE
    // ==========================================
    useEffect(() => {
        async function init() {
            setIsCheckingAccess(true);
            setIsLoadingProducts(true);

            // Reset any state scoped to the previously-active child before switching
            setAccessData(null);
            setExamTypes([]);
            setProductExamTypes([]);
            setSelectedExamTypeId('');
            setApiSubjects([]);
            setSelectedSubjectId('');
            setYears([]);
            setSelectedYear(undefined);
            setPapers([]);
            setSelectedPaper(null);
            setSelectedProduct(null);
            setSelectedEntitlement(null);
            setUseMockFallback(false);
            setSelectedSubjectMock(null);
            resetAttemptState();
            setStage('catalog');
            setCatalogTab('explore');

            // Use the globally-selected child from the dashboard-wide switcher
            let activeChild = contextActiveChild;
            let resolvedChildId = activeChild?.id || activeChild?._id || '';
            let resolvedName = activeChild?.name || activeChild?.childName || '';

            // Secondary fallback if the context hasn't resolved a child yet
            if (!resolvedChildId) {
                const profileRes = await authApi.getProfile().catch(() => null);
                const profileData = (profileRes as any)?.data;
                const userObj = profileData?.user || profileData;
                const altChild =
                    profileData?.activeChild ||
                    userObj?.activeChild ||
                    userObj?.childInfo ||
                    (userObj?.childProfiles && userObj.childProfiles[0]);

                if (altChild) {
                    resolvedChildId = altChild.id || altChild._id || '';
                    resolvedName = altChild.name || altChild.childName || '';
                }
            }

            // Always load the product catalogue, independent of access/entitlement state —
            // parents need to see what's available to buy even with zero entitlements.
            // Scoped to the child's current class, matching the mobile app's implementation.
            testDrillerApi.getProductCatalog(activeChild?.currentClassId)
                .then((res) => setProducts(res.items || []))
                .catch(() => setProducts([]))
                .finally(() => setIsLoadingProducts(false));

            if (resolvedChildId) {
                setChildProfileId(resolvedChildId);
                setChildName(resolvedName);

                try {
                    let accessRes: ChildAccessResponse;
                    try {
                        accessRes = await testDrillerApi.checkChildAccess(resolvedChildId);
                    } catch (err: any) {
                        const errMsg = err?.response?.data?.message || err?.message || '';
                        // Handle stale/deleted child profile ID error
                        if (errMsg.toLowerCase().includes('not found') || err?.response?.status === 404) {
                            console.warn(`Child profile ID ${resolvedChildId} not found on server. Purging stale localStorage and re-syncing...`);
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem('lesson360_active_child');
                            }
                            const freshProfilesRes = await schoolStructureApi.getChildProfiles().catch(() => null);
                            const rawFresh = freshProfilesRes?.data;
                            const freshProfiles: any[] = Array.isArray(rawFresh) ? rawFresh : (rawFresh as any)?.items || [];

                            if (freshProfiles.length > 0) {
                                const freshChild = freshProfiles[0];
                                resolvedChildId = freshChild.id || freshChild._id || '';
                                resolvedName = freshChild.name || freshChild.childName || '';
                                setChildProfileId(resolvedChildId);
                                setChildName(resolvedName);
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('lesson360_active_child', JSON.stringify(freshChild));
                                }
                                accessRes = await testDrillerApi.checkChildAccess(resolvedChildId);
                            } else {
                                throw err;
                            }
                        } else {
                            throw err;
                        }
                    }

                    setAccessData(accessRes);

                    // Load exam types up-front so we can match them against products when the
                    // parent taps "Practice" on a purchased combo.
                    const examTypesRes = await testDrillerApi.getExamTypes(resolvedChildId).catch(() => null);
                    if (examTypesRes?.items) {
                        setExamTypes(examTypesRes.items);
                    }
                } catch (err) {
                    console.warn('Test Driller access check warning:', err);
                }
            }

            setIsCheckingAccess(false);
        }

        init();
    }, [contextActiveChild?.id, contextActiveChild?._id]);

    // Pick up a `?tab=` query param (used when returning from the standalone checkout callback)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'my-courses' || tab === 'explore') {
            setCatalogTab(tab);
        }
    }, []);

    // Load subjects, years, and papers for active filters
    const loadSubjectsAndPapers = async (cId: string, eTypeId?: string, sId?: string, y?: number) => {
        setIsLoadingPapers(true);
        try {
            const [subjectsRes, yearsRes, papersRes] = await Promise.all([
                testDrillerApi.getSubjects(cId, eTypeId).catch(() => ({ items: [], total: 0 })),
                testDrillerApi.getYears(cId, eTypeId, sId).catch(() => ({ items: [], total: 0 })),
                testDrillerApi.getPapers(cId, { examTypeId: eTypeId, subjectId: sId, year: y }).catch(() => ({ items: [], total: 0 }))
            ]);

            setApiSubjects(subjectsRes.items || []);
            setYears(yearsRes.items || []);
            setPapers(papersRes.items || []);
        } catch {
            setPapers([]);
        } finally {
            setIsLoadingPapers(false);
        }
    };

    // ==========================================
    // CATALOGUE ACTIONS
    // ==========================================

    // Parent taps "Subscribe" on a bundle they don't own yet — standalone checkout
    const handleSubscribeProduct = async (product: TestDrillerProductCatalogItem) => {
        const productId = product.id || (product as any)._id;
        if (!childProfileId || !productId) return;

        setCheckingOutProductId(productId);
        try {
            const res = await testDrillerApi.startProductCheckout({
                childProfileId,
                productId,
                callbackUrl: `${window.location.origin}/payments/test-driller/callback`,
                currency: chargeCurrency,
            });

            const checkout = res?.data?.checkout;
            if (checkout?.authorizationUrl) {
                localStorage.setItem('pending_test_driller_checkout', JSON.stringify({
                    reference: checkout.reference,
                    productId,
                    childProfileId,
                    createdAt: new Date().toISOString()
                }));
                window.location.href = checkout.authorizationUrl;
            } else {
                alert('Could not start checkout: no payment authorization URL returned.');
            }
        } catch (err: any) {
            console.error('Test Driller product checkout error:', err);
            alert(err?.response?.data?.message || 'Failed to start checkout. Please try again.');
        } finally {
            setCheckingOutProductId(null);
        }
    };

    // Parent taps "Practice" on a bundle they already own
    const handlePracticeProduct = (product: TestDrillerProductCatalogItem) => {
        if (!childProfileId) return;

        const productId = product.id || (product as any)._id;
        const entitlement = (accessData?.entitlements || []).find((e) => e.productId === productId) || null;

        setSelectedProduct(product);
        setSelectedEntitlement(entitlement);
        setSelectedSubjectId('');
        setSelectedYear(undefined);
        setPapers([]);
        setApiSubjects([]);
        setYears([]);

        // Prefer the entitlement's own scope snapshot (exact, ID-based) over the name/slug
        // heuristic — it's only a fallback for entitlements that don't carry a snapshot.
        const scopedExamTypeIds = entitlement?.examTypeIdsSnapshot;
        const matches = scopedExamTypeIds && scopedExamTypeIds.length > 0
            ? examTypes.filter((et) => scopedExamTypeIds.includes(et.id))
            : matchExamTypesForProduct(product, examTypes);
        setProductExamTypes(matches.length > 0 ? matches : examTypes);

        if (matches.length === 1) {
            const onlyExamType = matches[0].id;
            setSelectedExamTypeId(onlyExamType);
            testDrillerApi.getYears(childProfileId, onlyExamType).then((res) => {
                setYears(filterYearsByEntitlement(res.items || [], entitlement));
            }).catch(() => setYears([]));
        } else {
            setSelectedExamTypeId('');
        }

        if (examTypes.length === 0 && matches.length === 0) {
            // Backend has no exam-type/paper data at all for this child — fall back to the
            // local practice-exam simulation so the page is never a dead end.
            setUseMockFallback(true);
            setStage('taking');
            return;
        }

        setStage('filters');
    };

    // Filter screen selections
    const handleFilterExamTypeChange = (eTypeId: string) => {
        setSelectedExamTypeId(eTypeId);
        setSelectedYear(undefined);
        setSelectedSubjectId('');
        setYears([]);
        setApiSubjects([]);
        if (childProfileId) {
            testDrillerApi.getYears(childProfileId, eTypeId).then((res) => {
                setYears(filterYearsByEntitlement(res.items || [], selectedEntitlement));
            }).catch(() => setYears([]));
        }
    };

    const handleFilterYearChange = (yr?: number) => {
        setSelectedYear(yr);
        setSelectedSubjectId('');
        if (childProfileId && selectedExamTypeId) {
            testDrillerApi.getSubjects(childProfileId, selectedExamTypeId).then((res) => {
                const scopedSubjectIds = selectedEntitlement?.subjectIdsSnapshot;
                const subjects = scopedSubjectIds && scopedSubjectIds.length > 0
                    ? (res.items || []).filter((s) => scopedSubjectIds.includes(s.id))
                    : (res.items || []);
                setApiSubjects(subjects);
            }).catch(() => setApiSubjects([]));
        }
    };

    const handleContinueToPapers = () => {
        if (!childProfileId || !selectedExamTypeId || !selectedYear || !selectedSubjectId) return;
        loadSubjectsAndPapers(childProfileId, selectedExamTypeId, selectedSubjectId, selectedYear);
        setStage('papers');
    };

    // ==========================================
    // START / RESUME ATTEMPT (LIVE API)
    // ==========================================
    const handleOpenInstructions = (paper: Paper) => {
        setSelectedPaper(paper);
        setStage('instructions');
    };

    const resetAttemptState = () => {
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
        attemptIdRef.current = '';
        answersRef.current = {};
        questionsRef.current = [];
        dirtyRef.current = false;
        submittingRef.current = false;
        setActiveAttemptId('');
        setCbtQuestions([]);
        setLiveAnswers({});
        setDeadlineMs(null);
        setCbtResult(null);
        setAutosaveStatus('saved');
        setIsSubmittingAttempt(false);
    };

    const handleStartApiPaper = async () => {
        const paper = selectedPaper;
        if (!childProfileId || !paper) return;
        setIsStartingAttempt(true);

        try {
            // The start endpoint resumes an in-progress attempt for the same paper instead of
            // creating a duplicate, so this also handles "Resume".
            const res: StartAttemptResponse = await testDrillerApi.startPaperAttempt(
                childProfileId,
                paper.id
            );

            if (res?.session && res?.item) {
                resetAttemptState();
                const questions = fromSessionQuestions(res.session.questions || []);
                const answers = answersFromAttempt(res.item.answers);
                questionsRef.current = questions;
                answersRef.current = answers;
                attemptIdRef.current = res.item.id;

                const serverStart = Date.parse(res.item.startedAt);
                setActiveAttemptId(res.item.id);
                setCbtQuestions(questions);
                setLiveAnswers(answers);
                setDeadlineMs(deadlineFromAttempt(res.item));
                setStartedAtMs(!isNaN(serverStart) && serverStart <= Date.now() ? serverStart : Date.now());
                setStage('taking');
            } else {
                alert('Failed to start paper attempt: No session data returned from server.');
            }
        } catch (err: any) {
            console.error('Backend startPaperAttempt error:', err);
            const errMsg = err?.response?.data?.message || err?.message || 'Error starting practice exam attempt.';
            alert(`API Error: ${errMsg}`);
        } finally {
            setIsStartingAttempt(false);
        }
    };

    const showApiResult = (res: SubmitAttemptResponse) => {
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        setCbtResult(resultFromApi(
            res,
            questionsRef.current,
            answersRef.current,
            selectedPaper?.title || 'Test Driller',
            selectedPaper?.durationMinutes ?? null
        ));
        attemptIdRef.current = '';
        setActiveAttemptId('');
        setStage('result');
    };

    // The backend may already have finalised the attempt (e.g. auto-submitted when time ran
    // out). If so, show its result instead of treating the failure as an error.
    const recoverFinishedAttempt = async (): Promise<boolean> => {
        const attemptId = attemptIdRef.current;
        if (!attemptId || !childProfileId) return false;
        try {
            const detail: any = await testDrillerApi.getAttemptDetail(childProfileId, attemptId);
            if (detail?.item && detail.item.status !== 'in_progress') {
                showApiResult({ item: detail.item, review: detail.review });
                return true;
            }
        } catch {
            // Fall through: the caller reports the original error.
        }
        return false;
    };

    const saveProgress = async () => {
        const attemptId = attemptIdRef.current;
        if (!attemptId || !childProfileId || submittingRef.current || !dirtyRef.current) return;
        dirtyRef.current = false;
        setAutosaveStatus('saving');

        try {
            const res = await testDrillerApi.saveAttemptProgress(
                childProfileId,
                attemptId,
                toAnswerPayload(answersRef.current, questionsRef.current)
            );
            if (attemptIdRef.current !== attemptId) return;
            setAutosaveStatus('saved');

            const item = res?.item;
            if (item?.status && item.status !== 'in_progress') {
                await recoverFinishedAttempt();
                return;
            }
            // Re-sync the countdown with the server's clock on every save.
            if (item?.remainingTimeSeconds != null) {
                setDeadlineMs(Date.now() + item.remainingTimeSeconds * 1000);
            }
        } catch (err) {
            console.warn('Autosave failed:', err);
            // Keep local answers and retry on the next debounce or periodic save.
            dirtyRef.current = true;
            setAutosaveStatus('error');
        }
    };

    // Timers and listeners call through this ref so they always run the latest closure.
    const saveProgressRef = useRef(saveProgress);
    saveProgressRef.current = saveProgress;

    const handleAnswer = (questionId: string, values: string[]) => {
        const updated = { ...answersRef.current, [questionId]: values };
        answersRef.current = updated;
        setLiveAnswers(updated);

        if (!attemptIdRef.current) return; // local fallback: nothing to save
        dirtyRef.current = true;
        setAutosaveStatus('saving');
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = setTimeout(() => saveProgressRef.current(), 1500);
    };

    // Periodic save while the attempt is open, plus a save when the tab is hidden.
    useEffect(() => {
        if (stage !== 'taking' || !activeAttemptId) return;
        const interval = setInterval(() => saveProgressRef.current(), PERIODIC_SAVE_MS);
        const onHidden = () => {
            if (document.visibilityState === 'hidden') saveProgressRef.current();
        };
        document.addEventListener('visibilitychange', onHidden);
        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onHidden);
        };
    }, [stage, activeAttemptId]);

    const handleSubmit = async (reason: 'manual' | 'time_expired' = 'manual') => {
        if (submittingRef.current) return;

        // Local fallback: grade on the device.
        if (!attemptIdRef.current) {
            if (!selectedSubjectMock) return;
            setCbtResult(resultFromPracticeSubject(
                selectedSubjectMock,
                answersRef.current,
                Math.round((Date.now() - startedAtMs) / 1000),
                reason
            ));
            setStage('result');
            return;
        }

        const attemptId = attemptIdRef.current;
        if (!childProfileId) return;
        submittingRef.current = true;
        setIsSubmittingAttempt(true);
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

        try {
            const res = await testDrillerApi.submitAttempt(
                childProfileId,
                attemptId,
                toAnswerPayload(answersRef.current, questionsRef.current)
            );
            showApiResult(res);
        } catch (err: any) {
            console.error('API submission failed:', err);
            if (!(await recoverFinishedAttempt())) {
                alert(err?.response?.data?.message || 'Submission error. Please check your network and try again.');
            }
        } finally {
            submittingRef.current = false;
            setIsSubmittingAttempt(false);
        }
    };

    // Leaving keeps a live attempt open on the server; opening the paper again resumes it.
    const handleExitExam = async () => {
        if (!attemptIdRef.current) {
            handleBackToCatalog();
            return;
        }
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        await saveProgressRef.current();
        resetAttemptState();
        setStage('papers');
    };

    // ==========================================
    // MOCK SIMULATION HANDLERS (Fallback mode — only reached if the backend has zero exam
    // types/papers configured for this child, so the page is never a dead end)
    // ==========================================
    const handleSelectSubjectMock = (subject: SubjectExam) => {
        resetAttemptState();
        const questions = fromPracticeSubject(subject);
        questionsRef.current = questions;
        setSelectedSubjectMock(subject);
        setCbtQuestions(questions);
        setDeadlineMs(subject.durationMinutes ? Date.now() + subject.durationMinutes * 60000 : null);
        setStartedAtMs(Date.now());
        setStage('taking');
    };

    const handleNewTest = () => {
        resetAttemptState();
        if (useMockFallback || !selectedPaper) {
            setSelectedSubjectMock(null);
            setStage('taking');
        } else {
            setStage('papers');
        }
    };

    const handleBackToCatalog = () => {
        resetAttemptState();
        setStage('catalog');
        setSelectedProduct(null);
        setSelectedEntitlement(null);
        setSelectedSubjectMock(null);
        setSelectedPaper(null);
        setUseMockFallback(false);
    };

    // Loading access state
    if (isCheckingAccess) {
        return (
            <div className="p-12 bg-white rounded-3xl border border-gray-100 shadow-md text-center space-y-4 max-w-xl mx-auto my-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF4801] mx-auto" />
                <p className="text-gray-700 font-bold text-base">Loading Test Driller...</p>
                <p className="text-xs text-gray-500">Checking bundles for {childName || 'learner'}...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* STAGE 1: PRODUCT CATALOGUE (Explore / My Courses) */}
            {stage === 'catalog' && (
                <TestDrillerCatalog
                    activeTab={catalogTab}
                    onTabChange={setCatalogTab}
                    products={products}
                    purchasedProductIds={purchasedProductIds}
                    isLoading={isLoadingProducts}
                    isCheckingOutProductId={checkingOutProductId}
                    onSubscribe={handleSubscribeProduct}
                    onPractice={handlePracticeProduct}
                />
            )}

            {/* STAGE 2: FILTERS — Exam Type -> Year -> Subject, scoped to the selected product */}
            {stage === 'filters' && selectedProduct && (
                <div className="max-w-3xl mx-auto space-y-5">
                    <button
                        type="button"
                        onClick={handleBackToCatalog}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF4801] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Test Drillers</span>
                    </button>

                    <div className="bg-gradient-to-br from-[#4A154B] to-[#2D0C2E] text-white rounded-3xl p-6 space-y-1">
                        <h1 className="text-xl font-black">{selectedProduct.name || selectedProduct.title}</h1>
                        <p className="text-sm text-purple-200">Everything you need to ace {selectedProduct.name || 'this exam'}.</p>
                    </div>

                    {/* Exam Type (only shown when the product covers more than one exam board) */}
                    {productExamTypes.length > 1 && (
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                            <h2 className="text-sm font-bold text-gray-900">Select Exam Type</h2>
                            <div className="flex flex-wrap items-center gap-2.5">
                                {productExamTypes.map((et) => (
                                    <button
                                        key={et.id}
                                        type="button"
                                        onClick={() => handleFilterExamTypeChange(et.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${selectedExamTypeId === et.id ? 'bg-[#FF4801] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>{et.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Year — required */}
                    {selectedExamTypeId && (
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#FF4801]" />
                                Exam Setting (Year) <span className="text-[#FF4801]">*</span>
                            </h2>
                            {years.length > 0 ? (
                                <select
                                    value={selectedYear || ''}
                                    onChange={(e) => handleFilterYearChange(e.target.value ? Number(e.target.value) : undefined)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 bg-white shadow-2xs focus:ring-2 focus:ring-[#FF4801] cursor-pointer"
                                >
                                    <option value="">Select a year</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-xs text-gray-500">Loading available years...</p>
                            )}
                        </div>
                    )}

                    {/* Subject — required, shown once a year is chosen */}
                    {selectedYear && (
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-gray-900">Subjects</h2>
                                <span className="text-xs text-gray-500 font-semibold">{apiSubjects.length} available</span>
                            </div>
                            {apiSubjects.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {apiSubjects.map((sub) => {
                                        const isSelected = selectedSubjectId === sub.id;
                                        return (
                                            <button
                                                key={sub.id}
                                                type="button"
                                                onClick={() => setSelectedSubjectId(sub.id)}
                                                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${isSelected
                                                    ? 'border-[#FF4801] bg-orange-50 ring-2 ring-[#FF4801]/30'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className="text-xs font-bold text-gray-900">{sub.name}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">Loading subjects for this year...</p>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        disabled={!selectedExamTypeId || !selectedYear || !selectedSubjectId}
                        onClick={handleContinueToPapers}
                        className="w-full py-3.5 rounded-2xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-sm shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            )}

            {/* STAGE 3: PAPERS LIST */}
            {stage === 'papers' && (
                <div className="max-w-4xl mx-auto space-y-5">
                    <button
                        type="button"
                        onClick={() => setStage('filters')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF4801] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Subject Selection</span>
                    </button>

                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Papers For:</span>
                        <span className="px-3 py-1 bg-orange-100 text-[#FF4801] text-xs font-bold rounded-lg">
                            {apiSubjects.find((s) => s.id === selectedSubjectId)?.name} &middot; {selectedYear}
                        </span>
                    </div>

                    {isLoadingPapers ? (
                        <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-[#FF4801] mx-auto" />
                            <p className="text-sm font-semibold text-gray-600">Loading Available Past Papers...</p>
                        </div>
                    ) : papers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {papers.map((paper) => (
                                <div
                                    key={paper.id}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF4801] text-xs font-bold uppercase">
                                                {paper.year || 'Practice'}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {paper.attemptMode} Mode
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                            {paper.title}
                                        </h3>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleOpenInstructions(paper)}
                                        className="w-full bg-[#FF4801] hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Get Started</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                            <p className="text-base font-bold text-gray-800">No examination papers found for this subject and year.</p>
                            <button
                                type="button"
                                onClick={() => setStage('filters')}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
                            >
                                Change Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* STAGE 4: INSTRUCTIONS */}
            {stage === 'instructions' && selectedPaper && (
                <PaperInstructions
                    paper={selectedPaper}
                    isStarting={isStartingAttempt}
                    onBack={() => setStage('papers')}
                    onStart={handleStartApiPaper}
                />
            )}

            {/* STAGE 5: TAKING EXAM (CBT terminal) */}
            {stage === 'taking' && (
                (useMockFallback || !selectedPaper) && !selectedSubjectMock ? (
                    <ExamSelectionGrid onSelectSubject={handleSelectSubjectMock} />
                ) : (
                    <CbtExamScreen
                        key={activeAttemptId || selectedSubjectMock?.id || 'exam'}
                        candidateName={childName || 'Candidate'}
                        paperTitle={selectedPaper && !useMockFallback ? selectedPaper.title : selectedSubjectMock?.title || 'Practice exam'}
                        paperMeta={selectedPaper && !useMockFallback
                            ? `${selectedPaper.attemptMode === 'practice' ? 'Practice' : 'Exam'} mode`
                            : 'Practice mode'}
                        questions={cbtQuestions}
                        answers={liveAnswers}
                        onAnswer={handleAnswer}
                        deadlineMs={deadlineMs}
                        startedAtMs={startedAtMs}
                        onTimeUp={() => handleSubmit('time_expired')}
                        onSubmit={() => handleSubmit('manual')}
                        onExit={handleExitExam}
                        exitMessage={activeAttemptId
                            ? 'Your answers are saved. The clock keeps running while you are away, and opening this paper again resumes where you stopped.'
                            : 'This practice run is not saved. Leaving now discards your answers.'}
                        isSubmitting={isSubmittingAttempt}
                        saveStatus={activeAttemptId ? autosaveStatus : undefined}
                        flagStorageKey={activeAttemptId ? `l360.cbt.flags.${activeAttemptId}` : undefined}
                    />
                )
            )}

            {/* STAGE 6: RESULT SLIP (score + corrections) */}
            {stage === 'result' && cbtResult && (
                <CbtResultSlip
                    result={cbtResult}
                    candidateName={childName || 'Candidate'}
                    onNewTest={handleNewTest}
                    onBackToCatalog={handleBackToCatalog}
                />
            )}

        </div>
    );
}
