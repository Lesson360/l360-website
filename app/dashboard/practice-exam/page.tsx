'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    testDrillerApi,
    ChildAccessResponse,
    ExamType,
    SubjectItem,
    Paper,
    StartAttemptResponse,
    SubmitAttemptResponse,
    AttemptItem,
    SessionQuestion
} from '@/lib/api/test-driller';
import { authApi } from '@/lib/api/auth';
import { schoolStructureApi } from '@/lib/api/school-structure';
import { SubjectExam, PRACTICE_EXAMS, UserAnswerMap, ExamResultSummary } from '@/lib/data/practiceExamsData';

import { ExamSelectionGrid } from '@/components/practice-exam/ExamSelectionGrid';
import { ExamQuestionView } from '@/components/practice-exam/ExamQuestionView';
import { ExamResultView } from '@/components/practice-exam/ExamResultView';
import { ExamReviewView } from '@/components/practice-exam/ExamReviewView';
import {
    Loader2,
    Lock,
    AlertCircle,
    BookOpen,
    Calendar,
    Sparkles,
    Play,
    RefreshCw,
    CheckCircle2,
    Clock,
    FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PracticeExamPage() {
    const router = useRouter();

    // 1. Child Profile & Access Context
    const [childProfileId, setChildProfileId] = useState<string>('');
    const [childName, setChildName] = useState<string>('');
    const [accessData, setAccessData] = useState<ChildAccessResponse | null>(null);
    const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);

    // 2. Paper Hierarchy Filters & Data
    const [examTypes, setExamTypes] = useState<ExamType[]>([]);
    const [selectedExamTypeId, setSelectedExamTypeId] = useState<string>('');

    const [apiSubjects, setApiSubjects] = useState<SubjectItem[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    const [papers, setPapers] = useState<Paper[]>([]);
    const [isLoadingPapers, setIsLoadingPapers] = useState<boolean>(false);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

    // 3. Attempt State (Live API)
    const [currentAttempt, setCurrentAttempt] = useState<AttemptItem | null>(null);
    const [sessionQuestions, setSessionQuestions] = useState<SessionQuestion[]>([]);
    const [activeAttemptId, setActiveAttemptId] = useState<string>('');
    const [isStartingAttempt, setIsStartingAttempt] = useState<boolean>(false);
    const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

    // Live API answers map: questionId -> array of selected keys e.g. ['a'] or ['b']
    const [liveAnswers, setLiveAnswers] = useState<Record<string, string[]>>({});

    // Live API Submit Response & Review
    const [apiSubmitResponse, setApiSubmitResponse] = useState<SubmitAttemptResponse | null>(null);

    // 4. View Mode: 'selection' | 'taking' | 'result' | 'review' | 'locked'
    const [viewMode, setViewMode] = useState<'selection' | 'taking' | 'result' | 'review' | 'locked'>('selection');

    // 5. Fallback Mock Simulation States (used if backend API returns error/unreachable)
    const [useMockFallback, setUseMockFallback] = useState<boolean>(false);
    const [selectedSubjectMock, setSelectedSubjectMock] = useState<SubjectExam | null>(null);
    const [userAnswersMock, setUserAnswersMock] = useState<UserAnswerMap>({});
    const [resultSummaryMock, setResultSummaryMock] = useState<ExamResultSummary | null>(null);

    // Timer tracking
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

    // Debounce timer ref for autosave
    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ==========================================
    // INIT & ACCESS CHECK
    // ==========================================
    useEffect(() => {
        async function initAccess() {
            setIsCheckingAccess(true);
            let resolvedChildId = '';
            let resolvedName = '';

            // Check localStorage
            if (typeof window !== 'undefined') {
                const cachedStr = localStorage.getItem('lesson360_active_child');
                if (cachedStr) {
                    try {
                        const cached = JSON.parse(cachedStr);
                        resolvedChildId = cached.id || cached._id || cached.childProfileId || '';
                        resolvedName = cached.name || cached.childName || '';
                    } catch { }
                }
            }

            // Fallback to authApi.getProfile()
            if (!resolvedChildId) {
                const profileRes = await authApi.getProfile().catch(() => null);
                const profileData = (profileRes as any)?.data;
                const userObj = profileData?.user || profileData;
                const activeChild =
                    profileData?.activeChild ||
                    userObj?.activeChild ||
                    userObj?.childInfo ||
                    (userObj?.childProfiles && userObj.childProfiles[0]);

                if (activeChild) {
                    resolvedChildId = activeChild.id || activeChild._id || '';
                    resolvedName = activeChild.name || activeChild.childName || '';
                }
            }

            // Fallback to schoolStructureApi.getChildProfiles()
            if (!resolvedChildId) {
                const cpRes = await schoolStructureApi.getChildProfiles().catch(() => null);
                let cpList: any[] = [];
                if (Array.isArray(cpRes?.data)) cpList = cpRes.data;
                else if (Array.isArray((cpRes?.data as any)?.items)) cpList = (cpRes?.data as any).items;

                if (cpList.length > 0) {
                    resolvedChildId = cpList[0].id || cpList[0]._id || '';
                    resolvedName = cpList[0].name || cpList[0].childName || '';
                }
            }

            if (resolvedChildId) {
                setChildProfileId(resolvedChildId);
                setChildName(resolvedName);

                try {
                    const accessRes = await testDrillerApi.checkChildAccess(resolvedChildId);
                    setAccessData(accessRes);

                    if (!accessRes.hasAccess) {
                        setViewMode('locked');
                        setIsCheckingAccess(false);
                        return;
                    }

                    // Load Exam Types
                    const examTypesRes = await testDrillerApi.getExamTypes(resolvedChildId).catch(() => null);
                    if (examTypesRes?.items && examTypesRes.items.length > 0) {
                        setExamTypes(examTypesRes.items);
                        const firstExamTypeId = examTypesRes.items[0].id;
                        setSelectedExamTypeId(firstExamTypeId);

                        // Load Subjects for first exam type
                        loadSubjectsAndPapers(resolvedChildId, firstExamTypeId);
                    } else {
                        // Switch to UI simulation fallback if endpoint not active
                        setUseMockFallback(true);
                    }
                } catch (err) {
                    console.warn('Test Driller access check warning, using simulation fallback:', err);
                    setUseMockFallback(true);
                }
            } else {
                // No child profile found, default to mock fallback for evaluation
                setUseMockFallback(true);
            }

            setIsCheckingAccess(false);
        }

        initAccess();
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

            if ((!papersRes.items || papersRes.items.length === 0) && (!subjectsRes.items || subjectsRes.items.length === 0)) {
                setUseMockFallback(true);
            }
        } catch {
            setUseMockFallback(true);
        } finally {
            setIsLoadingPapers(false);
        }
    };

    // Filter updates
    const handleExamTypeChange = (eTypeId: string) => {
        setSelectedExamTypeId(eTypeId);
        setSelectedSubjectId('');
        setSelectedYear(undefined);
        if (childProfileId) {
            loadSubjectsAndPapers(childProfileId, eTypeId, undefined, undefined);
        }
    };

    const handleSubjectChange = (sId: string) => {
        setSelectedSubjectId(sId);
        setSelectedYear(undefined);
        if (childProfileId) {
            loadSubjectsAndPapers(childProfileId, selectedExamTypeId, sId, undefined);
        }
    };

    const handleYearChange = (yr?: number) => {
        setSelectedYear(yr);
        if (childProfileId) {
            loadSubjectsAndPapers(childProfileId, selectedExamTypeId, selectedSubjectId, yr);
        }
    };

    // ==========================================
    // START / RESUME ATTEMPT (LIVE API)
    // ==========================================
    const handleStartApiPaper = async (paper: Paper) => {
        if (!childProfileId) return;
        setIsStartingAttempt(true);
        setSelectedPaper(paper);

        try {
            const res: StartAttemptResponse = await testDrillerApi.startPaperAttempt(
                childProfileId,
                paper.id
            );

            if (res?.session && res?.item) {
                setCurrentAttempt(res.item);
                setActiveAttemptId(res.item.id);
                setSessionQuestions(res.session.questions || []);

                // Initialize answers map from existing attempt if resuming
                const initialAnswers: Record<string, string[]> = {};
                if (res.item.answers && Array.isArray(res.item.answers)) {
                    res.item.answers.forEach((ans) => {
                        if (ans.questionId && ans.selectedOptionKeys) {
                            initialAnswers[ans.questionId] = ans.selectedOptionKeys;
                        }
                    });
                }
                setLiveAnswers(initialAnswers);

                setElapsedSeconds(0);
                setIsTimerRunning(true);
                setViewMode('taking');
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

    // Handle selecting answer in API mode
    const handleApiAnswerSelect = (questionId: string, optionKey: string) => {
        setLiveAnswers((prev) => {
            const updated = {
                ...prev,
                [questionId]: [optionKey]
            };
            triggerAutosave(updated);
            return updated;
        });
    };

    // Trigger debounced autosave according to Section 4 of handoff
    const triggerAutosave = useCallback((currentAnswersMap: Record<string, string[]>) => {
        if (!childProfileId || !activeAttemptId) return;
        setAutosaveStatus('saving');

        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current);
        }

        autosaveTimerRef.current = setTimeout(async () => {
            const answerPayload = Object.entries(currentAnswersMap).map(([qId, keys]) => ({
                questionId: qId,
                selectedOptionKeys: keys
            }));

            try {
                await testDrillerApi.saveAttemptProgress(
                    childProfileId,
                    activeAttemptId,
                    answerPayload
                );
                setAutosaveStatus('saved');
            } catch (err) {
                console.warn('Autosave failed:', err);
                setAutosaveStatus('error');
            }
        }, 1500);
    }, [childProfileId, activeAttemptId]);

    // Handle Submitting API Attempt
    const handleApiSubmit = async () => {
        if (!childProfileId || !activeAttemptId) return;
        setIsTimerRunning(false);

        const answerPayload = Object.entries(liveAnswers).map(([qId, keys]) => ({
            questionId: qId,
            selectedOptionKeys: keys
        }));

        try {
            const res = await testDrillerApi.submitAttempt(
                childProfileId,
                activeAttemptId,
                answerPayload
            );

            setApiSubmitResponse(res);
            setViewMode('result');
        } catch (err: any) {
            console.error('API submission failed:', err);
            alert(err?.response?.data?.message || 'Submission error. Please check network.');
        }
    };

    // ==========================================
    // MOCK SIMULATION HANDLERS (Fallback mode)
    // ==========================================
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const handleSelectSubjectMock = (subject: SubjectExam) => {
        setSelectedSubjectMock(subject);
        setUserAnswersMock({});
        setElapsedSeconds(0);
        setIsTimerRunning(true);
        setViewMode('taking');
    };

    const handleAnswerSelectMock = (questionId: string, optionId: string) => {
        setUserAnswersMock((prev) => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmitExamMock = () => {
        setIsTimerRunning(false);
        if (!selectedSubjectMock) return;

        const allQuestions = selectedSubjectMock.topics.flatMap((t) => t.questions);
        const totalQuestions = allQuestions.length;
        const attemptedCount = Object.keys(userAnswersMock).length;

        let correctCount = 0;
        allQuestions.forEach((q) => {
            if (userAnswersMock[q.id] === q.correctOptionId) {
                correctCount += 1;
            }
        });

        const scorePercentage = totalQuestions > 0
            ? Math.round((correctCount / totalQuestions) * 100)
            : 0;

        setResultSummaryMock({
            scorePercentage,
            correctCount,
            totalQuestions,
            passed: scorePercentage >= 50,
            timeTakenSeconds: elapsedSeconds,
            totalTimeMinutes: selectedSubjectMock.durationMinutes,
            attemptedCount
        });

        setViewMode('result');
    };

    const handleBackToSelection = () => {
        setIsTimerRunning(false);
        setViewMode('selection');
        setSelectedSubjectMock(null);
        setSelectedPaper(null);
        setUserAnswersMock({});
        setLiveAnswers({});
    };

    const handleBackToDashboard = () => {
        router.push('/dashboard/video-library');
    };

    // Loading access state
    if (isCheckingAccess) {
        return (
            <div className="p-12 bg-white rounded-3xl border border-gray-100 shadow-md text-center space-y-4 max-w-xl mx-auto my-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF4801] mx-auto" />
                <p className="text-gray-700 font-bold text-base">Verifying Test Driller Entitlement & Access...</p>
                <p className="text-xs text-gray-500">Checking active subscriptions for {childName || 'learner'}...</p>
            </div>
        );
    }

    // Locked state (if access is false)
    if (viewMode === 'locked') {
        return (
            <div className="p-8 sm:p-12 bg-white rounded-3xl border border-gray-200 shadow-md text-center space-y-6 max-w-2xl mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-gray-900">Test Driller Access Locked</h2>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                        {childName || 'Your child profile'} does not currently have an active Test Driller entitlement. Purchase access to unlock JAMB, WAEC, and NECO past question drills.
                    </p>
                </div>
                <div className="pt-4 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.push('/pricing')}
                        className="px-8 py-3.5 rounded-2xl bg-[#FF4801] hover:bg-[#e03f00] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                        Unlock Test Driller Subscription
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header Title */}
            {viewMode === 'selection' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FF4801] tracking-tight">
                            Practice Exam / Test Driller
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Access subject mock exams, past questions, and real-time timed test simulations.
                        </p>
                    </div>


                </div>
            )}

            {/* VIEW 1: SELECTION GRID */}
            {viewMode === 'selection' && (
                <>
                    {/* Live API Paper Selector vs Mock Fallback */}
                    {!useMockFallback ? (
                        <div className="space-y-6">
                            {/* Filter Bar: Exam Types & Years */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Exam Type:</span>
                                    {examTypes.map((et) => (
                                        <button
                                            key={et.id}
                                            type="button"
                                            onClick={() => handleExamTypeChange(et.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedExamTypeId === et.id
                                                ? 'bg-[#FF4801] text-white shadow-xs'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {et.name}
                                        </button>
                                    ))}
                                </div>

                                {years.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <select
                                            value={selectedYear || ''}
                                            onChange={(e) => handleYearChange(e.target.value ? Number(e.target.value) : undefined)}
                                            className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 bg-white"
                                        >
                                            <option value="">All Available Years</option>
                                            {years.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Papers List */}
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
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {paper.instructions || 'Standard test driller examination paper.'}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                                <div className="flex items-center justify-between text-xs text-gray-600 font-semibold">
                                                    <span className="flex items-center gap-1">
                                                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                                                        {paper.totalQuestions} Questions
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                        {paper.durationMinutes} Mins
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={isStartingAttempt}
                                                    onClick={() => handleStartApiPaper(paper)}
                                                    className="w-full bg-[#CBE9FF] hover:bg-[#b5e0ff] active:scale-[0.98] text-gray-900 font-bold text-sm py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {isStartingAttempt && selectedPaper?.id === paper.id ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin text-gray-800" />
                                                            <span>Launching Exam...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Start Paper</span>
                                                            <Play className="w-3.5 h-3.5 fill-current" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ExamSelectionGrid onSelectSubject={handleSelectSubjectMock} />
                            )}
                        </div>
                    ) : (
                        <ExamSelectionGrid onSelectSubject={handleSelectSubjectMock} />
                    )}
                </>
            )}

            {/* VIEW 2: TAKING EXAM */}
            {viewMode === 'taking' && (
                <>
                    {useMockFallback || !selectedPaper ? (
                        selectedSubjectMock && (
                            <ExamQuestionView
                                subject={selectedSubjectMock}
                                userAnswers={userAnswersMock}
                                onAnswerSelect={handleAnswerSelectMock}
                                onSubmitExam={handleSubmitExamMock}
                                onBackToSelection={handleBackToSelection}
                                elapsedSeconds={elapsedSeconds}
                            />
                        )
                    ) : (
                        /* API Live Attempt Workspace */
                        <div className="space-y-6">
                            {/* Autosave Banner */}
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
                                <span>{selectedPaper.title}</span>
                                <span className="flex items-center gap-1.5">
                                    {autosaveStatus === 'saving' && (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
                                            <span className="text-orange-600 font-bold">Autosaving Progress...</span>
                                        </>
                                    )}
                                    {autosaveStatus === 'saved' && (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-emerald-600 font-bold">Progress Saved</span>
                                        </>
                                    )}
                                    {autosaveStatus === 'error' && (
                                        <span className="text-red-500 font-bold">Autosave retry pending</span>
                                    )}
                                </span>
                            </div>

                            {/* Render Questions View mapped from session.questions */}
                            <ExamQuestionView
                                subject={{
                                    id: selectedPaper.id,
                                    title: selectedPaper.title,
                                    subtitle: selectedPaper.instructions || '',
                                    iconType: 'math',
                                    iconBgColor: 'bg-purple-900',
                                    iconTextColor: 'text-white',
                                    totalQuestions: sessionQuestions.length,
                                    durationMinutes: selectedPaper.durationMinutes,
                                    totalMarks: selectedPaper.totalMarks || 100,
                                    topics: [
                                        {
                                            id: 'api-main-topic',
                                            name: selectedPaper.title,
                                            headerTitle: selectedPaper.title,
                                            questionCount: sessionQuestions.length,
                                            totalMarks: selectedPaper.totalMarks || 100,
                                            durationMinutes: selectedPaper.durationMinutes,
                                            questions: sessionQuestions.map((q, idx) => ({
                                                id: q.id,
                                                number: idx + 1,
                                                text: q.prompt,
                                                marks: q.marks || 1,
                                                options: q.options.map((opt) => ({
                                                    id: opt.key,
                                                    label: opt.key.toUpperCase(),
                                                    text: opt.text
                                                })),
                                                correctOptionId: '',
                                                topicId: 'api-main-topic'
                                            }))
                                        }
                                    ]
                                }}
                                userAnswers={Object.fromEntries(
                                    Object.entries(liveAnswers).map(([k, v]) => [k, v[0] || ''])
                                )}
                                onAnswerSelect={(qId, optId) => handleApiAnswerSelect(qId, optId)}
                                onSubmitExam={handleApiSubmit}
                                onBackToSelection={handleBackToSelection}
                                elapsedSeconds={elapsedSeconds}
                            />
                        </div>
                    )}
                </>
            )}

            {/* VIEW 3: RESULT */}
            {viewMode === 'result' && (
                <>
                    {apiSubmitResponse?.item ? (
                        <ExamResultView
                            subject={{
                                id: selectedPaper?.id || 'res',
                                title: apiSubmitResponse.review?.paper?.title || selectedPaper?.title || 'Practice Exam',
                                subtitle: '',
                                iconType: 'math',
                                iconBgColor: 'bg-purple-900',
                                iconTextColor: 'text-white',
                                totalQuestions: apiSubmitResponse.item.totalQuestions,
                                durationMinutes: selectedPaper?.durationMinutes || 60,
                                totalMarks: apiSubmitResponse.item.totalAvailableScore || 100,
                                topics: []
                            }}
                            result={{
                                scorePercentage: apiSubmitResponse.item.percentage || 0,
                                correctCount: apiSubmitResponse.item.totalCorrect || 0,
                                totalQuestions: apiSubmitResponse.item.totalQuestions || 0,
                                passed: (apiSubmitResponse.item.percentage || 0) >= 50,
                                timeTakenSeconds: elapsedSeconds,
                                totalTimeMinutes: selectedPaper?.durationMinutes || 60,
                                attemptedCount: apiSubmitResponse.item.answers?.length || 0
                            }}
                            onReviewAnswers={() => setViewMode('review')}
                            onBackToDashboard={handleBackToDashboard}
                        />
                    ) : (
                        selectedSubjectMock && resultSummaryMock && (
                            <ExamResultView
                                subject={selectedSubjectMock}
                                result={resultSummaryMock}
                                onReviewAnswers={() => setViewMode('review')}
                                onBackToDashboard={handleBackToDashboard}
                            />
                        )
                    )}
                </>
            )}

            {/* VIEW 4: ANSWER REVIEW */}
            {viewMode === 'review' && (
                <>
                    {apiSubmitResponse?.review?.questions ? (
                        <ExamReviewView
                            subject={{
                                id: selectedPaper?.id || 'rev',
                                title: apiSubmitResponse.review.paper.title || 'Review',
                                subtitle: '',
                                iconType: 'math',
                                iconBgColor: 'bg-purple-900',
                                iconTextColor: 'text-white',
                                totalQuestions: apiSubmitResponse.review.questions.length,
                                durationMinutes: 60,
                                totalMarks: 100,
                                topics: [
                                    {
                                        id: 'rev-topic',
                                        name: 'Answer Key Review',
                                        questionCount: apiSubmitResponse.review.questions.length,
                                        totalMarks: 100,
                                        durationMinutes: 60,
                                        questions: apiSubmitResponse.review.questions.map((q, idx) => ({
                                            id: q.id,
                                            number: idx + 1,
                                            text: q.prompt,
                                            marks: 1,
                                            options: q.options.map((opt) => ({
                                                id: opt.key,
                                                label: opt.key.toUpperCase(),
                                                text: opt.text
                                            })),
                                            correctOptionId: q.options.find((opt) => opt.isCorrect)?.key || '',
                                            explanation: q.explanation,
                                            topicId: 'rev-topic'
                                        }))
                                    }
                                ]
                            }}
                            userAnswers={Object.fromEntries(
                                Object.entries(liveAnswers).map(([k, v]) => [k, v[0] || ''])
                            )}
                            onBackToResult={() => setViewMode('result')}
                            onBackToDashboard={handleBackToDashboard}
                        />
                    ) : (
                        selectedSubjectMock && (
                            <ExamReviewView
                                subject={selectedSubjectMock}
                                userAnswers={userAnswersMock}
                                onBackToResult={() => setViewMode('result')}
                                onBackToDashboard={handleBackToDashboard}
                            />
                        )
                    )}
                </>
            )}

        </div>
    );
}
