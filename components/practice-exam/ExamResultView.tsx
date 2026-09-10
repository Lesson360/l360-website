'use client';

import React from 'react';
import { SubjectExam, ExamResultSummary } from '@/lib/data/practiceExamsData';
import {
    ClipboardList,
    Trophy,
    Clock,
    FileCheck2,
    Check,
    Download,
    Eye,
    LayoutDashboard
} from 'lucide-react';

interface ExamResultViewProps {
    subject: SubjectExam;
    result: ExamResultSummary;
    onReviewAnswers: () => void;
    onBackToDashboard: () => void;
}

export function ExamResultView({
    subject,
    result,
    onReviewAnswers,
    onBackToDashboard
}: ExamResultViewProps) {
    const handleDownloadResult = () => {
        // Create printable summary or window print trigger
        window.print();
    };

    const minutesTaken = Math.max(1, Math.ceil(result.timeTakenSeconds / 60));

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-10">

            {/* Center Top Checkmark Badge matching Image 3 */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative flex items-center justify-center">
                    {/* Outer animated rings */}
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-emerald-100/60 animate-pulse flex items-center justify-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-200/80 flex items-center justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-lg">
                                <Check className="w-10 h-10 stroke-[3.5]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Exam Completed!
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                    {subject.title} Practice Test Summary
                </p>
            </div>

            {/* Summary Metrics Card Container matching Image 3 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                    {/* 1. Score Column */}
                    <div className="flex flex-col items-center text-center space-y-2 pt-4 sm:pt-0 sm:px-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Score
                        </span>
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-[#10B981]">
                            {result.scorePercentage}%
                        </div>
                        <div className="text-xs text-gray-500 font-semibold">
                            {result.correctCount}/{result.totalQuestions}
                        </div>
                    </div>

                    {/* 2. Result Column */}
                    <div className="flex flex-col items-center text-center space-y-2 pt-4 sm:pt-0 sm:px-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Result
                        </span>
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className={`text-2xl sm:text-3xl font-extrabold ${result.passed ? 'text-[#2563EB]' : 'text-red-600'}`}>
                            {result.passed ? 'Passed' : 'Failed'}
                        </div>
                        <div className="text-xs text-gray-500 font-semibold">
                            {result.passed ? 'Well Done!' : 'Keep Practicing!'}
                        </div>
                    </div>

                    {/* 3. Time Taken Column */}
                    <div className="flex flex-col items-center text-center space-y-2 pt-4 sm:pt-0 sm:px-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Time Taken
                        </span>
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">
                            {minutesTaken} Min
                        </div>
                        <div className="text-xs text-gray-500 font-semibold">
                            Out Of {result.totalTimeMinutes}mins
                        </div>
                    </div>

                    {/* 4. Questions Column */}
                    <div className="flex flex-col items-center text-center space-y-2 pt-4 sm:pt-0 sm:px-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Questions
                        </span>
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center mb-1">
                            <FileCheck2 className="w-6 h-6" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-[#EA580C]">
                            {result.attemptedCount}
                        </div>
                        <div className="text-xs text-gray-500 font-semibold">
                            Attempted
                        </div>
                    </div>

                </div>
            </div>

            {/* Action Buttons Row matching Image 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                {/* 1. Review Answers */}
                <button
                    type="button"
                    onClick={onReviewAnswers}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-[#E5E7EB] hover:bg-gray-300 text-gray-900 font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    <span>Review Answers</span>
                </button>

                {/* 2. Download Result */}
                <button
                    type="button"
                    onClick={handleDownloadResult}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-[#E5E7EB] hover:bg-gray-300 text-gray-900 font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    <span>Download Result</span>
                </button>

                {/* 3. Back To Dashboard */}
                <button
                    type="button"
                    onClick={onBackToDashboard}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#FF4801] hover:bg-[#e03f00] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Back To Dashboard</span>
                </button>
            </div>
        </div>
    );
}
