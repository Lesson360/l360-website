'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function ExploreOur() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F4F7FE] via-[#EDF3FE] to-[#F8FAFF] py-16 sm:py-24 px-4 font-sans">
            <div className="max-w-6xl mx-auto relative z-10 space-y-20 sm:space-y-28 md:space-y-36">

                {/* Main Section Header */}
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-orange font-comic mb-6">
                        Explore Our
                    </h2>

                    {/* Section Sub-Header Categories: Videos | Quizzes | Exams */}
                    <div className="flex items-center justify-center gap-4 sm:gap-10 md:gap-14 flex-wrap">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-comic text-[#2D284B]">
                            Videos
                        </span>
                        <span className="h-8 md:h-10 w-[1.5px] bg-gray-300/80 inline-block" aria-hidden="true" />
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-comic text-[#2D284B]">
                            Quizzes
                        </span>
                        <span className="h-8 md:h-10 w-[1.5px] bg-gray-300/80 inline-block" aria-hidden="true" />
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-comic text-[#2D284B]">
                            Exams
                        </span>
                    </div>
                </div>

                {/* ---------------- BLOCK 1: VIDEOS SECTION ---------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className="w-full bg-white/60 backdrop-blur-sm border border-gray-100/80 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Left Headline */}
                        <div className="lg:col-span-5 text-left">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-comic text-[#1E1B3A] leading-tight mb-4">
                                Interactive <span className="text-[#FF4800]">Video</span> Lessons Designed For Success.
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 font-medium font-comic">
                                Your Classroom, One Tap Away.
                            </p>
                        </div>

                        {/* Right 3 Floating Photos with Colorful Borders */}
                        <div className="lg:col-span-7 flex justify-center items-center relative min-h-[360px] sm:min-h-[420px] select-none">

                            {/* Decorative Geometric Top Shape (Triangle + Circle + Square) */}
                            <div className="absolute top-0 left-[48%] -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-[#2D284B]">
                                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[#2D284B]" />
                                <div className="flex items-center gap-1">
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#2D284B]" />
                                    <div className="w-3.5 h-3.5 bg-[#2D284B]" />
                                </div>
                            </div>

                            {/* Photo 1 (Left, Pink Border) */}
                            <div className="relative z-10 w-36 xs:w-44 sm:w-52 h-56 xs:h-64 sm:h-72 border-[6px] border-[#FFB2B2] rounded-[28px] overflow-hidden shadow-lg -mr-6 sm:-mr-8 translate-y-8">
                                <Image
                                    src="/secondary-student.jpg"
                                    alt="Student studying with phone"
                                    fill
                                    sizes="220px"
                                    className="object-cover"
                                />
                            </div>

                            {/* Photo 2 (Center, Black Border, Tallest) */}
                            <div className="relative z-20 w-44 xs:w-52 sm:w-60 h-72 xs:h-84 sm:h-[390px] border-[7px] border-black rounded-[40px] overflow-hidden shadow-2xl bg-amber-400">
                                <Image
                                    src="/guy-pressing-phone.png"
                                    alt="Student with headphones holding books"
                                    fill
                                    sizes="260px"
                                    className="object-cover object-top"
                                />
                            </div>

                            {/* Photo 3 (Right, Green Border) */}
                            <div className="relative z-10 w-40 xs:w-48 sm:w-56 h-60 xs:h-68 sm:h-76 border-[6px] border-[#10B981] rounded-[32px] overflow-hidden shadow-xl -ml-6 sm:-ml-8">
                                <Image
                                    src="/secondary-student.jpg"
                                    alt="Online video lesson on laptop"
                                    fill
                                    sizes="240px"
                                    className="object-cover"
                                />
                            </div>

                            {/* Decorative Geometric Bottom Shape (Orange Overlapping Squares) */}
                            <div className="absolute bottom-4 right-[10%] sm:right-[14%] z-30 flex gap-1">
                                <div className="w-4.5 h-4.5 rounded-md bg-[#FF4800]" />
                                <div className="w-4.5 h-4.5 rounded-md bg-[#FF4800] -ml-2 translate-y-2" />
                            </div>

                        </div>

                    </div>
                </motion.div>


                {/* ---------------- BLOCK 2: QUIZZES SECTION ---------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className="w-full bg-white/60 backdrop-blur-sm border border-gray-100/80 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="text-left mb-8">
                        <h3 className="font-comic font-extrabold text-3xl md:text-4xl text-[#1E1B3A]">
                            Quizzes
                        </h3>
                        <p className="font-comic text-sm md:text-base text-gray-600">
                            Test Your Knowledge
                        </p>
                    </div>

                    {/* Dashed Arc Curve SVG Flowing Behind Cards */}
                    <div className="absolute top-[25%] left-0 w-full h-[50%] pointer-events-none z-0 hidden md:block">
                        <svg viewBox="0 0 1000 200" fill="none" className="w-full h-full text-gray-400">
                            <path
                                d="M 50,150 C 300,-30 700,-30 950,150"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeDasharray="6 6"
                            />
                        </svg>
                    </div>

                    {/* 3 Quiz Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">

                        {/* Card 1: 3D Purple Chart */}
                        <div className="bg-[#F7F5FF] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center min-h-[300px] shadow-sm border border-purple-100/50">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#6C38CC] rounded-3xl flex items-center justify-center p-4 shadow-lg text-white my-auto">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-16 h-16">
                                    <rect x="3" y="12" width="4" height="8" rx="1" fill="white" />
                                    <rect x="10" y="8" width="4" height="12" rx="1" fill="white" />
                                    <rect x="17" y="4" width="4" height="16" rx="1" fill="white" />
                                    <path d="M4 10l6-4 7 2 3-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="font-comic font-bold text-sm md:text-base text-gray-900 mt-4">
                                Monitor Your Progress
                            </p>
                        </div>

                        {/* Card 2: 3D Gold Trophy */}
                        <div className="bg-[#FFF0ED] rounded-3xl p-6 sm:p-8 flex items-center justify-between min-h-[300px] shadow-sm border border-orange-100/50 relative overflow-hidden">
                            <p className="font-comic font-bold text-base sm:text-lg md:text-xl text-gray-900 leading-tight max-w-[130px] text-left">
                                Turn Knowledge Into Rewards.
                            </p>
                            <div className="w-28 h-28 sm:w-36 sm:h-36 relative flex-shrink-0">
                                <Image
                                    src="/hero-quiz-cube.png"
                                    alt="Gold Trophy Rewards"
                                    fill
                                    sizes="150px"
                                    className="object-contain drop-shadow-md"
                                />
                            </div>
                        </div>

                        {/* Card 3: Varieties Of Subjects List */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 flex flex-col justify-between min-h-[300px] shadow-sm border border-gray-100">
                            <div className="space-y-2.5 w-full">
                                {/* Math Quiz */}
                                <div className="bg-[#F0FDF4] border border-green-200 rounded-xl p-2.5 flex items-center justify-between text-left">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                                            🧮
                                        </div>
                                        <div>
                                            <h6 className="font-bold text-xs text-gray-900">Mathematic Quiz</h6>
                                            <span className="text-[10px] text-gray-500">10 Questions</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs">›</span>
                                </div>

                                {/* English Quiz */}
                                <div className="bg-[#F0F5FF] border border-blue-200 rounded-xl p-2.5 flex items-center justify-between text-left">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                            📖
                                        </div>
                                        <div>
                                            <h6 className="font-bold text-xs text-gray-900">English Quiz</h6>
                                            <span className="text-[10px] text-gray-500">12 Questions</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs">›</span>
                                </div>

                                {/* Government Quiz */}
                                <div className="bg-[#FFF0F0] border border-red-200 rounded-xl p-2.5 flex items-center justify-between text-left">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                                            🏛️
                                        </div>
                                        <div>
                                            <h6 className="font-bold text-xs text-gray-900">Government Quiz</h6>
                                            <span className="text-[10px] text-gray-500">Questions</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs">›</span>
                                </div>
                            </div>

                            <p className="font-comic font-bold text-sm md:text-base text-gray-900 text-center mt-4">
                                Explore Varieties Of Subjects
                            </p>
                        </div>

                    </div>
                </motion.div>


                {/* ---------------- BLOCK 3: EXAMS SECTION ---------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className="w-full"
                >
                    {/* Header */}
                    <div className="text-left mb-6">
                        <h3 className="font-comic font-extrabold text-3xl md:text-4xl text-[#1E1B3A]">
                            Exams
                        </h3>
                        <p className="font-comic text-sm md:text-base text-gray-600">
                            Test Your Knowledge
                        </p>
                    </div>

                    {/* Yellow Arched Container */}
                    <div className="w-full bg-[#FCFEE4] rounded-tl-[90px] sm:rounded-tl-[140px] rounded-tr-3xl rounded-b-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-amber-100">

                        {/* 3 Subject Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 justify-end max-w-4xl ml-auto">

                            {/* Card 1: Mathematics */}
                            <div className="bg-[#FAFEE8] border border-black/20 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-xs">
                                {/* Circle Math Icon */}
                                <div className="w-16 h-16 rounded-full bg-[#2E1A72] flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-md">
                                    √x
                                </div>
                                <h4 className="font-comic font-extrabold text-xl text-gray-900 mb-1">
                                    Mathematics
                                </h4>
                                <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight mb-4 px-1">
                                    Algebra, Geometry, Arithmetic, Statistic And More.
                                </p>
                                <button className="bg-[#2B2447] text-white font-bold text-xs py-2 px-4 rounded-full w-full mb-3 shadow-xs">
                                    24 Practice Questions
                                </button>
                                <button className="bg-[#CDECFF] hover:bg-[#BDE4FF] border border-black/20 text-[#1E1B3A] font-bold text-sm py-2 px-6 rounded-xl w-full transition-colors">
                                    Start
                                </button>
                            </div>

                            {/* Card 2: Physics */}
                            <div className="bg-[#FAFEE8] border border-black/20 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-xs">
                                {/* Circle Atom Icon */}
                                <div className="w-16 h-16 rounded-full bg-[#FF4800] flex items-center justify-center text-white mb-4 shadow-md">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                                        <circle cx="12" cy="12" r="2" fill="white" />
                                        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" stroke="white" />
                                        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(150 12 12)" stroke="white" />
                                    </svg>
                                </div>
                                <h4 className="font-comic font-extrabold text-xl text-gray-900 mb-1">
                                    Physics
                                </h4>
                                <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight mb-4 px-1">
                                    Algebra, Geometry, Arithmetic, Statistic And More.
                                </p>
                                <button className="bg-[#2B2447] text-white font-bold text-xs py-2 px-4 rounded-full w-full mb-3 shadow-xs">
                                    24 Practice Questions
                                </button>
                                <button className="bg-[#CDECFF] hover:bg-[#BDE4FF] border border-black/20 text-[#1E1B3A] font-bold text-sm py-2 px-6 rounded-xl w-full transition-colors">
                                    Start
                                </button>
                            </div>

                            {/* Card 3: Chemistry */}
                            <div className="bg-[#FAFEE8] border border-black/20 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-xs">
                                {/* Circle Flask Icon */}
                                <div className="w-16 h-16 rounded-full bg-[#8B44CE] flex items-center justify-center text-white mb-4 shadow-md">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                                        <path d="M10 2v5L4.5 17.5A2 2 0 0 0 6.25 20h11.5a2 2 0 0 0 1.75-2.5L14 7V2" stroke="white" />
                                        <line x1="8" y1="2" x2="16" y2="2" stroke="white" />
                                        <circle cx="10" cy="14" r="1" fill="white" />
                                        <circle cx="14" cy="16" r="1.5" fill="white" />
                                    </svg>
                                </div>
                                <h4 className="font-comic font-extrabold text-xl text-gray-900 mb-1">
                                    Chemistry
                                </h4>
                                <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight mb-4 px-1">
                                    Algebra, Geometry, Arithmetic, Statistic And More.
                                </p>
                                <button className="bg-[#2B2447] text-white font-bold text-xs py-2 px-4 rounded-full w-full mb-3 shadow-xs">
                                    24 Practice Questions
                                </button>
                                <button className="bg-[#CDECFF] hover:bg-[#BDE4FF] border border-black/20 text-[#1E1B3A] font-bold text-sm py-2 px-6 rounded-xl w-full transition-colors">
                                    Start
                                </button>
                            </div>

                        </div>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}