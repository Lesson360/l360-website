'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
    return (
        <div className="bg-white flex flex-col font-sans overflow-hidden">
            {/* Top Wavy Graphic Panel */}
            <div className="relative bg-white w-full flex justify-center items-center min-h-[500px] sm:min-h-[580px] md:min-h-[660px]">

                {/* Full-Bleed 'W'-Shaped Background SVG */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <svg
                        viewBox="0 0 1440 650"
                        fill="none"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        {/* Peach Filled Region ('W' Top Contour) */}
                        <path
                            d="M 0,0 L 1440,0 L 1440,60 C 1300,320 1200,490 1060,490 C 920,490 820,240 720,240 C 620,240 520,490 380,490 C 240,490 140,320 0,60 Z"
                            fill="#FFEEE4"
                        />
                        {/* Continuous Orange Outline Stroke */}
                        <path
                            d="M 1440,60 C 1300,320 1200,490 1060,490 C 920,490 820,240 720,240 C 620,240 520,490 380,490 C 240,490 140,320 0,60"
                            fill="none"
                            stroke="#FF4800"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {/* Central Arch and Floating Elements Container */}
                <div className="relative w-[290px] h-[390px] xs:w-[320px] xs:h-[430px] md:w-[400px] md:h-[530px] flex-shrink-0 z-20 ">

                    {/* White overlay circle dot (Top-Left of Arch) */}
                    <div className="absolute top-[3%] left-[18%] w-6 h-6 md:w-8 md:h-8 bg-white rounded-full z-30 border border-orange-100" />

                    {/* Central Arch Capsule with Orange Ring Border (No Shadow) */}
                    <div className="w-full h-full border-[6px] md:border-[8px] border-[#FF4800] bg-white rounded-full overflow-hidden relative">
                        <Image
                            src="/guy-pressing-phone.png"
                            alt="Student pressing phone"
                            fill
                            priority
                            sizes="(max-width: 768px) 320px, 400px"
                            className="object-cover object-top scale-[1.05]"
                        />
                    </div>

                    {/* Green neon circle overlay badge (Bottom-Right of Arch - No Shadow) */}
                    <div className="absolute bottom-[8%] right-[2%] w-8 h-8 md:w-10 md:h-10 bg-[#00FF00] rounded-full z-30" />

                    {/* Floating ABC Block (Top-Left - No Shadow) */}
                    <div className="absolute -top-6 -left-12 md:-top-6 md:-left-[360px] w-24 h-24 md:w-32 md:h-32 z-20 select-none pointer-events-none">
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src="/hero-brick.svg"
                                alt="ABC Building Block"
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-contain z-10"
                            />
                        </motion.div>
                    </div>

                    {/* Floating Blue Star Balloon (Bottom-Left Dip - No Shadow) */}
                    <div className="absolute bottom-6 -left-16 md:bottom-12 md:-left-60 w-20 h-20 md:w-28 md:h-28 z-20 select-none">
                        <motion.div
                            transition={{
                                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                                rotate: { duration: 30, repeat: Infinity, ease: 'linear' }
                            }}
                            className="w-full h-full"
                        >
                            <Image
                                src="/hero-blue-star.png"
                                alt="Blue Star"
                                fill
                                sizes="(max-width: 768px) 120px, 152px"
                                className="object-contain"
                            />
                        </motion.div>
                    </div>

                    {/* Video Lessons Badge */}
                    <Link href="/signup" className="absolute top-[32%] -left-12 xs:-left-16 md:-left-24 z-30">
                        <motion.div
                            className="flex items-center gap-2 md:gap-3 bg-[#FFEB14] border-[2px] border-[#0018CF] px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-[24px] cursor-pointer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative w-8 h-8 md:w-11 md:h-11 flex-shrink-0">
                                <Image
                                    src="/hero-clapperboard.png"
                                    alt="Clapperboard"
                                    fill
                                    sizes="44px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-base md:text-2xl font-medium text-[#1E1B4B] leading-none">3,000+</span>
                                <span className="text-[10px] md:text-[13px] font-light text-[#1E1B4B] leading-tight">video lesson</span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Quizzes Badge */}
                    <Link href="/signup" className="absolute bottom-[28%] -right-12 xs:-right-16 md:-right-24 z-30">
                        <motion.div
                            className="flex items-center gap-2 md:gap-3 bg-[#4E3BFF] border-[2px] border-[#1E1B4B] px-3 py-2 md:px-5 md:py-3 rounded-2xl md:rounded-[24px] cursor-pointer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative w-8 h-8 md:w-11 md:h-11 flex-shrink-0">
                                <Image
                                    src="/hero-quiz-cube.png"
                                    alt="Quiz Cube"
                                    fill
                                    sizes="44px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-base md:text-2xl font-medium text-white leading-none">200+</span>
                                <span className="text-[10px] md:text-[13px] font-light text-white/95 leading-tight">available quizzes</span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Enrichment Courses Card */}
                    <Link href="/signup" className="absolute top-0 -right-20 md:top-0 md:-right-80 z-30">
                        <motion.div
                            className="w-40 h-44 md:w-[180px] md:h-[180px] bg-[#E8F5E9] border-[2.5px] border-black rounded-[24px] rounded-tr-[70px] md:rounded-tr-[90px] p-3 md:p-4 flex flex-col items-center justify-between cursor-pointer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative w-full flex-grow flex items-center justify-center min-h-[75px] md:min-h-[105px]">
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative w-[90px] h-[75px] md:w-[130px] md:h-[105px]"
                                >
                                    <Image
                                        src="/hero-enrichment.png"
                                        alt="Enrichment Courses"
                                        fill
                                        sizes="(max-width: 768px) 90px, 130px"
                                        className="object-contain"
                                    />
                                </motion.div>
                            </div>
                            <div className="text-center mt-1">
                                <p className="text-[11px] md:text-[14px] font-light text-black leading-tight font-comic">Explore</p>
                                <p className="text-[11px] md:text-[14px] font-light text-black leading-tight font-comic">Enrichment courses.</p>
                            </div>
                        </motion.div>
                    </Link>

                </div>

            </div>

            {/* Title / Heading Section (Light Font) */}
            <div className="w-full text-center px-6 z-20">
                <h1 className="text-2xl font-normal text-gray-900 leading-tight font-comic">
                    Turn Screen Time Into{' '}
                    <span className="text-[#FF4800] font-comic font-normal inline-block md:mt-0 mt-1">
                        Learning Time.
                    </span>
                </h1>
            </div>

            {/* Stats Card Section (No Shadow, Light Font) */}
            <div className="w-full px-6  flex justify-center z-20">
                <div className="relative w-full max-w-5xl bg-[#B9BEFF20] mt-6 border-x border-t border-[#1E1B4B]/10 rounded-t-[32px] md:rounded-t-[48px] py-6 px-8 md:py-10 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
                    {/* Left Decorative Orange Star */}
                    <div className="absolute left-4 bottom-4 md:left-6 md:top-1/2 md:-translate-y-1/2 md:bottom-auto text-[#FF4800] w-6 h-6 md:w-8 md:h-8 select-none opacity-80">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                            <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
                        </svg>
                    </div>

                    {/* Stat 1 */}
                    <div className="text-center w-full md:w-1/3">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#1E1B4B] mb-1 font-comic">2M+</h3>
                        <p className="text-xs md:text-sm lg:text-base font-light text-gray-500 font-comic">Kids Love Us.</p>
                    </div>

                    {/* Divider 1 */}
                    <div className="hidden md:block w-[1.5px] h-12 bg-[#1E1B4B]/10" />

                    {/* Stat 2 */}
                    <div className="text-center w-full md:w-1/3">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#1E1B4B] mb-1 font-comic">1000+</h3>
                        <p className="text-xs md:text-sm lg:text-base font-light text-gray-500 font-comic">Lessons & Games</p>
                    </div>

                    {/* Divider 2 */}
                    <div className="hidden md:block w-[1.5px] h-12 bg-[#1E1B4B]/10" />

                    {/* Stat 3 */}
                    <div className="text-center w-full md:w-1/3">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#1E1B4B] mb-1 font-comic">1M+</h3>
                        <p className="text-xs md:text-sm lg:text-base font-light text-gray-500 font-comic">Parents Trust Us.</p>
                    </div>

                    {/* Right Decorative Orange Star */}
                    <div className="absolute right-4 top-4 md:right-6 md:top-1/2 md:-translate-y-1/2 text-[#FF4800] w-6 h-6 md:w-8 md:h-8 select-none opacity-80">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                            <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
