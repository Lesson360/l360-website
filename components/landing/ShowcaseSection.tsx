'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function ShowcaseSection() {
    return (
        <section className="relative w-full bg-[#F4F7FE] py-12 md:py-20 overflow-hidden flex flex-col items-center justify-center font-sans">

            {/* Main Interactive Stage Container */}
            <div className="relative w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center min-h-[520px] sm:min-h-[600px] md:min-h-[680px] justify-center">

                {/* 1. Compact Concentric Background Circles (#F4EFFF > #AC81FF > #2F2444) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none z-0">
                    {/* Outer Ring (#F4EFFF) - Compact Sizing */}
                    <div className="w-[320px] h-[320px] xs:w-[380px] xs:h-[380px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] rounded-full bg-[#F4EFFF] flex items-center justify-center">
                        {/* Middle Ring (#AC81FF) */}
                        <div className="w-[220px] h-[220px] xs:w-[270px] xs:h-[270px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] rounded-full bg-[#AC81FF] flex items-center justify-center">
                            {/* Inner Dark Core (#2F2444) */}
                            <div className="w-[130px] h-[130px] xs:w-[160px] xs:h-[160px] sm:w-[210px] sm:h-[210px] md:w-[250px] md:h-[250px] rounded-full bg-[#2F2444]" />
                        </div>
                    </div>
                </div>

                {/* 2. Vector Decorative Swooshes / Arrows */}

                {/* Top-Right Dark Navy Curved Arrow (#2F2444) */}
                <div className="absolute top-[8%] right-[10%] sm:right-[16%] md:right-[22%] w-24 h-24 sm:w-32 sm:h-32 pointer-events-none z-10 hidden sm:block">
                    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#2F2444]">
                        <path
                            d="M 20,40 C 85,10 145,55 125,115 C 115,138 90,148 70,132"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 85,146 L 62,128 L 82,110"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Bottom-Left Pink Curved Arrow (#FFB2B2) */}
                <div className="absolute bottom-[20%] left-[8%] sm:left-[14%] md:left-[20%] w-20 h-24 sm:w-28 sm:h-32 pointer-events-none z-10 hidden sm:block">
                    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FFB2B2]">
                        <path
                            d="M 110,140 C 30,120 15,65 50,20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="9"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 36,36 L 52,14 L 68,34"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* 3. Center Overlapping Phone Mockups */}
                <div className="relative z-20 flex  items-center justify-center my-4 sm:my-8">

                    {/* Left Phone (Orange Welcome Screen - Learn Anywhere Anytime) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20, rotate: -14 }}
                        animate={{ opacity: 1, x: 0, rotate: -10 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="absolute z-10 w-[140px]  xs:w-[175px] sm:w-[220px] md:w-[220px] top-10 drop-shadow-xl select-none pointer-events-none -mr-8 xs:-mr-12 sm:-mr-16 left-52"
                    >
                        <Image
                            src="/showcase-phone-left.png"
                            alt="Lesson360 Mobile App Welcome Screen"
                            width={350}
                            height={700}
                            priority
                            className="w-full h-auto object-contain rotate-12"
                        />
                    </motion.div>

                    {/* Right Phone (White Dashboard Screen - good morning Micheal - ON TOP) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, rotate: 16 }}
                        animate={{ opacity: 1, x: 0, rotate: 12 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                        className="relative z-20 w-[150px] xs:w-[185px] -left-36 bottom-10 sm:w-[235px] md:w-[416px] drop-shadow-2xl select-none pointer-events-none"
                    >
                        <Image
                            src="/showcase-phone-right.png"
                            alt="Lesson360 Mobile App Dashboard"
                            width={350}
                            height={700}
                            priority
                            className="w-full h-auto object-contain -rotate-12"
                        />
                    </motion.div>
                </div>

                {/* 4. Floating Elements & Cards */}

                {/* Top-Left: "Take Quiz" Card with Cyan Dashed Border */}
                <Link href="/signup" className="absolute top-2 left-2 sm:top-6 sm:left-4 md:top-8 md:left-10 lg:left-60 z-30">
                    <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-[100px] sm:w-[125px] md:w-[140px] bg-white rounded-xl border-2 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    >
                        {/* Header Mint Box with 3D Lightbulb */}
                        <div className="bg-[#C5FFEE] py-3 flex justify-center items-center ">
                            <div className="relative w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20">
                                <Image
                                    src="/showcase-lightbulb.png"
                                    alt="Quiz Lightbulb Brain"
                                    fill
                                    sizes="80px"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        {/* Body Info */}
                        <div className="p-2 text-center ">
                            <h4 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base leading-tight mb-1 font-comic">
                                Take Quiz
                            </h4>
                            <p className="text-[9px] sm:text-[11px] text-gray-500 font-light leading-tight mb-2.5 px-0.5">
                                Test What You Have Learned With 10 Fun Questions!
                            </p>
                            <button className="bg-[#1E1B3A] text-white text-[9px] sm:text-xs font-light py-1 px-3 sm:px-4 rounded-lg w-full font-comic">
                                Start Quiz
                            </button>
                        </div>
                    </motion.div>
                </Link>

                {/* Bottom-Left: Video Film Strip Preview Card */}
                <Link href="/signup" className="absolute bottom-12 left-2 sm:bottom-14 sm:left-4 md:bottom-16 md:left-10 lg:left-16 z-30">
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-[130px] xs:w-[150px] sm:w-[175px] md:w-[195px] bg-white rounded-xl border border-gray-300 shadow-md p-1.5 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        {/* Top Film Strip Holes */}
                        <div className="flex justify-between items-center gap-1 mb-1 px-0.5">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="w-2 h-1.5 bg-gray-400 rounded-[1px]" />
                            ))}
                        </div>

                        {/* Video Screen Thumbnail */}
                        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden border border-gray-100">
                            <Image
                                src="/vid-2.jpg"
                                alt="Video Lesson Preview"
                                fill
                                sizes="180px"
                                className="object-cover"
                            />
                            {/* Bottom-Right Green Play Circle */}
                            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#10B981] flex items-center justify-center shadow-md">
                                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 ml-0.5">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* Bottom Film Strip Holes */}
                        <div className="flex justify-between items-center gap-1 mt-1 px-0.5">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="w-2 h-1.5 bg-gray-400 rounded-[1px]" />
                            ))}
                        </div>
                    </motion.div>
                </Link>

                {/* Right: Feature Checklist Box */}
                <motion.div
                    initial={{ opacity: 0, x: 15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-8 lg:right-14 z-30 w-[190px] xs:w-[220px] sm:w-[270px] md:w-[320px] bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-300/80 shadow-lg p-2 sm:p-3.5 space-y-1.5 sm:space-y-2.5"
                >
                    {/* Item 1: Performance Assessment */}
                    <Link href="/signup" className="block">
                        <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl hover:bg-white/40 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0">
                                    <Image
                                        src="/showcase-paper.png"
                                        alt="Performance Assessment Icon"
                                        fill
                                        sizes="36px"
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h5 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base leading-tight font-comic">
                                        Performance Assessment
                                    </h5>
                                    <p className="text-[9px] sm:text-xs text-gray-400 font-light">
                                        Monitor Your Progress
                                    </p>
                                </div>
                            </div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 flex-shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Item 2: Enrichment Courses */}
                    <Link href="/signup" className="block">
                        <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl hover:bg-white/40 transition-colors cursor-pointer border-t border-gray-100">
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <h5 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base leading-tight font-comic">
                                        Enrichment Courses
                                    </h5>
                                    <p className="text-[9px] sm:text-xs text-gray-400 font-light">
                                        Master New Subjects.
                                    </p>
                                </div>
                            </div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 flex-shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Item 3: Live Videos */}
                    <Link href="/signup" className="block">
                        <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl hover:bg-white/40 transition-colors cursor-pointer border-t border-gray-100">
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" />
                                        <path d="M8 4v16M16 4v16M2 10h20M2 14h20" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <h5 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base leading-tight font-comic">
                                        Live Videos
                                    </h5>
                                    <p className="text-[9px] sm:text-xs text-gray-400 font-light">
                                        Real-Time Learning Experiences.
                                    </p>
                                </div>
                            </div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 flex-shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            {/* Bottom Caption */}
            <div className="relative z-30 mt-4 text-center px-4 w-full">
                <p className="text-gray-600 font-light text-xs sm:text-sm md:text-base font-comic">
                    Available On Ios And Google Playstore.
                </p>
            </div>

            <div className="flex justify-center mt-6 mb-6">
                <Link href="/signup" className="inline-block relative w-[90vw] sm:w-[320px] md:w-[420px] m-auto h-14 group">
                    {/* Dark navy rotated background */}
                    <span className="absolute inset-0 bg-[#2d284b] rounded-xl transition-transform duration-300 rotate-3 group-hover:rotate-0" />

                    {/* Orange button on top */}
                    <span className="inline-block w-full h-full bg-brand-orange hover:bg-brand-orange-deep transition-colors text-white font-bold px-7 py-3.5 rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 relative font-comic text-center text-xl sm:text-2xl flex items-center justify-center">
                        View All
                    </span>
                </Link>
            </div>

        </section>
    );
}
