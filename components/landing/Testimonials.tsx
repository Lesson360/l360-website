'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis Elementum In Odio. Diam In Justo Neque Arcu',
    name: 'Aisha Mohammed',
    role: 'Kids Mom',
  },
  {
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis Elementum In Odio. Diam In Justo Neque Arcu',
    name: 'Daniel Mackenzy',
    role: 'Kids Dad',
  },
  {
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis Elementum In Odio. Diam In Justo Neque Arcu',
    name: 'Sarah Emmanuel',
    role: 'Kids Mom',
  },
];

export function Testimonials() {
  const [page, setPage] = useState(0);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-[#cfe8ff] py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#ec5a13] font-display text-center leading-tight mb-14 flex flex-wrap justify-center items-center gap-x-3 gap-y-2">
          <span>Check Out What</span>
          <span className="relative inline-block">
            <span
              className="relative z-10 font-black"
              style={{
                WebkitTextStroke: '6px #2d284b',
                paintOrder: 'stroke fill',
                color: '#ec5a13',
              }}
            >
              Guardians
            </span>
            <span className="absolute left-0 top-0 z-20 font-black text-[#ec5a13]">
              Guardians
            </span>
          </span>
          <span className="w-full text-center">Are Saying.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, i) => (
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
              className="flex flex-col"
            >
              <div className="bg-[#efe1f7] border border-[#d9b8ec] rounded-2xl p-6 relative flex-1">
                <span
                  aria-hidden="true"
                  className="text-5xl leading-none text-[#8b5cf6] font-serif"
                >
                  &#8220;
                </span>
                <p className="text-sm text-gray-600 leading-relaxed -mt-3">
                  {t.quote}
                </p>
              </div>
              <div className="flex items-center gap-3 border border-gray-200 bg-white rounded-xl p-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              aria-label={`Go to testimonial group ${i + 1}`}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
                page === i ? 'w-6 bg-gray-700' : 'w-2 bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* View All button */}
        <div className="flex justify-center mt-8">
          <button className="bg-[#ec5a13] hover:bg-[#d94e0a] transition-colors text-white text-lg font-semibold px-16 py-3.5 rounded-xl border-2 border-[#2d284b] shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 w-full sm:w-auto max-w-md">
            View All
          </button>
        </div>
      </div>

      {/* Mascot decorations */}
      <span
        aria-hidden="true"
        className="hidden lg:block absolute bottom-4 left-6 text-6xl select-none"
      >
        🐘
      </span>
      <span
        aria-hidden="true"
        className="hidden lg:block absolute bottom-4 right-6 text-6xl select-none"
      >
        🦖
      </span>
    </section>
  );
}