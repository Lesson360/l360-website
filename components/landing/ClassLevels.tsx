'use client';

import Image from 'next/image';

const LEVELS = [
    {
        label: 'Early Years',
        pill: 'bg-[#5468ff] ',
        offset: '',
        src: '/level-early-years.jpg',
        alt: 'Young child smiling in a colorful striped sweater',
    },
    {
        label: 'Nursery',
        pill: 'bg-brand-orange',
        offset: 'translate-y-0',
        src: '/level-nursery.jpg',
        alt: 'Child in a purple uniform writing at a classroom desk',
    },
    {
        label: 'Primary',
        pill: 'bg-[#2F2444]',
        offset: '',
        src: '/level-primary.jpg',
        alt: 'Smiling primary school boy wearing a backpack',
    },
    
    {
        label: 'Secondary',
        pill: 'bg-[#e8634a]',
        offset: 'translate-y-0',
        src: '/secondary-student.jpg',
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
                className="absolute top-0 right-24 w-9 h-9"
                viewBox="0 0 24 24"
                fill="#2ecc71"
            >
                <path d="M12 2L15 9L22 9.5L16.5 14L18.5 21L12 17L5.5 21L7.5 14L2 9.5L9 9Z" />
            </svg>
            {/* magenta arrow */}
            <svg
                className="absolute top-0 right-12 w-7 h-7"
                viewBox="0 0 24 24"
                fill="#e91e8c"
            >
                <path d="M4 4 L20 12 L4 20 Z" />
            </svg>
            {/* red square + teal arrow bottom-left */}
            <span className="absolute bottom-0 left-4 w-7 h-7 bg-[#ff3b3b] rounded-sm" />
            <svg
                className="absolute bottom-0 left-14 w-16 h-16"
                viewBox="0 0 24 24"
                fill="#19c2c2"
            >
                <path d="M4 4 L20 12 L4 20 Z" />
            </svg>
            {/* orange spinner arc */}
            <svg
                className="absolute -bottom-20 left-1/3 w-24 h-24"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M21 12a9 9 0 1 1-9-9"
                    stroke="#FFA600"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

export function ClassLevels() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#ffffff] to-[#FFF9C4] px-4 py-16 sm:py-20">
            <div className="relative z-10 mb-10 text-center sm:mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl text-brand-orange font-comic leading-tight">
                    Support For Every
                    <br />
                    Learning Level
                </h2>
                <p className="text-gray-600 mt-3 text-sm sm:text-base">
                    Lesson360 is structured for early years, nursery, primary, and secondary learners.
                </p>
            </div>

            <div className="site-shell relative">
                <Decorations />

                <div className="relative z-10 mt-8 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {LEVELS.map((lvl) => (
                        <div
                            key={lvl.label}
                            className="relative w-full"
                        >
                            <div className={`relative rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 ${lvl.offset}`}>
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
                                    className={`${lvl.pill} px-6 py-4 text-center`}
                                >
                                    <span className="text-white font-semibold whitespace-nowrap">
                                        {lvl.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
