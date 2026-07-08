'use client';

import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const TABS = ['Videos', 'Quizzes', 'Exams'] as const;

const fadeUp = {
    initial: {
        opacity: 0,
        y: 40,
    },
    whileInView: {
        opacity: 1,
        y: 0,
    },
    viewport: {
        once: true,
        margin: '-80px',
    },
};

function ConcentricRings() {
    return (
        <div
            aria-hidden="true"
            className="flex items-center gap-3 sm:gap-5 shrink-0"
        >
            <div className='bg-[#C7FFDC] h-16 w-16 sm:h-24 sm:w-24 rounded-full flex items-center justify-center'>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#9be7a8] flex items-center justify-center">
                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white" />
                </div>
            </div>
            <div className='bg-[#C7FFDC] h-24 w-24 sm:h-36 sm:w-36 rounded-full flex items-center justify-center'>
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#9be7a8] flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-white" />
                </div>
            </div>
            <div className='bg-[#C7FFDC] h-36 w-36 sm:h-48 sm:w-48 rounded-full flex items-center justify-center'>
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-[#9be7a8] flex items-center justify-center">
                    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-white" />
                </div>
            </div>
        </div>
    );
}

function GradCap() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 120 110"
            className="w-28 h-28 sm:w-36 sm:h-36 shrink-0"
        >
            {/* purple book */}
            <rect x="22" y="78" width="76" height="20" rx="5" fill="#7c5cff" />
            <rect x="22" y="78" width="10" height="20" rx="3" fill="#5e3fd6" />
            {/* orange book */}
            <rect x="28" y="60" width="64" height="20" rx="5" fill="#ff8a3d" />
            <rect x="28" y="60" width="9" height="20" rx="3" fill="#e96f1f" />
            {/* cap base */}
            <ellipse cx="60" cy="44" rx="22" ry="9" fill="#2d284b" />
            {/* cap board */}
            <path d="M18 32 L60 18 L102 32 L60 46 Z" fill="#2d284b" />
            {/* tassel */}
            <path
                d="M88 30 L88 50"
                stroke="#ffd23f"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <circle cx="88" cy="52" r="4" fill="#ffd23f" />
        </svg>
    );
}

function InfoCard({
    title,
    body,
    graphic,
}: {
    title: string;
    body: string;
    graphic: React.ReactNode;
}) {
    return (
        <motion.div
            {...fadeUp}
            transition={{
                duration: 0.5,
            }}
            className="bg-[#2d284b] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg"
        >
            <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h3>
                <p className="text-sm text-white/70 leading-relaxed max-w-sm mx-auto sm:mx-0 mb-5">
                    {body}
                </p>
                <Link
                    href="/login"
                    className="inline-block relative w-full max-w-[340px] group"
                >
                    {/* White rotated background - behind everything */}
                    <span className='absolute inset-0 bg-white rounded-xl transition-transform duration-300 rotate-3 group-hover:rotate-0'></span>

                    {/* Orange button on top */}
                    <span className="inline-block w-full bg-brand-orange hover:bg-brand-orange-deep transition-colors text-white font-semibold px-7 py-2.5 rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 relative font-comic text-center">
                        Learn More
                    </span>
                </Link>
            </div>
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                {graphic}
            </div>
        </motion.div>
    );
}

export function ExploreOur() {
    const [active, setActive] = useState<(typeof TABS)[number]>('Videos');

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-[#d6ecff] py-16 sm:py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-brand-orange font-comic mb-6">
                    Explore Our
                </h2>

                {/* Tabs */}
                <div
                    role="tablist"
                    aria-label="Explore categories"
                    className="flex items-center justify-center gap-4 sm:gap-10 mb-12 flex-wrap"
                >
                    {TABS.map((tab, i) => (
                        <Fragment key={tab}>
                            <button
                                role="tab"
                                aria-selected={active === tab}
                                onClick={() => setActive(tab)}
                                className={`text-lg sm:text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 rounded px-1 ${active === tab
                                    ? 'text-brand-orange'
                                    : 'text-brand-orange/60 hover:text-brand-orange'
                                    }`}
                            >
                                {tab}
                            </button>
                            {i < TABS.length - 1 && (
                                <span className="h-6 w-px bg-gray-300" aria-hidden="true" />
                            )}
                        </Fragment>
                    ))}
                </div>

                <div className="space-y-6 sm:space-y-8">
                    <InfoCard
                        title="Quizzes"
                        body="Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibul"
                        graphic={<ConcentricRings />}
                    />
                    <InfoCard
                        title="Exam"
                        body="Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibul"
                        graphic={<Image alt='Graduation cap on books' width={300} height={350} src='/graduate-cap.jpg' />}
                    />
                </div>
            </div>
        </section>
    );
}