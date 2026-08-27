import React from 'react';
import { FileText } from 'lucide-react';

export default function PracticeExamPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                Practice Exam
            </h1>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-md text-center space-y-4 max-w-xl">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Practice Exam Center</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Access subject mock exams, past questions, and real-time timed test simulations.
                </p>
            </div>
        </div>
    );
}
