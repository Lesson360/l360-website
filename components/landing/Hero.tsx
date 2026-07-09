'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function Hero() {
    const router = useRouter();

    return (
        <div className="bg-white flex flex-col font-sans overflow-hidden">
            <main className="site-shell flex-grow flex flex-col lg:flex-row items-center justify-between w-full px-6 py-12 lg:px-0 lg:py-20 relative">
                <div className="w-full lg:w-[52%] xl:w-1/2 flex flex-col items-start z-10 relative">
                    <div className="mb-8 relative w-24 h-28">
                        <motion.img
                            src="/hero-block.png"
                            alt="3D ABC building block"
                            className="w-24 h-24 object-contain absolute top-0 left-0 z-10"
                            animate={{
                                y: [0, -18, 0],
                                rotate: [-3, 3, -3],
                            }}
                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            aria-hidden="true"
                            className="w-16 h-3 bg-gray-400/40 rounded-[100%] blur-[2px] absolute bottom-0 left-1/2 -translate-x-1/2"
                            animate={{
                                scaleX: [1, 0.7, 1],
                                opacity: [0.45, 0.18, 0.45],
                            }}
                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>

                    <h1 className="mb-4 relative leading-tight">
                        <span className="font-hero block text-[clamp(3.4rem,10vw,5rem)] lg:text-7xl font-normal text-black">
                            Turn Screen
                        </span>
                        <span className="font-hero relative inline-block text-[clamp(3.4rem,10vw,5rem)] lg:text-7xl font-normal text-black">
                            Time Into
                            <span
                                aria-hidden="true"
                                className="absolute -top-6 -right-16 sm:-right-24 md:-right-28 lg:-top-8 lg:-right-48 w-16 h-20 sm:w-32 sm:h-32 pointer-events-none z-20"
                            >
                                <motion.img
                                    src="/hero-kite.png"
                                    alt=""
                                    className="w-full h-full object-contain"
                                    animate={{
                                        y: [0, -12, 0],
                                        rotate: [-5, 5, -5],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                                <motion.div
                                    className="w-10 h-2 bg-gray-400/30 rounded-[100%] blur-[2px] mx-auto mt-1"
                                    animate={{
                                        scaleX: [1, 0.7, 1],
                                        opacity: [0.4, 0.16, 0.4],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </span>
                        </span>
                        <span className="text-brand-orange font-comic text-6xl lg:text-[80px] font-bold leading-tight lg:leading-[75px] block mt-2">
                            Learning Time.
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg max-w-md mb-8">
                        Lesson360 helps families turn everyday screen time into structured
                        learning with video lessons, guided worksheets, and simple practice
                        support from nursery to secondary level.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/signup')}
                        className="bg-brand-orange text-white text-xl font-bold py-4 px-12 rounded-sm shadow-md hover:bg-brand-orange-deep transition-colors w-full text-center flex items-center justify-center"
                    >
                        Start Now
                    </motion.button>
                </div>

                <div className="w-full lg:w-[48%] xl:w-1/2 mt-16 lg:mt-0 relative flex justify-center items-center">
                    <div
                        className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] overflow-hidden border-8 border-white shadow-2xl z-10"
                        style={{ borderRadius: '45% 55% 48% 52% / 50% 45% 55% 50%' }}
                    >
                        <Image
                            src="/hero-student.jpg"
                            alt="Smiling student"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 320px, 450px"
                        />
                    </div>

                    <motion.div
                        className="absolute top-2 left-6 lg:top-8 lg:left-14 w-8 h-8 lg:w-10 lg:h-10 bg-brand-orange rounded-full z-20"
                        animate={{
                            y: [0, -12, 0],
                            x: [0, 8, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <motion.div
                        className="absolute bottom-16 left-2 lg:bottom-24 lg:left-10 z-20"
                        animate={{
                            rotate: [0, 180, 360],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="#8b9fff"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                fill="#8b9fff"
                            />
                        </svg>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-8 right-6 lg:bottom-16 lg:right-14 w-10 h-10 lg:w-12 lg:h-12 bg-[#00FF00] rounded-full z-20"
                        animate={{
                            y: [0, 15, 0],
                            x: [0, -10, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                    />
                </div>
            </main>

            <div className="site-shell w-full px-6 mt-auto md:my-16 lg:px-0">
                <div
                    className="text-white py-8 px-4 sm:px-12 flex flex-col sm:flex-row justify-between items-center shadow-xl border-b-0 rounded-t-[40px] md:rounded-t-[100px]"
                    style={{ background: 'linear-gradient(174.21deg, #FF4800 19.09%, #4F1105 95.88%)' }}
                >
                    <div className="text-center mb-6 sm:mb-0 w-full sm:w-1/3">
                        <h3 className="text-4xl lg:text-5xl font-bold mb-1">4</h3>
                        <p className="text-sm lg:text-base opacity-90">Learning Stages</p>
                    </div>

                    <div className="hidden sm:block w-px h-16 bg-white/30"></div>

                    <div className="text-center mb-6 sm:mb-0 w-full sm:w-1/3 border-t border-b border-white/20 sm:border-0 py-4 sm:py-0">
                        <h3 className="text-4xl lg:text-5xl font-bold mb-1">3</h3>
                        <p className="text-sm lg:text-base opacity-90">Core Study Formats</p>
                    </div>

                    <div className="hidden sm:block w-px h-16 bg-white/30"></div>

                    <div className="text-center w-full sm:w-1/3">
                        <h3 className="text-4xl lg:text-5xl font-bold mb-1">1</h3>
                        <p className="text-sm lg:text-base opacity-90">Simple Learning Platform</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
