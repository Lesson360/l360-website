import React from 'react';
import { Library } from 'lucide-react';

export default function MyLibraryPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                My Library
            </h1>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-md text-center space-y-4 max-w-xl">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Library className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Saved Lessons & Worksheets</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    View saved video bookmarks, downloaded worksheets, and completed quiz history.
                </p>
            </div>
        </div>
    );
}
