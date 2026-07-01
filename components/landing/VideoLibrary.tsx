'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon } from 'lucide-react';
import Image from 'next/image';

const VIDEOS = [
    {
        src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
        alt: 'Teacher helping a student at a desk',
    },
    {
        src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        alt: 'Teacher writing on a chalkboard',
    },
    {
        src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
        alt: 'Teacher explaining a math problem to a child',
    },
];

function Perforations() {
    return (
        <div
            aria-hidden="true"
            className="flex justify-between px-2 py-1.5 bg-[#222]"
        >
            {[...Array(10)].map((_, i) => (
                <span
                    key={i}
                    className="w-3 h-2 sm:w-4 sm:h-2.5 bg-gray-400 rounded-[2px]"
                />
            ))}
        </div>
    );
}

function VideoCard({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="bg-white rounded-md overflow-hidden shadow-md">
            <Perforations />
            <div className="relative p-2 bg-white">
                <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button
                        aria-label="Play video"
                        className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-green-500/70 hover:bg-green-500/90 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <PlayIcon className="w-6 h-6 text-white fill-white" />
                    </button>
                </div>
            </div>
            <Perforations />
        </div>
    );
}

export function VideoLibrary() {
    const [page, setPage] = useState(0);

    return (
        <section className="w-full overflow-hidden bg-[#cfe8ff] py-16 sm:py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a1a1a] mb-12">
                    Video Library
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {VIDEOS.map((v, i) => (
                        <motion.div
                            key={i}
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
                                delay: i * 0.15,
                            }}
                        >
                            <VideoCard {...v} />
                        </motion.div>
                    ))}
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center items-center gap-2 mt-10">
                    {[0, 1, 2].map((i) => (
                        <button
                            key={i}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => setPage(i)}
                            className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${page === i ? 'w-6 bg-gray-700' : 'w-2 bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}