'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    ChevronDown,
    BookOpen,
    Atom,
    TrendingUp,
    Zap,
    BarChart3,
    Landmark,
    Dna,
    Sprout,
    Compass,
    Sparkles,
} from 'lucide-react';

const SUBJECTS = [
    {
        id: 'math',
        name: 'Mathematics',
        bgColor: 'bg-[#2B124C]',
        iconType: 'math_symbol',
    },
    {
        id: 'english',
        name: 'English',
        bgColor: 'bg-[#6B66FF]',
        iconType: 'text_en',
    },
    {
        id: 'literature',
        name: 'Literature',
        bgColor: 'bg-[#00B4D8]',
        icon: BookOpen,
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        bgColor: 'bg-[#8B46B5]',
        icon: Sparkles,
    },
    {
        id: 'economics',
        name: 'Economics',
        bgColor: 'bg-[#0A6C84]',
        icon: TrendingUp,
    },
    {
        id: 'physics',
        name: 'Physics',
        bgColor: 'bg-[#FF4800]',
        icon: Atom,
    },
    {
        id: 'accounting',
        name: 'Financial Accounting',
        bgColor: 'bg-[#8A75FF]',
        icon: BarChart3,
    },
    {
        id: 'government',
        name: 'Government',
        bgColor: 'bg-[#2D0C3F]',
        icon: Landmark,
    },
    {
        id: 'biology',
        name: 'Biology',
        bgColor: 'bg-[#FF00CF]',
        icon: Dna,
    },
    {
        id: 'agric',
        name: 'Agricultural Science',
        bgColor: 'bg-[#00C838]',
        icon: Sprout,
    },
    {
        id: 'geography',
        name: 'Geography',
        bgColor: 'bg-[#FFA800]',
        icon: Compass,
    },
];

export default function VideoLibraryPage() {
    const [sortBy, setSortBy] = useState('All');

    return (
        <div className="space-y-8">

            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                    Video Library
                </h1>
            </div>

            {/* Hero Banner: Image & Text Canvas */}
            <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg grid grid-cols-1 md:grid-cols-12 bg-white">
                {/* Left Side: Image of child learning */}
                <div className="md:col-span-5 relative min-h-[220px] bg-slate-100 flex items-center justify-center">
                    <img
                        src="/boy-learning.png"
                        alt="Child Learning"
                        className="w-full h-full object-cover max-h-80"
                    />
                </div>

                {/* Right Side: Dark Purple Banner Canvas */}
                <div className="md:col-span-7 bg-[#2b194d] p-8 sm:p-12 text-white flex flex-col justify-center space-y-3">
                    <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                        Learn At Your{' '}
                        <span className="text-[#FF4801] underline decoration-[#FF4801]/30">
                            Own Pace
                        </span>{' '}
                        With High-Quality Videos.
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-lg">
                        Stream interactive animated lessons tailored to your class curriculum. Watch anytime, anywhere.
                    </p>
                </div>
            </div>

            {/* Section Header: Explore All Subjects & Sort By */}
            <div className="flex items-center justify-between gap-4 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    Explore All Subjects
                </h2>

                <div className="relative inline-block">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:border-gray-400 shadow-xs flex items-center gap-2"
                    >
                        <span>Sort By</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {SUBJECTS.map((sub) => {
                    const IconComponent = sub.icon;

                    return (
                        <div
                            key={sub.id}
                            className={`p-6 rounded-2xl ${sub.bgColor} text-white shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-4 min-h-[150px] group hover:scale-[1.02]`}
                        >
                            {/* Icon rendering */}
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110">
                                {sub.iconType === 'math_symbol' ? (
                                    <span className="text-xl font-bold font-mono">√x</span>
                                ) : sub.iconType === 'text_en' ? (
                                    <span className="text-xl font-extrabold tracking-tight">En</span>
                                ) : IconComponent ? (
                                    <IconComponent className="w-6 h-6 text-white" />
                                ) : null}
                            </div>

                            {/* Subject Title */}
                            <h3 className="text-sm font-bold tracking-wide">
                                {sub.name}
                            </h3>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
