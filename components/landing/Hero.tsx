'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function Hero() {
    const router = useRouter();

    return (
        <div className="bg-white flex flex-col font-sans overflow-hidden">
            <main className="flex-grow flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 relative">
                {/* Left Column - Text & CTA */}
                <div className="w-full lg:w-1/2 flex flex-col items-start z-10 relative">
                    {/* Bouncing 3D ABC Cube with grounded shadow */}
                    <div className="mb-8 relative w-24 h-28">
                        <motion.img
                            src="https://cdn.magicpatterns.com/uploads/9rWY8Fe7hwdVtCtbUr4c7q/brick_1.png"
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

                    <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4 relative">
                        Turn Screen <br />
                        <span className="relative inline-block">
                            Time Into
                            {/* Floating Kite next to headline */}
                            <span 
                                aria-hidden="true"
                                className="absolute -top-8 -right-20 sm:-right-24 md:-right-28 lg:-right-48 w-16 h-20 sm:w-32 sm:h-32 pointer-events-none z-20"
                            >
                                <motion.img
                                    src="https://cdn.magicpatterns.com/uploads/jfhVvsqWJJ9T1XEqzxyCa5/kite_1.png"
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
                        <br />
                        <span className="text-brand-orange font-comic text-6xl lg:text-[80px] font-bold leading-tight lg:leading-[75px] block mt-2">
                            Learning Time.
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg max-w-md mb-8">
                        Lorem Ipsum Dolor Sit Amet Consectetur. In Elit Nisi Ipsum Velit
                        Congue. At Varius Vitae Sapien Id Velit. Cras Commodo Duis Facilisi
                        Et Vitae.
                    </p>

                    <motion.button
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        onClick={() => router.push('/signup')}
                        className="bg-brand-orange text-white text-xl font-bold py-4 px-12 rounded-sm shadow-md hover:bg-brand-orange-deep transition-colors w-full text-center  flex items-center justify-center"
                    >
                        Start Now
                    </motion.button>
                </div>

                {/* Right Column - Image & Floating Elements */}
                <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative flex justify-center items-center">
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut',
                        }}
                        className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] overflow-hidden border-8 border-white shadow-2xl z-10"
                        style={{ borderRadius: '45% 55% 48% 52% / 50% 45% 55% 50%' }}
                    >
                        <Image
                            src="https://cdn.magicpatterns.com/uploads/pJyXv9yy6fcYw3vLZnhiD7/download_-_2026-06-07T192852.783_1.jpg"
                            alt="Smiling student"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 320px, 450px"
                        />
                    </motion.div>

                    {/* Floating Shapes */}
                    {/* Orange circle top-left */}
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

                    {/* Blue star bottom-left */}
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

                    {/* Green circle bottom-right */}
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

            {/* Stats Bar */}
            <div className="w-full px-6 mt-auto md:my-16">
                <div 
                    className="max-w-6xl mx-auto text-white py-8 px-4 sm:px-12 flex flex-col sm:flex-row justify-between items-center shadow-xl border-b-0 rounded-t-[40px] md:rounded-t-[100px]"
                    style={{ background: 'linear-gradient(174.21deg, #FF4800 19.09%, #4F1105 95.88%)' }}
                >
                    <div className="text-center mb-6 sm:mb-0 w-full sm:w-1/3">
                        <h3 className="text-4xl lg:text-5xl font-bold mb-1">1000+</h3>
                        <p className="text-sm lg:text-base opacity-90">Lessons & Games</p>
                    </div>

                    <div className="hidden sm:block w-px h-16 bg-white/30"></div>

                    <div className="text-center mb-6 sm:mb-0 w-full sm:w-1/3 border-t border-b border-white/20 sm:border-0 py-4 sm:py-0">
                        <h3 className="text-4xl lg:text-5xl font-bold mb-1">1M+</h3>
                        <p className="text-sm lg:text-base opacity-90">Parents Trust Us.</p>
                    </div>

                    <div className="hidden sm:block w-px h-16 bg-white/30"></div>

                    <div className="text-center w-full sm:w-1/3">
                        <h3 className="text-4xl lg:text-5xl font-bold mb-1">2M+</h3>
                        <p className="text-sm lg:text-base opacity-90">Kids Love Us.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}