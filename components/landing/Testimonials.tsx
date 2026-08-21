'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis',
    name: 'Micheal Adewale',
    avatar: '/guy-pressing-phone.png',
  },
  {
    id: 2,
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis',
    name: 'Micheal Adewale',
    avatar: '/guy-pressing-phone.png',
  },
  {
    id: 3,
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis',
    name: 'Micheal Adewale',
    avatar: '/guy-pressing-phone.png',
  },
  {
    id: 4,
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis',
    name: 'Anabelle Joseph',
    avatar: '/secondary-student.jpg',
  },
  {
    id: 5,
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis',
    name: 'Anabelle Joseph',
    avatar: '/secondary-student.jpg',
  },
  {
    id: 6,
    quote:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Pretium Amet Sed Pharetra Dignissim Vestibulum Mattis',
    name: 'Anabelle Joseph',
    avatar: '/secondary-student.jpg',
  },
];

export function Testimonials() {
  const [page, setPage] = useState(0);

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Title Header */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-orange font-comic text-center leading-tight mb-16">
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2">
            <span>Check Out What</span>
            <span className="relative inline-block">
              <span
                className="relative z-10 font-black"
                style={{
                  WebkitTextStroke: '6px #2d284b',
                  paintOrder: 'stroke fill',
                  color: '#FF4800',
                }}
              >
                Guardians
              </span>
              <span className="absolute left-0 top-0 z-20 font-black text-brand-orange">
                Guardians
              </span>
            </span>
            <span>Are Saying.</span>
          </div>
        </h2>

        {/* 6 Testimonial Cards (2 Rows x 3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-6 lg:gap-x-8 mb-12">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-[#FCFDF2] border border-[#2D284B]/30 rounded-2xl p-5 pt-8 pb-7 flex flex-col justify-between shadow-sm"
            >
              {/* Top-Left Avatar Badge */}
              <div className="absolute -top-4 -left-1 w-11 h-11 rounded-full border border-black overflow-hidden bg-gray-200 shadow-sm z-10">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quote Text */}
              <p className="text-xs sm:text-sm text-gray-800 font-sans font-medium leading-relaxed mb-4">
                {t.quote}
              </p>

              {/* 5 Green Rating Stars */}
              <div className="flex items-center gap-1 text-[#10B981] text-base mb-1">
                {[...Array(5)].map((_, starIndex) => (
                  <svg key={starIndex} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Bottom-Right Yellow Name Pill */}
              <div className="absolute -bottom-3.5 -right-2 bg-[#FFFF40] border border-black/20 text-[#1E1B3A] font-bold text-xs px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                {t.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2.5 mt-8 mb-10">
          <div className="w-8 h-2 bg-[#2D284B] rounded-full" />
          <div className="w-2 h-2 bg-[#2D284B] rounded-full" />
          <div className="w-2 h-2 bg-[#2D284B] rounded-full" />
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-6 mb-6">
          <button className="inline-block relative w-[90vw] sm:w-[320px] md:w-[420px] m-auto h-14 group">
            {/* Dark navy rotated background */}
            <span className="absolute inset-0 bg-[#2d284b] rounded-xl transition-transform duration-300 rotate-3 group-hover:rotate-0" />

            {/* Orange button on top */}
            <span className="inline-block w-full h-full bg-brand-orange hover:bg-brand-orange-deep transition-colors text-white font-bold px-7 py-3.5 rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 relative font-comic text-center text-xl sm:text-2xl flex items-center justify-center">
              View All
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
