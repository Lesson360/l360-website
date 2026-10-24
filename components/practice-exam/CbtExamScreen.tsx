'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Calculator,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Flag,
    Loader2,
    LogOut,
    RefreshCw,
    Send
} from 'lucide-react';
import {
    CbtAnswerMap,
    CbtQuestion,
    countAnswered,
    formatClock,
    isAnswered,
    OPTION_LETTERS
} from '@/lib/practice-exam/cbt';
import { CbtCalculator, CbtCalculatorHandle } from './CbtCalculator';

const LOW_TIME_SECONDS = 300;

interface CbtExamScreenProps {
    candidateName: string;
    paperTitle: string;
    paperMeta?: string;
    questions: CbtQuestion[];
    answers: CbtAnswerMap;
    onAnswer: (questionId: string, values: string[]) => void;
    // Local-clock deadline derived from the server's remainingTimeSeconds. null = untimed.
    deadlineMs: number | null;
    startedAtMs: number;
    onTimeUp: () => void;
    onSubmit: () => void;
    onExit: () => void;
    exitMessage: string;
    isSubmitting: boolean;
    saveStatus?: 'saved' | 'saving' | 'error';
    // Flags are not stored by the backend; keep them on this device per attempt.
    flagStorageKey?: string;
}

function readFlags(key?: string): Record<string, boolean> {
    if (!key) return {};
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function initials(name: string): string {
    const letters = name.trim().split(/\s+/).map((w) => w[0] || '').join('');
    return (letters.slice(0, 2) || 'L3').toUpperCase();
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded border border-gray-300 border-b-2 bg-gray-50 text-gray-700">
            {children}
        </kbd>
    );
}

export function CbtExamScreen({
    candidateName,
    paperTitle,
    paperMeta,
    questions,
    answers,
    onAnswer,
    deadlineMs,
    startedAtMs,
    onTimeUp,
    onSubmit,
    onExit,
    exitMessage,
    isSubmitting,
    saveStatus,
    flagStorageKey
}: CbtExamScreenProps) {
    const [current, setCurrent] = useState(0);
    const [flags, setFlags] = useState<Record<string, boolean>>({});
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [showExit, setShowExit] = useState(false);
    const [now, setNow] = useState(() => Date.now());

    const calculatorRef = useRef<CbtCalculatorHandle>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const confirmRef = useRef<HTMLButtonElement>(null);
    const timeUpFiredRef = useRef(false);

    const question = questions[current];
    const total = questions.length;
    const answeredCount = countAnswered(answers);
    const flaggedCount = questions.filter((q) => flags[q.id]).length;

    // ---- Timer: display only; the backend's expiresAt is the source of truth ----
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 500);
        return () => clearInterval(id);
    }, []);

    const remainingSeconds = deadlineMs === null ? null : Math.max(0, (deadlineMs - now) / 1000);

    useEffect(() => {
        if (remainingSeconds === null) return;
        if (remainingSeconds > 0) {
            timeUpFiredRef.current = false;
            return;
        }
        if (!timeUpFiredRef.current) {
            timeUpFiredRef.current = true;
            setShowSubmit(false);
            onTimeUp();
        }
    }, [remainingSeconds, onTimeUp]);

    // Read stored flags after mount (localStorage is unavailable during server render).
    useEffect(() => {
        setFlags(readFlags(flagStorageKey));
    }, [flagStorageKey]);

    useEffect(() => {
        if (showSubmit) confirmRef.current?.focus();
    }, [showSubmit]);

    // ---- Actions ----
    const goTo = useCallback((index: number) => {
        setCurrent(Math.min(Math.max(index, 0), total - 1));
        const top = cardRef.current?.getBoundingClientRect().top ?? 0;
        if (top < 0) cardRef.current?.scrollIntoView({ block: 'start' });
    }, [total]);

    const pick = useCallback((optionIndex: number) => {
        if (!question || question.type === 'short_text') return;
        const option = question.options[optionIndex];
        if (!option) return;
        if (question.type === 'multiple_choice') {
            const selected = answers[question.id] || [];
            const next = selected.includes(option.key)
                ? selected.filter((k) => k !== option.key)
                : [...selected, option.key];
            onAnswer(question.id, next);
        } else {
            onAnswer(question.id, [option.key]);
        }
    }, [question, answers, onAnswer]);

    const toggleFlag = useCallback(() => {
        if (!question) return;
        const next = { ...flags, [question.id]: !flags[question.id] };
        setFlags(next);
        if (!flagStorageKey) return;
        try {
            localStorage.setItem(flagStorageKey, JSON.stringify(next));
        } catch {
            // Flags are a convenience; losing them is harmless.
        }
    }, [question, flags, flagStorageKey]);

    const confirmSubmit = useCallback(() => {
        setShowSubmit(false);
        onSubmit();
    }, [onSubmit]);

    // ---- Keyboard, as in the CBT centre ----
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey || isSubmitting) return;
            const key = e.key.toLowerCase();
            const target = e.target as HTMLElement | null;
            const typing = !!target && /^(input|textarea|select)$/i.test(target.tagName);

            if (showSubmit) {
                if (key === 'y') { e.preventDefault(); confirmSubmit(); }
                if (key === 'escape' || key === 'n') setShowSubmit(false);
                return;
            }
            if (showExit) {
                if (key === 'escape') setShowExit(false);
                return;
            }
            if (typing) {
                if (key === 'escape') target?.blur();
                return;
            }
            if (showCalculator && /^[0-9.+\-*/()=]$|^enter$|^backspace$/.test(key)) {
                e.preventDefault();
                const mapped: Record<string, string> = { enter: '=', backspace: '⌫', '*': '×', '/': '÷', '-': '−' };
                calculatorRef.current?.press(mapped[key] || key);
                return;
            }
            const letterIndex = OPTION_LETTERS.toLowerCase().indexOf(key);
            if (key.length === 1 && letterIndex >= 0 && question && letterIndex < question.options.length) {
                e.preventDefault();
                pick(letterIndex);
            } else if (key === 'n' || key === 'arrowright') {
                e.preventDefault();
                goTo(current + 1);
            } else if (key === 'p' || key === 'arrowleft') {
                e.preventDefault();
                goTo(current - 1);
            } else if (key === 'f') {
                toggleFlag();
            } else if (key === 's') {
                e.preventDefault();
                setShowSubmit(true);
            } else if (key === 'k') {
                setShowCalculator((v) => !v);
            } else if (key === 'escape') {
                setShowCalculator(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [showSubmit, showExit, showCalculator, isSubmitting, question, current, pick, goTo, toggleFlag, confirmSubmit]);

    const timerLabel = useMemo(() => {
        if (remainingSeconds !== null) return formatClock(remainingSeconds);
        return formatClock((now - startedAtMs) / 1000);
    }, [remainingSeconds, now, startedAtMs]);
    const lowTime = remainingSeconds !== null && remainingSeconds <= LOW_TIME_SECONDS;

    if (!question) {
        return (
            <div className="p-12 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                <p className="text-base font-bold text-gray-800">This paper has no questions yet.</p>
                <button
                    type="button"
                    onClick={onExit}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
                >
                    Go back
                </button>
            </div>
        );
    }

    const selected = answers[question.id] || [];
    const unanswered = total - answeredCount;

    return (
        <div className="space-y-4">
            {/* Candidate bar */}
            <div className="bg-gradient-to-r from-[#4A154B] to-[#2D0C2E] text-white rounded-2xl px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-12 rounded-md bg-white/15 grid place-items-center font-black text-base shrink-0">
                        {initials(candidateName)}
                    </div>
                    <div className="min-w-0 leading-tight">
                        <p className="font-bold text-sm truncate">{candidateName}</p>
                        <p className="text-[11px] text-purple-200 font-mono">Candidate</p>
                    </div>
                </div>
                <div className="min-w-0 leading-tight">
                    <p className="font-bold text-sm truncate">{paperTitle}</p>
                    <p className="text-[11px] text-purple-200">
                        {paperMeta ? `${paperMeta} · ` : ''}{answeredCount} of {total} answered
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    {saveStatus && (
                        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-purple-100">
                            {saveStatus === 'saving' && <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving…</>}
                            {saveStatus === 'saved' && <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Saved</>}
                            {saveStatus === 'error' && <span className="text-amber-300">Not saved, retrying</span>}
                        </span>
                    )}
                    <div
                        className={`font-mono text-2xl font-semibold tracking-wide px-3 py-1 rounded-lg ${lowTime ? 'bg-red-600 text-white' : 'bg-black/25'}`}
                        title={remainingSeconds === null ? 'Untimed: time elapsed' : 'Time remaining'}
                        aria-live="off"
                    >
                        {timerLabel}
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowExit(true)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Exit exam"
                        title="Exit exam"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
                {/* Question card */}
                <div ref={cardRef} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs min-w-0 scroll-mt-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                        <p className="text-base font-extrabold text-gray-900">
                            Question {current + 1} of {total}
                        </p>
                        <div className="flex items-center gap-2">
                            {flags[question.id] && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                    <Flag className="w-3 h-3" /> Flagged
                                </span>
                            )}
                            <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                {question.marks} mark{question.marks === 1 ? '' : 's'}
                            </span>
                        </div>
                    </div>

                    {question.helperText && (
                        <p className="text-sm italic font-semibold text-gray-700 mb-3 whitespace-pre-line">{question.helperText}</p>
                    )}
                    {question.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={question.imageUrl}
                            alt={question.imageAltText || `Figure for question ${current + 1}`}
                            className="max-h-72 w-auto rounded-xl border border-gray-200 mb-4"
                        />
                    )}
                    <p className="text-[17px] leading-relaxed text-gray-900 font-medium whitespace-pre-line mb-4">
                        {question.prompt}
                    </p>

                    {question.type === 'short_text' ? (
                        <textarea
                            value={selected[0] || ''}
                            onChange={(e) => onAnswer(question.id, [e.target.value])}
                            rows={3}
                            placeholder="Type your answer"
                            className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF4801] focus:border-[#FF4801] outline-none"
                        />
                    ) : (
                        <div className="space-y-2">
                            {question.type === 'multiple_choice' && (
                                <p className="text-xs font-semibold text-gray-500">Select all that apply.</p>
                            )}
                            {question.options.map((option, idx) => {
                                const isSelected = selected.includes(option.key);
                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => pick(idx)}
                                        aria-pressed={isSelected}
                                        className={`w-full flex items-start gap-3 text-left p-3 rounded-xl border transition-colors ${isSelected
                                            ? 'border-[#FF4801] bg-orange-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span
                                            className={`w-7 h-7 shrink-0 grid place-items-center font-mono text-xs font-bold border-[1.5px] ${question.type === 'multiple_choice' ? 'rounded-md' : 'rounded-full'} ${isSelected
                                                ? 'bg-[#FF4801] border-[#FF4801] text-white'
                                                : 'border-gray-300 text-gray-700'
                                                }`}
                                        >
                                            {option.label}
                                        </span>
                                        <span className="text-sm text-gray-900 pt-1">{option.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => goTo(current - 1)}
                            disabled={current === 0}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm disabled:opacity-40 flex items-center gap-1.5"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous (P)
                        </button>
                        <button
                            type="button"
                            onClick={toggleFlag}
                            className={`px-4 py-2.5 rounded-xl border font-bold text-sm flex items-center gap-1.5 ${flags[question.id]
                                ? 'border-amber-300 bg-amber-50 text-amber-800'
                                : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                                }`}
                        >
                            <Flag className="w-4 h-4" /> {flags[question.id] ? 'Unflag' : 'Flag'} (F)
                        </button>
                        <span className="flex-1" />
                        <button
                            type="button"
                            onClick={() => (current === total - 1 ? setShowSubmit(true) : goTo(current + 1))}
                            className="px-5 py-2.5 rounded-xl bg-[#FF4801] hover:bg-[#e03f00] text-white font-bold text-sm flex items-center gap-1.5"
                        >
                            {current === total - 1 ? 'Finish' : 'Next (N)'} <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Side: palette + tools */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-900">Questions</h3>
                            <span className="text-xs font-semibold text-gray-500">{answeredCount}/{total}</span>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(36px,1fr))] gap-1.5 max-h-80 overflow-y-auto p-0.5">
                            {questions.map((q, idx) => {
                                const done = isAnswered(answers[q.id]);
                                return (
                                    <button
                                        key={q.id}
                                        type="button"
                                        onClick={() => goTo(idx)}
                                        aria-label={`Question ${idx + 1}${done ? ', answered' : ''}${flags[q.id] ? ', flagged' : ''}`}
                                        aria-current={idx === current ? 'true' : undefined}
                                        className={`relative font-mono text-xs font-semibold py-1.5 rounded-md border ${done
                                            ? 'bg-emerald-600 border-emerald-600 text-white'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                            } ${flags[q.id] ? 'shadow-[inset_0_-3px_0_#d97706]' : ''} ${idx === current ? 'ring-2 ring-gray-900 ring-offset-1' : ''}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3 text-[11px] font-medium text-gray-500">
                            <span className="flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-600" /> Answered</span>
                            <span className="flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-50 border border-gray-300" /> Not answered</span>
                            <span className="flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-600" /> Flagged</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCalculator((v) => !v)}
                                aria-pressed={showCalculator}
                                className="px-3 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm flex items-center justify-center gap-1.5"
                            >
                                <Calculator className="w-4 h-4" /> Calculator
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowSubmit(true)}
                                disabled={isSubmitting}
                                className="px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {isSubmitting ? 'Submitting' : 'Submit'}
                            </button>
                        </div>
                        <p className="hidden lg:block text-[11px] text-gray-500 leading-loose">
                            <Kbd>A</Kbd>–<Kbd>D</Kbd> answer · <Kbd>N</Kbd>/<Kbd>P</Kbd> move · <Kbd>F</Kbd> flag ·{' '}
                            <Kbd>S</Kbd> submit · <Kbd>K</Kbd> calculator
                        </p>
                    </div>
                </div>
            </div>

            {showCalculator && <CbtCalculator ref={calculatorRef} onClose={() => setShowCalculator(false)} />}

            {showSubmit && (
                <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-4" onClick={() => setShowSubmit(false)}>
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cbt-submit-title"
                        className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="cbt-submit-title" className="text-lg font-extrabold text-gray-900">Submit your test?</h2>
                        <p className="text-sm text-gray-600">
                            {unanswered
                                ? `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. `
                                : 'All questions answered. '}
                            {flaggedCount ? `${flaggedCount} still flagged for review. ` : ''}
                            Once submitted, you cannot change any answer.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowSubmit(false)}
                                className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm"
                            >
                                Go back (Esc)
                            </button>
                            <button
                                ref={confirmRef}
                                type="button"
                                onClick={confirmSubmit}
                                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm"
                            >
                                Yes, submit (Y)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExit && (
                <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-4" onClick={() => setShowExit(false)}>
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cbt-exit-title"
                        className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="cbt-exit-title" className="text-lg font-extrabold text-gray-900">Leave the exam?</h2>
                        <p className="text-sm text-gray-600">{exitMessage}</p>
                        <div className="flex flex-wrap gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowExit(false)}
                                className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm"
                            >
                                Stay
                            </button>
                            <button
                                type="button"
                                onClick={onExit}
                                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm"
                            >
                                Leave exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
