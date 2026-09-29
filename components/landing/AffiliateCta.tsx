'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || '';

export function AffiliateCta() {
    if (!AFFILIATE_URL) return null;

    return (
        <section className="relative w-full bg-[#FFF9E3] pt-14 pb-0 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            {/* Decorative blob behind the photo */}
            <div className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl aspect-square rounded-full bg-brand-lavender/50 blur-md" />

            <div className="relative max-w-5xl mx-auto text-center">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-comic text-gray-900 leading-tight">
                    Start Earning Instantly
                </h2>
                <p className="text-2xl sm:text-4xl md:text-5xl font-comic leading-tight">
                    <span className="text-[#FF4800]">Join</span> Our Affiliate Program
                </p>

                <a
                    href={AFFILIATE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="relative inline-flex items-center gap-2 bg-[#FF4800] hover:bg-brand-orange-deep text-white font-comic font-bold px-10 py-3.5 rounded-xl shadow-[0_6px_0_0_#1a1442] hover:shadow-[0_4px_0_0_#1a1442] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all mt-6 sm:mt-8"
                >
                    <span>Start Earning</span>
                    <ArrowRight className="w-5 h-5" />
                </a>

                {/* Photo + floating labels + floating icons */}
                <div className="relative mt-6 sm:mt-10 max-w-3xl mx-auto">
                    <p className="hidden sm:block absolute left-0 top-10 max-w-[150px] text-xs font-comic font-semibold text-gray-700 text-left z-10">
                        Earn While You Inspire Learning.
                    </p>
                    <p className="hidden sm:block absolute right-0 top-0 max-w-[150px] text-xs font-comic font-semibold text-gray-700 text-right z-10">
                        Share Education. Earn Rewards.
                    </p>

                    <Image
                        src="/affiliate/megaphones.jpg"
                        alt="Two people announcing the Lesson360 affiliate program through megaphones"
                        width={1400}
                        height={905}
                        className="relative z-[1] w-full h-auto mix-blend-multiply select-none pointer-events-none"
                        priority={false}
                    />

                    <div className="absolute left-[6%] bottom-[8%] w-14 sm:w-20 z-[2]">
                        <Image src="/affiliate/coin.jpg" alt="" width={200} height={200} className="w-full h-auto mix-blend-multiply" />
                    </div>
                    <div className="absolute right-[4%] bottom-[2%] w-16 sm:w-24 z-[2]">
                        <Image src="/affiliate/cash.jpg" alt="" width={200} height={200} className="w-full h-auto mix-blend-multiply" />
                    </div>
                    <div className="absolute right-[10%] bottom-[-4%] w-12 sm:w-16 z-[2]">
                        <Image src="/affiliate/card.jpg" alt="" width={200} height={200} className="w-full h-auto mix-blend-multiply" />
                    </div>
                </div>
            </div>
        </section>
    );
}
