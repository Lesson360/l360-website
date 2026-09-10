'use client';

import React from 'react';
import { SubjectExam, PRACTICE_EXAMS } from '@/lib/data/practiceExamsData';
import {
    Atom,
    FlaskConical,
    BookOpen,
    Landmark,
    Dna,
    TrendingUp,
    Building2,
    Sparkles,
    Play
} from 'lucide-react';

interface ExamSelectionGridProps {
    onSelectSubject: (subject: SubjectExam) => void;
}

export function ExamSelectionGrid({ onSelectSubject }: ExamSelectionGridProps) {
    // Custom SVG Icon for Math Square Root Formula matching Image 1
    const MathIcon = () => (
        <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12h3l3 8 4-16h8" />
            <path d="M17 11l4 4" />
            <path d="M21 11l-4 4" />
        </svg>
    );

    const getSubjectIcon = (type: SubjectExam['iconType']) => {
        switch (type) {
            case 'math':
                return <MathIcon />;
            case 'physics':
                return <Atom className="w-8 h-8 text-white" />;
            case 'chemistry':
                return <FlaskConical className="w-8 h-8 text-white" />;
            case 'english':
                return <BookOpen className="w-8 h-8 text-white" />;
            case 'civic':
                return <Landmark className="w-8 h-8 text-white" />;
            case 'biology':
                return <Dna className="w-8 h-8 text-white" />;
            case 'economics':
                return <TrendingUp className="w-8 h-8 text-white" />;
            case 'government':
                return <Building2 className="w-8 h-8 text-white" />;
            default:
                return <Sparkles className="w-8 h-8 text-white" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Subject Grid matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRACTICE_EXAMS.map((subject) => (
                    <div
                        key={subject.id}
                        className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-200 group"
                    >
                        {/* Circle Icon Badge */}
                        <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-sm transform group-hover:scale-105 transition-transform duration-200 ${subject.iconBgColor}`}
                        >
                            {getSubjectIcon(subject.iconType)}
                        </div>

                        {/* Subject Title */}
                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1.5">
                            {subject.title}
                        </h3>

                        {/* Topics Summary Subtitle */}
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-5 max-w-[200px]">
                            {subject.subtitle}
                        </p>

                        <div className="mt-auto w-full space-y-3">
                            {/* Practice Questions Count Badge */}
                            <div className="w-full bg-[#261B40] text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-xs">
                                <span>{subject.totalQuestions} Practice Questions</span>
                            </div>

                            {/* Start Button matching light blue design in Image 1 */}
                            <button
                                type="button"
                                onClick={() => onSelectSubject(subject)}
                                className="w-full bg-[#CBE9FF] hover:bg-[#b5e0ff] active:scale-[0.98] text-gray-900 font-bold text-sm py-2.5 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                            >
                                <span>Start</span>
                                <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
