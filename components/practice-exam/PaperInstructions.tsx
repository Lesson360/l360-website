'use client';

import React from 'react';
import { ArrowLeft, Clock, FileText, Loader2, Play, Target } from 'lucide-react';
import { Paper } from '@/lib/api/test-driller';

interface PaperInstructionsProps {
    paper: Paper;
    isStarting: boolean;
    onBack: () => void;
    onStart: () => void;
}

const INSTRUCTIONS = [
    'Read Each Question Carefully Before Selecting Your Answer.',
    'Do Not Exit The Exam While It Is In Progress, Leaving The Exam Away Automatically Submits On End Your Attempt.',
    'Manage Your Time Wisely.',
    'Answer Every Question.'
];

export function PaperInstructions({ paper, isStarting, onBack, onStart }: PaperInstructionsProps) {
    return (
        <div className="max-w-xl mx-auto space-y-5">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF4801] transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Papers</span>
            </button>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#4A154B] to-[#2D0C2E] text-white p-6 space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                        {paper.year ? `${paper.year} Edition` : 'Practice Exam'}
                    </p>
                    <h2 className="text-xl font-black">{paper.title}</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stat Pills */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-[#FF4801] shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Questions</p>
                                <p className="text-sm font-black text-gray-900">{paper.totalQuestions}</p>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Duration</p>
                                <p className="text-sm font-black text-gray-900">{paper.durationMinutes} Mins</p>
                            </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 col-span-2">
                            <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Total Marks</p>
                                <p className="text-sm font-black text-gray-900">{paper.totalMarks} Marks &middot; {paper.attemptMode === 'practice' ? 'Practice Mode' : 'Exam Mode'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF4801] flex items-center justify-center text-xs">!</span>
                            Instructions
                        </h3>
                        <ul className="space-y-2.5">
                            {INSTRUCTIONS.map((line, idx) => (
                                <li key={idx} className="text-xs text-gray-600 font-medium leading-relaxed flex gap-2">
                                    <span className="text-[#FF4801] font-black shrink-0">&bull;</span>
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        type="button"
                        disabled={isStarting}
                        onClick={onStart}
                        className="w-full py-3.5 rounded-2xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-sm shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isStarting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Starting Exam...</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                <span>Start</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
