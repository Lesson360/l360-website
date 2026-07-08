'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const LEVELS = [
    {
        label: 'Early Years',
        pill: 'bg-[#5468ff]',
        offset: 'lg:-translate-y-6',
        src: 'https://cdn.magicpatterns.com/uploads/v87HBCLoybc7wQnRSx9m8n/image_14.jpg',
        alt: 'Young child smiling in a colorful striped sweater',
    },
    {
        label: 'Nursery',
        pill: 'bg-brand-orange',
        offset: 'lg:translate-y-10',
        src: 'https://cdn.magicpatterns.com/uploads/9Ddh6focP4VQ49xZ6nHwAt/image_15.jpg',
        alt: 'Child in a purple uniform writing at a classroom desk',
    },
    {
        label: 'Primary',
        pill: 'bg-[#2d284b]',
        offset: 'lg:translate-y-20',
        src: 'https://cdn.magicpatterns.com/uploads/giWkwqAoz6nbvnueyJfqFr/image_18.jpg',
        alt: 'Smiling primary school boy wearing a backpack',
    },
    
    {
        label: 'Secondary',
        pill: 'bg-[#e8634a]',
        offset: 'lg:-translate-y-4',
        src: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=600&q=80',
        alt: 'Smiling secondary school student',
    },
];

function Decorations() {
    return (
        <div aria-hidden="true" className="hidden lg:block">
            {/* dashed snaking connector */}
            <svg
                className="absolute inset-0 w-full h-full z-0"
                viewBox="0 0 1000 520"
                fill="none"
                preserveAspectRatio="none"
            >
                <path
                    d="M120 420 C 60 200, 360 120, 420 180 C 500 260, 560 360, 660 360 C 800 360, 880 200, 900 120"
                    stroke="#FF4800"
                    strokeWidth="2"
                    strokeDasharray="6,8"
                    opacity="0.7"
                />
            </svg>
            {/* green star */}
            <svg
                className="absolute top-10 right-24 w-9 h-9"
                viewBox="0 0 24 24"
                fill="#2ecc71"
            >
                <path d="M12 2L15 9L22 9.5L16.5 14L18.5 21L12 17L5.5 21L7.5 14L2 9.5L9 9Z" />
            </svg>
            {/* magenta arrow */}
            <svg
                className="absolute top-14 right-12 w-7 h-7"
                viewBox="0 0 24 24"
                fill="#e91e8c"
            >
                <path d="M4 4 L20 12 L4 20 Z" />
            </svg>
            {/* red square + teal arrow bottom-left */}
            <span className="absolute bottom-16 left-4 w-7 h-7 bg-[#ff3b3b] rounded-sm" />
            <svg
                className="absolute bottom-14 left-14 w-7 h-7"
                viewBox="0 0 24 24"
                fill="#19c2c2"
            >
                <path d="M4 4 L20 12 L4 20 Z" />
            </svg>
            {/* orange spinner arc */}
            <svg
                className="absolute bottom-8 left-1/2 w-9 h-9"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M21 12a9 9 0 1 1-9-9"
                    stroke="#FF4800"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

export function ClassLevels() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#fdf6dd] to-[#fbeeb0] py-16 sm:py-20 px-4">
            <div className="text-center mb-14 relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-orange font-comic leading-tight">
                    Inclusive Of All
                    <br />
                    Class Level
                </h2>
                <p className="text-gray-600 mt-3 text-sm sm:text-base">
                    Lorem Ipsum Dolor Sit Amet Consectetur. Lectus
                </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
                <Decorations />

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-start">
                    {LEVELS.map((lvl, i) => (
                        <motion.div
                            key={lvl.label}
                            initial={{
                                opacity: 0,
                                y: 40,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                margin: '-80px',
                            }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.12,
                            }}
                            className={`relative rounded-2xl overflow-hidden shadow-lg ${lvl.offset}`}
                        >
                            <div className="aspect-[3/4] relative">
                                <Image
                                    src={lvl.src}
                                    alt={lvl.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                            <div
                                className={`${lvl.pill} absolute bottom-3 left-1/2 -translate-x-1/2 px-6 py-2 rounded-lg shadow-md`}
                            >
                                <span className="text-white font-semibold whitespace-nowrap">
                                    {lvl.label}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}