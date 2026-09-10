'use client';

import React, { useState } from 'react';
import { SubjectExam, UserAnswerMap } from '@/lib/data/practiceExamsData';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, HelpCircle, LayoutDashboard } from 'lucide-react';

interface ExamReviewViewProps {
    subject: SubjectExam;
    userAnswers: UserAnswerMap;
    onBackToResult: () => void;
    onBackToDashboard: () => void;
}

export function ExamReviewView({
    subject,
    userAnswers,
    onBackToResult,
    onBackToDashboard
}: ExamReviewViewProps) {
    // Flatten all questions across topics
    const allQuestions = subject.topics.flatMap((t) => t.questions);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentQuestion = allQuestions[currentIndex];
    const userAnswerId = userAnswers[currentQuestion.id];
    const isCorrect = userAnswerId === currentQuestion.correctOptionId;
    const topic = subject.topics.find((t) => t.id === currentQuestion.topicId);

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header with Navigation controls */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBackToResult}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-base font-extrabold text-gray-900">
                            Answer Review — {subject.title}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">
                            Topic: {topic?.name || 'General'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onBackToDashboard}
                        className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </div>

            {/* Review Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">

                {/* Question Status Banner */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 text-sm font-bold">
                        <span className="text-gray-900">Question {currentIndex + 1} of {allQuestions.length}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{currentQuestion.marks} Marks</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {userAnswerId === undefined ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                <HelpCircle className="w-3.5 h-3.5" /> Skipped / Unanswered
                            </span>
                        ) : isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer (+{currentQuestion.marks})
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                                <XCircle className="w-3.5 h-3.5" /> Incorrect Answer (0)
                            </span>
                        )}
                    </div>
                </div>

                {/* Question Statement */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900">
                        {currentQuestion.number}. {currentQuestion.text}
                    </h3>
                    {currentQuestion.expression && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-mono text-base font-bold text-gray-900">
                            {currentQuestion.expression}
                        </div>
                    )}
                </div>

                {/* Options List with Highlighted Correct / Selected Answers */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                        const isUserChoice = userAnswerId === option.id;
                        const isCorrectChoice = option.id === currentQuestion.correctOptionId;

                        let styleClasses = 'border-gray-200 bg-white text-gray-700';
                        if (isCorrectChoice) {
                            styleClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400';
                        } else if (isUserChoice && !isCorrectChoice) {
                            styleClasses = 'border-red-400 bg-red-50 text-red-950 font-medium';
                        }

                        return (
                            <div
                                key={option.id}
                                className={`p-4 rounded-xl border transition-all flex items-center justify-between ${styleClasses}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                                        {option.label}
                                    </span>
                                    <span className="text-sm">{option.text}</span>
                                </div>

                                <div>
                                    {isCorrectChoice && (
                                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-md">
                                            Correct Choice
                                        </span>
                                    )}
                                    {isUserChoice && !isCorrectChoice && (
                                        <span className="text-xs font-extrabold text-red-600 bg-red-100 px-2.5 py-1 rounded-md">
                                            Your Answer
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Explanation Box */}
                {currentQuestion.explanation && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-sm text-blue-900">
                        <span className="font-extrabold text-xs text-blue-700 block uppercase tracking-wider">
                            Explanation & Solution:
                        </span>
                        <p className="leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm disabled:opacity-40 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous Question</span>
                    </button>

                    <button
                        type="button"
                        disabled={currentIndex === allQuestions.length - 1}
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        className="px-5 py-2.5 rounded-xl bg-[#CBE9FF] hover:bg-[#b5e0ff] text-gray-900 font-bold text-sm disabled:opacity-40 flex items-center gap-2"
                    >
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
