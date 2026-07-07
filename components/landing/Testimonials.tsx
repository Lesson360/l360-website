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
          </div>
          <div className="mt-2">Are Saying.</div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
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
              {/* Quote box */}
              <div className="bg-[#efe1f7] border-4 border-[#ffa9d5] rounded-[28px] p-6 pt-10 relative flex-1">
                <div className="absolute -top-5 left-6 bg-[#863e9b] text-white w-12 h-10 flex items-center justify-center rounded-xl font-sans text-4xl leading-none pt-2 font-black select-none shadow-sm">
                  “
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-sans font-medium">
                  {t.quote}
                </p>
              </div>

              {/* Profile Details box */}
              <div className="flex items-center gap-4 border-4 border-brand-orange bg-[#eaf5ff] rounded-[20px] p-4 mt-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0 flex items-center justify-center text-gray-600 font-semibold text-base">
                  {t.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-[#2d284b] text-base font-comic">
                    {t.name}
                  </p>
                  <p className="text-sm text-gray-500 font-sans">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-3 mt-12">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              aria-label={`Go to testimonial group ${i + 1}`}
              onClick={() => setPage(i)}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                page === i ? 'w-8 bg-[#2d284b]' : 'w-2.5 bg-[#2d284b]/40 hover:bg-[#2d284b]/60'
              }`}
            />
          ))}
        </div>

        {/* View All button */}
        <div className="flex justify-center mt-12 mb-6">
          <button className="relative bg-brand-orange text-white border-4 border-[#2d284b] rounded-[24px] px-16 py-4 text-xl sm:text-2xl font-black font-comic shadow-[0_8px_0_0_#2d284b] active:shadow-[0_0px_0_0_#2d284b] active:translate-y-[8px] hover:translate-y-[2px] hover:shadow-[0_6px_0_0_#2d284b] transition-all focus:outline-none w-full sm:w-auto max-w-md">
            View All
          </button>
        </div>
      </div>

      {/* Mascot decorations */}
      <div className="hidden md:block absolute bottom-0 left-0 w-36 sm:w-44 md:w-56 lg:w-64 h-auto pointer-events-none z-0 mix-blend-multiply">
        <Image
          src="/elephant.jpg"
          alt="Elephant Mascot"
          width={256}
          height={256}
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="hidden md:block absolute bottom-0 right-0 w-36 sm:w-44 md:w-56 lg:w-64 h-auto pointer-events-none z-0 mix-blend-multiply">
        <Image
          src="/dinosaur.jpg"
          alt="Dinosaur Mascot"
          width={256}
          height={256}
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
}