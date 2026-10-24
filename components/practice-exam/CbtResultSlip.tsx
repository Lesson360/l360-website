'use client';

import React, { useState } from 'react';
import { ArrowLeft, Lock, Printer, RotateCcw } from 'lucide-react';
import { CbtResult, CbtReviewItem, formatClock, isAnswered } from '@/lib/practice-exam/cbt';

interface CbtResultSlipProps {
    result: CbtResult;
    candidateName: string;
    onNewTest: () => void;
    onBackToCatalog: () => void;
}

function describeSelection(item: CbtReviewItem): string {
    if (!isAnswered(item.selected)) return '—';
    if (item.question.type === 'short_text') return item.selected[0];
    return item.selected
        .map((key) => {
            const option = item.question.options.find((o) => o.key === key);
            return option ? `${option.label}. ${option.text}` : key;
        })
        .join(', ');
}

function describeCorrect(item: CbtReviewItem): string {
    if (item.question.type === 'short_text') return (item.correctTextAnswers || []).join(', ') || '—';
    return item.correctKeys
        .map((key) => {
            const option = item.question.options.find((o) => o.key === key);
            return option ? `${option.label}. ${option.text}` : key;
        })
        .join(', ') || '—';
}

function StatusPill({ item }: { item: CbtReviewItem }) {
    if (!isAnswered(item.selected)) {
        return <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Not answered</span>;
    }
    return item.isCorrect
        ? <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Correct</span>
        : <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Wrong</span>;
}

export function CbtResultSlip({ result, candidateName, onNewTest, onBackToCatalog }: CbtResultSlipProps) {
    const [wrongOnly, setWrongOnly] = useState(false);

    const wrongCount = Math.max(0, result.attemptedCount - result.totalCorrect);
    const unansweredCount = Math.max(0, result.totalQuestions - result.attemptedCount);
    const items = (result.review || []).filter((item) => !wrongOnly || !item.isCorrect);

    return (
        <div className="max-w-5xl mx-auto space-y-5">
            <button
                type="button"
                onClick={onBackToCatalog}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF4801] transition-colors print:hidden"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Test Drillers</span>
            </button>

            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#FF4801] text-white grid place-items-center font-mono font-bold text-xs">L360</div>
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900">Result slip</h1>
                    <p className="text-xs text-gray-500">
                        {candidateName} · {result.title} · {result.submittedAt.toLocaleString()}
                    </p>
                </div>
            </div>

            {result.submissionReason === 'time_expired' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-800">
                    Time ran out, so the test was submitted automatically.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                    <div className="flex items-baseline flex-wrap gap-2">
                        <span className="font-mono text-5xl font-semibold text-gray-900 leading-none">{result.percentage}</span>
                        <span className="text-sm text-gray-500">out of 100</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Scored out of 100, as in the UTME. Raw score: {result.score} / {result.totalScore} marks.
                    </p>
                    <div className="mt-5 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${result.percentage >= 50 ? 'bg-emerald-600' : 'bg-[#FF4801]'}`}
                            style={{ width: `${Math.min(100, Math.max(0, result.percentage))}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                    <h2 className="text-sm font-bold text-gray-900 mb-3">Breakdown</h2>
                    <ul className="space-y-2.5 text-sm">
                        {[
                            ['Correct', `${result.totalCorrect} / ${result.totalQuestions}`],
                            ['Wrong', String(wrongCount)],
                            ['Not answered', String(unansweredCount)],
                            ['Time used', result.timeUsedSeconds !== null
                                ? `${formatClock(result.timeUsedSeconds)}${result.durationMinutes ? ` of ${result.durationMinutes} min` : ''}`
                                : '—'],
                            ['Mode', result.attemptMode === 'exam' ? 'Exam' : 'Practice']
                        ].map(([label, value]) => (
                            <li key={label} className="flex justify-between gap-3 border-b border-dashed border-gray-200 pb-2">
                                <span className="text-gray-600">{label}</span>
                                <b className="font-mono font-semibold text-gray-900">{value}</b>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-5 print:hidden">
                        <button
                            type="button"
                            onClick={onNewTest}
                            className="px-4 py-2.5 rounded-xl bg-[#FF4801] hover:bg-[#e03f00] text-white font-bold text-sm flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-4 h-4" /> New test
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm flex items-center gap-1.5"
                        >
                            <Printer className="w-4 h-4" /> Print
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h2 className="text-base font-bold text-gray-900">Corrections and solutions</h2>
                    {result.review && (
                        <button
                            type="button"
                            onClick={() => setWrongOnly((v) => !v)}
                            aria-pressed={wrongOnly}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs print:hidden"
                        >
                            {wrongOnly ? 'Show all questions' : 'Show wrong answers only'}
                        </button>
                    )}
                </div>

                {!result.review ? (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-600">
                        <Lock className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                        <p>
                            {result.attemptMode === 'exam'
                                ? 'This is an exam-mode paper, so answers and solutions are not released. Practice-mode papers show full corrections.'
                                : 'Corrections are not available for this attempt.'}
                        </p>
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-sm text-gray-500">Nothing to correct. Every answer was right.</p>
                ) : (
                    <div>
                        {items.map((item) => {
                            const number = (result.review || []).indexOf(item) + 1;
                            return (
                                <div key={item.question.id} className="border-t border-gray-100 py-4 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="font-bold text-gray-700">Q{number}</span>
                                        <StatusPill item={item} />
                                    </div>
                                    {item.question.helperText && (
                                        <p className="text-xs italic text-gray-500 whitespace-pre-line">{item.question.helperText}</p>
                                    )}
                                    <p className="text-[15px] text-gray-900 whitespace-pre-line">{item.question.prompt}</p>
                                    <p className="text-xs text-gray-600">
                                        Your answer: <b className="text-gray-900">{describeSelection(item)}</b>
                                        <span className="mx-1.5">·</span>
                                        Correct: <b className="text-emerald-700">{describeCorrect(item)}</b>
                                    </p>
                                    {item.explanation && (
                                        <div className="text-sm text-gray-700 bg-gray-50 border-l-[3px] border-[#FF4801] rounded-r-lg px-3 py-2">
                                            {item.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
