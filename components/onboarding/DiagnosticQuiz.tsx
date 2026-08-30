'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    Check,
    Sparkles,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Clock,
    HelpCircle,
    Award,
    CheckCircle2,
    BookOpen,
    Maximize2,
    ZoomIn,
    X,
    ImageIcon,
} from 'lucide-react';
import {
    diagnosticApi,
    DiagnosticTemplate,
    DiagnosticQuestion,
    DiagnosticAttemptResult,
} from '@/lib/api/diagnostic';
import { authApi } from '@/lib/api/auth';
import { schoolStructureApi } from '@/lib/api/school-structure';

// Fallback Diagnostic Template if API template is unavailable
const FALLBACK_TEMPLATE: DiagnosticTemplate = {
    id: 'default-diagnostic-template',
    title: 'Learner Placement Assessment',
    description:
        "A quick assessment to evaluate your child's current knowledge band, personalize their learning path, and assign optimal subjects.",
    estimatedMinutes: 10,
    questions: [
        {
            id: 'q1',
            prompt: 'What fraction of a shape is shaded if 3 out of 4 equal parts are colored?',
            helperText: 'Examine the diagram carefully and select the matching fraction',
            imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
            skillTag: 'Mathematics',
            options: [
                { key: 'a', text: '1/4', score: 0 },
                { key: 'b', text: '2/4', score: 0 },
                { key: 'c', text: '3/4', score: 1 },
                { key: 'd', text: '4/3', score: 0 },
            ],
        },
        {
            id: 'q2',
            prompt: 'Which word is a noun in the sentence: "The quick brown fox jumps over the lazy dog"?',
            helperText: 'Identify the noun',
            skillTag: 'English Grammar',
            options: [
                { key: 'a', text: 'Quick', score: 0 },
                { key: 'b', text: 'Jumps', score: 0 },
                { key: 'c', text: 'Fox', score: 1 },
                { key: 'd', text: 'Lazy', score: 0 },
            ],
        },
        {
            id: 'q3',
            prompt: 'Which planet in our solar system is known as the Red Planet?',
            helperText: 'Solar System Knowledge',
            imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
            skillTag: 'Basic Science',
            options: [
                { key: 'a', text: 'Venus', score: 0 },
                { key: 'b', text: 'Mars', score: 1 },
                { key: 'c', text: 'Jupiter', score: 0 },
                { key: 'd', text: 'Saturn', score: 0 },
            ],
        },
        {
            id: 'q4',
            prompt: 'What is 15 + 27?',
            helperText: 'Select the correct sum',
            skillTag: 'Mathematics',
            options: [
                { key: 'a', text: '32', score: 0 },
                { key: 'b', text: '42', score: 1 },
                { key: 'c', text: '52', score: 0 },
                { key: 'd', text: '45', score: 0 },
            ],
        },
        {
            id: 'q5',
            prompt: 'What is the main job of plant roots?',
            helperText: 'Botany & Environment',
            imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
            skillTag: 'Basic Science',
            options: [
                { key: 'a', text: 'Absorb water and nutrients from soil', score: 1 },
                { key: 'b', text: 'Make seeds', score: 0 },
                { key: 'c', text: 'Catch sunlight', score: 0 },
                { key: 'd', text: 'Produce flowers', score: 0 },
            ],
        },
    ],
};

export default function DiagnosticQuiz() {
    const router = useRouter();

    // View Navigation: 'intro' | 'quiz' | 'result'
    const [view, setView] = useState<'intro' | 'quiz' | 'result'>('intro');

    // Profile & Context State
    const [childProfileId, setChildProfileId] = useState('');
    const [childName, setChildName] = useState('');

    // Quiz & Answers State
    const [template, setTemplate] = useState<DiagnosticTemplate | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOptionKey
    const [result, setResult] = useState<DiagnosticAttemptResult | null>(null);

    // UI Loading & Failure States
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

    // Lightbox / Zoom Modal State for Question Images
    const [activeZoomImage, setActiveZoomImage] = useState<{ url: string; prompt?: string } | null>(null);

    // Load active child and fetch diagnostic template
    useEffect(() => {
        async function initDiagnostic() {
            setIsLoading(true);
            setErrorMessage('');

            let resolvedChildId = '';
            let resolvedChildName = '';

            // 1. Check localStorage
            if (typeof window !== 'undefined') {
                const cachedStr = localStorage.getItem('lesson360_active_child');
                if (cachedStr) {
                    try {
                        const cached = JSON.parse(cachedStr);
                        resolvedChildId = cached.id || cached._id || cached.childProfileId || '';
                        resolvedChildName = cached.name || cached.childName || '';
                    } catch { }
                }
            }

            // 2. Fallback to authApi.getProfile()
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
                    resolvedChildName = activeChild.name || activeChild.childName || '';
                }
            }

            // 3. Fallback to schoolStructureApi.getChildProfiles()
            if (!resolvedChildId) {
                const cpRes = await schoolStructureApi.getChildProfiles().catch(() => null);
                let cpList: any[] = [];
                if (Array.isArray(cpRes?.data)) cpList = cpRes.data;
                else if (Array.isArray((cpRes?.data as any)?.items)) cpList = (cpRes?.data as any).items;

                if (cpList.length > 0) {
                    resolvedChildId = cpList[0].id || cpList[0]._id || '';
                    resolvedChildName = cpList[0].name || cpList[0].childName || '';
                }
            }

            if (resolvedChildId) setChildProfileId(resolvedChildId);
            if (resolvedChildName) setChildName(resolvedChildName);

            // Fetch template from API if profile ID exists
            if (resolvedChildId) {
                try {
                    const templateRes = await diagnosticApi.getTemplate(resolvedChildId);
                    let tObj: DiagnosticTemplate | null = null;

                    if (templateRes?.data?.questions) {
                        tObj = templateRes.data;
                    } else if (templateRes?.questions) {
                        tObj = templateRes;
                    } else if (templateRes?.data?.template) {
                        tObj = templateRes.data.template;
                    }

                    if (tObj && tObj.questions && tObj.questions.length > 0) {
                        setTemplate(tObj);
                    } else {
                        setTemplate(FALLBACK_TEMPLATE);
                    }
                } catch (err) {
                    console.warn('Could not load API diagnostic template, using fallback:', err);
                    setTemplate(FALLBACK_TEMPLATE);
                }
            } else {
                setTemplate(FALLBACK_TEMPLATE);
            }

            setIsLoading(false);
        }

        initDiagnostic();
    }, []);

    // Handle Escape key to close image lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveZoomImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const questions: DiagnosticQuestion[] = template?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleSelectOption = (questionId: string, optionKey: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionKey,
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (!template) return;
        setErrorMessage('');

        // Ensure all questions answered
        const unansweredCount = questions.filter((q) => !answers[q.id || q._id || '']).length;
        if (unansweredCount > 0) {
            setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
            return;
        }

        setIsSubmitting(true);

        const answerPayload = questions.map((q) => {
            const qId = q.id || q._id || '';
            return {
                questionId: qId,
                selectedOptionKey: answers[qId],
            };
        });

        try {
            if (childProfileId) {
                const res = await diagnosticApi.submitAttempt(childProfileId, {
                    templateId: template.id || template._id || '',
                    answers: answerPayload,
                });

                const attemptData: DiagnosticAttemptResult = res?.data?.attempt || res?.attempt || res?.data;

                if (attemptData) {
                    setResult(attemptData);
                } else {
                    computeLocalResult();
                }
            } else {
                computeLocalResult();
            }

            setView('result');
        } catch (err: any) {
            console.warn('API diagnostic submission error, calculating results locally:', err);
            computeLocalResult();
            setView('result');
        } finally {
            setIsSubmitting(false);
        }
    };

    const computeLocalResult = () => {
        let correctCount = 0;
        questions.forEach((q) => {
            const qId = q.id || q._id || '';
            const selectedKey = answers[qId];
            const chosenOption = q.options.find((opt) => opt.key === selectedKey);
            if (chosenOption && (chosenOption.score || 0) > 0) {
                correctCount += 1;
            }
        });

        const total = questions.length || 1;
        const percentage = Math.round((correctCount / total) * 100);
        let band = 'Rising Star';
        if (percentage >= 80) band = 'Master Learner';
        else if (percentage >= 50) band = 'Explorer';

        setResult({
            totalQuestions: total,
            totalScore: correctCount,
            maxScore: total,
            percentageScore: percentage,
            band,
            recommendation: {
                headline: `Great job! ${childName || 'Your child'} has been placed in the ${band} learning track.`,
                summary: 'Lessons and quizzes will be customized to match their learning pace.',
            },
        });
    };

    const handleFinishAndNavigate = async () => {
        await authApi.getProfile().catch(() => null);
        router.push('/home');
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white p-12 rounded-3xl border border-gray-100 shadow-md text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-brand-orange mx-auto" />
                <p className="text-gray-600 font-medium text-sm">
                    Preparing your child&apos;s diagnostic assessment...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-md space-y-8 relative">

            {/* VIEW 1: INTRO SCREEN */}
            {view === 'intro' && (
                <div className="space-y-8 text-center sm:text-left">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-peach text-brand-orange text-xs font-bold">
                            <Sparkles className="w-4 h-4" />
                            <span>Learner Placement Diagnostic</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            {template?.title || 'Academic Assessment'}
                        </h1>
                        <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                            {template?.description ||
                                `Welcome ${childName ? childName : 'learner'}! This short diagnostic assessment will help us customize your subject modules, quizzes, and learning path.`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center font-bold shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Duration</p>
                                <p className="text-sm font-bold text-gray-900">
                                    ~{template?.estimatedMinutes || 10} Minutes
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Questions</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {questions.length} Diagnostic Prompts
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Goal</p>
                                <p className="text-sm font-bold text-gray-900">Smart Band Placement</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setView('quiz')}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span>Start Assessment</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW 2: QUIZ QUESTIONS SCREEN */}
            {view === 'quiz' && currentQuestion && (
                <div className="space-y-6">

                    {/* Header Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                            <span className="text-brand-orange uppercase tracking-wider">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <span>
                                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-orange transition-all duration-300 rounded-full"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Question Prompt Card */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-5 shadow-xs">
                        {currentQuestion.skillTag && (
                            <span className="inline-block px-3 py-1 rounded-full bg-brand-peach text-brand-orange text-xs font-bold">
                                {currentQuestion.skillTag}
                            </span>
                        )}

                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                            {currentQuestion.prompt}
                        </h2>

                        {currentQuestion.helperText && (
                            <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5">
                                💡 <span>{currentQuestion.helperText}</span>
                            </p>
                        )}

                        {/* ENHANCED DIAGNOSTIC QUESTION IMAGE DISPLAY */}
                        {currentQuestion.imageUrl && !failedImages[currentQuestion.id || currentQuestion._id || ''] && (
                            <div className="pt-2">
                                <div
                                    onClick={() =>
                                        setActiveZoomImage({
                                            url: currentQuestion.imageUrl!,
                                            prompt: currentQuestion.prompt,
                                        })
                                    }
                                    className="group relative max-w-xl mx-auto rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-100/60 to-slate-200/40 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col items-center justify-center"
                                >
                                    {/* Hover Zoom Badge */}
                                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 text-xs font-bold shadow-xs flex items-center gap-1.5 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                        <ZoomIn className="w-3.5 h-3.5" />
                                        <span>Click to expand diagram</span>
                                    </div>

                                    {/* Responsive Image Display */}
                                    <div className="relative w-full max-h-64 sm:max-h-80 flex items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                                        <img
                                            src={currentQuestion.imageUrl}
                                            alt={currentQuestion.prompt || 'Question Illustration'}
                                            onError={() =>
                                                setFailedImages((prev) => ({
                                                    ...prev,
                                                    [currentQuestion.id || currentQuestion._id || '']: true,
                                                }))
                                            }
                                            className="max-h-60 sm:max-h-72 w-auto max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    </div>

                                    {/* Bottom Caption Bar */}
                                    <div className="w-full pt-2 flex items-center justify-between text-[11px] text-gray-500 font-medium px-1">
                                        <span className="flex items-center gap-1">
                                            <ImageIcon className="w-3.5 h-3.5 text-brand-orange" />
                                            <span>Diagnostic Diagram</span>
                                        </span>
                                        <span className="text-brand-orange group-hover:underline font-bold">
                                            Full Resolution Preview 🔍
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {currentQuestion.options.map((opt) => {
                            const qId = currentQuestion.id || currentQuestion._id || '';
                            const isSelected = answers[qId] === opt.key;

                            return (
                                <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => handleSelectOption(qId, opt.key)}
                                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer ${isSelected
                                        ? 'border-brand-orange bg-brand-peach/40 shadow-sm ring-2 ring-brand-orange/30'
                                        : 'border-gray-200 bg-white hover:border-brand-orange/40 hover:bg-gray-50'
                                        }`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected
                                            ? 'bg-brand-orange text-white'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                    >
                                    </div>

                                    <div className="flex-1 text-sm font-semibold text-gray-800 leading-relaxed">
                                        {opt.text}
                                    </div>

                                    {isSelected && (
                                        <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Step Controls */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNextQuestion}
                                disabled={!answers[currentQuestion.id || currentQuestion._id || '']}
                                className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                <span>Next</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmitQuiz}
                                disabled={isSubmitting || !answers[currentQuestion.id || currentQuestion._id || '']}
                                className="px-7 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Submit <span className="hidden md:inline">Assessment</span></span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* VIEW 3: RESULTS SCREEN */}
            {view === 'result' && (
                <div className="space-y-8 text-center sm:text-left">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            <Sparkles className="w-4 h-4" />
                            <span>Diagnostic Assessment Complete</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Congratulations, {childName || 'Learner'}!
                        </h1>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {result?.recommendation?.headline ||
                                `Your placement score has been evaluated and your customized learning dashboard is ready.`}
                        </p>
                    </div>

                    {/* Result Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        {/* Score Circle Card */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-peach-50 border border-brand-orange/20 text-center space-y-2">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Overall Score</p>
                            <div className="text-4xl sm:text-5xl font-black text-brand-orange">
                                {result?.percentageScore ?? 80}%
                            </div>
                            <p className="text-xs text-gray-600 font-semibold">
                                {result?.totalScore ?? 4} / {result?.totalQuestions ?? 5} Correct
                            </p>
                        </div>

                        {/* Assigned Band Card */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 text-center space-y-2">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Learning Band</p>
                            <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 capitalize">
                                {result?.band?.replaceAll('_', ' ') || 'Rising Star'}
                            </div>
                            <p className="text-xs text-purple-600 font-semibold">
                                Tailored Curriculum Assigned
                            </p>
                        </div>

                        {/* Status Card */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 text-center space-y-2">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Next Step</p>
                            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">
                                Ready to Learn
                            </div>
                            <p className="text-xs text-blue-600 font-semibold">
                                Dashboard Unlocked
                            </p>
                        </div>
                    </div>

                    {/* Recommendation Box */}
                    {result?.recommendation?.summary && (
                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                            <div className="space-y-1 text-left">
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Learning Recommendation</p>
                                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                    {result.recommendation.summary}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Finish CTA */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="button"
                            onClick={handleFinishAndNavigate}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span>Go to Learner Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            )}

            {/* LIGHTBOX / ZOOM MODAL FOR DIAGNOSTIC IMAGES */}
            {activeZoomImage && (
                <div
                    onClick={() => setActiveZoomImage(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col space-y-4"
                    >
                        {/* Lightbox Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
                                <Maximize2 className="w-4 h-4 text-brand-orange" />
                                <span>{activeZoomImage.prompt || 'Diagnostic Diagram Zoom'}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveZoomImage(null)}
                                className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Lightbox Image Container */}
                        <div className="flex-1 min-h-0 flex items-center justify-center bg-slate-900/5 rounded-2xl p-2 sm:p-4 overflow-auto">
                            <img
                                src={activeZoomImage.url}
                                alt="Diagnostic Diagram Zoom"
                                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-md"
                            />
                        </div>

                        {/* Lightbox Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-1">
                            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border text-gray-700 font-mono">Esc</kbd> or click outside to close</span>
                            <button
                                type="button"
                                onClick={() => setActiveZoomImage(null)}
                                className="text-brand-orange font-bold hover:underline cursor-pointer"
                            >
                                Close Modal
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
