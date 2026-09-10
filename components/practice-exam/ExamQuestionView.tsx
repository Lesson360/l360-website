'use client';

import React, { useState, useEffect } from 'react';
import { SubjectExam, Topic, Question, UserAnswerMap } from '@/lib/data/practiceExamsData';
import {
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    Clock,
    Award,
    HelpCircle,
    CheckCircle2,
    Send
} from 'lucide-react';

interface ExamQuestionViewProps {
    subject: SubjectExam;
    userAnswers: UserAnswerMap;
    onAnswerSelect: (questionId: string, optionId: string) => void;
    onSubmitExam: () => void;
    onBackToSelection: () => void;
    elapsedSeconds: number;
}

export function ExamQuestionView({
    subject,
    userAnswers,
    onAnswerSelect,
    onSubmitExam,
    onBackToSelection,
    elapsedSeconds
}: ExamQuestionViewProps) {
    // Current selected topic in left sidebar
    const [selectedTopicId, setSelectedTopicId] = useState<string>(
        subject.topics[0]?.id || ''
    );

    // Current topic data
    const activeTopic =
        subject.topics.find((t) => t.id === selectedTopicId) || subject.topics[0];

    // Current question index within the active topic
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    // Reset question index if active topic changes
    const handleSelectTopic = (topicId: string) => {
        setSelectedTopicId(topicId);
        setCurrentQuestionIndex(0);
    };

    // Current question object
    const currentQuestion: Question | undefined =
        activeTopic?.questions[currentQuestionIndex];

    const totalQuestionsInTopic = activeTopic?.questions.length || 0;

    // Navigation helpers
    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestionsInTopic - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    // Format remaining time or elapsed time
    const totalDurationSeconds = (activeTopic?.durationMinutes || subject.durationMinutes) * 60;
    const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);
    const minutesLeft = Math.floor(remainingSeconds / 60);
    const secondsLeft = remainingSeconds % 60;
    const formattedTimer = `${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;

    // Confirm submit modal state
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* Top Breadcrumb Navigation matching Image 2 */}
            <div className="flex items-center justify-between">
                <nav className="flex items-center gap-2 text-sm font-semibold">
                    <button
                        type="button"
                        onClick={onBackToSelection}
                        className="text-[#FF4801] hover:underline flex items-center gap-1"
                    >
                        Practice Exam
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-[#FF4801] font-bold">{subject.title}</span>
                </nav>

                <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-[#FF4801] hover:bg-[#e03f00] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Exam</span>
                </button>
            </div>

            {/* Main Exam Grid Layout: Left Topic Sidebar + Right Question Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Sidebar: Topics Navigation matching Image 2 */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-2 shadow-xs space-y-1">
                    {/* Header Subject Title tab */}
                    <div className="p-3 border-b border-gray-100 font-extrabold text-sm text-gray-800 tracking-tight">
                        {subject.title}
                    </div>

                    {/* Topic Items List */}
                    <div className="space-y-1.5 pt-1">
                        {subject.topics.map((topic) => {
                            const isSelected = topic.id === activeTopic.id;
                            // count answered in this topic
                            const answeredCount = topic.questions.filter(
                                (q) => userAnswers[q.id] !== undefined
                            ).length;

                            return (
                                <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => handleSelectTopic(topic.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-between ${isSelected
                                        ? 'bg-[#FF4801] text-white shadow-sm'
                                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <span>{topic.name}</span>
                                    {answeredCount > 0 && (
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${isSelected
                                                ? 'bg-white/20 text-white'
                                                : 'bg-orange-100 text-[#FF4801]'
                                                }`}
                                        >
                                            {answeredCount}/{topic.questions.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Main Container */}
                <div className="lg:col-span-9 space-y-6">

                    {/* Top Dark Banner matching Image 2 */}
                    <div className="bg-[#261B40] text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold tracking-tight mb-1">
                                {activeTopic.headerTitle || activeTopic.name}
                            </h2>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium">
                                <span>{activeTopic.questionCount || totalQuestionsInTopic} Questions</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4801]" />
                                <span>{activeTopic.totalMarks} Marks</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4801]" />
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                                    {formattedTimer}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Question Card Container */}
                    {currentQuestion ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">

                            {/* Sub Meta Line: Question Index & Marks matching Image 2 */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900">
                                    <span>
                                        Question {currentQuestionIndex + 1} Of {totalQuestionsInTopic}
                                    </span>
                                    <span className="text-gray-600">
                                        {currentQuestion.marks} Marks
                                    </span>
                                </div>
                                {/* Progress line indicator */}
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#6366F1] h-full transition-all duration-300 rounded-full"
                                        style={{
                                            width: `${((currentQuestionIndex + 1) / totalQuestionsInTopic) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Question Text & Math Expression */}
                            <div className="space-y-3 pt-2">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                                    {currentQuestion.number}. {currentQuestion.text}
                                </h3>

                                {currentQuestion.expression && (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 font-mono text-base font-bold leading-relaxed">
                                        {currentQuestion.expression}
                                    </div>
                                )}
                            </div>

                            {/* Options List matching rounded white boxes in Image 2 */}
                            <div className="space-y-3 pt-2">
                                {currentQuestion.options.map((option) => {
                                    const isSelected =
                                        userAnswers[currentQuestion.id] === option.id;

                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() =>
                                                onAnswerSelect(currentQuestion.id, option.id)
                                            }
                                            className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center gap-4 group ${isSelected
                                                ? 'border-[#FF4801] bg-orange-50/30 text-gray-900 shadow-xs'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60 text-gray-800'
                                                }`}
                                        >
                                            {/* Radio Circle */}
                                            <div
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isSelected
                                                    ? 'border-[#FF4801] bg-[#FF4801]'
                                                    : 'border-gray-400 group-hover:border-gray-500 bg-white'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                )}
                                            </div>

                                            {/* Label + Text */}
                                            <span className="text-sm font-semibold">
                                                {option.label}. {option.text}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Previous & Next buttons matching Image 2 */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    disabled={currentQuestionIndex === 0}
                                    onClick={handlePrevQuestion}
                                    className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all disabled:opacity-40 flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>

                                {currentQuestionIndex < totalQuestionsInTopic - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextQuestion}
                                        className="px-6 py-2.5 rounded-xl bg-[#CBE9FF] hover:bg-[#b5e0ff] text-gray-900 font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        <span>Next</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitModal(true)}
                                        className="px-6 py-2.5 rounded-xl bg-[#FF4801] hover:bg-[#e03f00] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <span>Finish & Submit</span>
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Bottom Pagination matching Image 2 */}
                            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    type="button"
                                    disabled={currentQuestionIndex === 0}
                                    onClick={handlePrevQuestion}
                                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-40 px-2 py-1"
                                >
                                    &lt; Previous
                                </button>

                                {activeTopic.questions.map((q, idx) => {
                                    const isCurrent = idx === currentQuestionIndex;
                                    const isAnswered = userAnswers[q.id] !== undefined;

                                    return (
                                        <button
                                            key={q.id}
                                            type="button"
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${isCurrent
                                                ? 'bg-gray-900 text-white shadow-xs'
                                                : isAnswered
                                                    ? 'bg-orange-100 text-[#FF4801] border border-orange-200'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    disabled={currentQuestionIndex === totalQuestionsInTopic - 1}
                                    onClick={handleNextQuestion}
                                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-40 px-2 py-1"
                                >
                                    Next &gt;
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-gray-500">
                            No questions found in this topic.
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in duration-150">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF4801] flex items-center justify-center mx-auto shadow-inner">
                            <HelpCircle className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-extrabold text-gray-900">Submit Practice Exam?</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                You have answered {Object.keys(userAnswers).length} out of {subject.topics.reduce((acc, t) => acc + t.questions.length, 0)} total questions. Are you sure you want to finish?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all"
                            >
                                Continue Exam
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSubmitModal(false);
                                    onSubmitExam();
                                }}
                                className="flex-1 py-3 px-4 rounded-xl bg-[#FF4801] hover:bg-[#e03f00] text-white font-bold text-sm shadow-md transition-all"
                            >
                                Submit Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
