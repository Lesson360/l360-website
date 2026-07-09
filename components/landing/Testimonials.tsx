'use client';

import { useState } from 'react';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    quote:
      'Lesson360 makes it easier for my child to revisit lessons after school without needing me to explain everything from the beginning again.',
    name: 'Aisha Mohammed',
    role: 'Guardian',
  },
  {
    quote:
      'I like that the videos, worksheets, and simple checks all support the same topic. It makes learning feel organised instead of scattered.',
    name: 'Daniel Mackenzy',
    role: 'Guardian',
  },
  {
    quote:
      'What stands out for me is how easy it is to choose the right level and keep my child on a steady learning routine every week.',
    name: 'Sarah Emmanuel',
    role: 'Guardian',
  },
];

export function Testimonials() {
  const [page, setPage] = useState(0);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-[#cfe8ff] py-16 sm:py-20 px-4">
      <div className="site-shell relative z-10 mb-40">
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
            <div
              key={i}
              className="flex flex-col"
            >
              {/* Quote box */}
              <div className="bg-[#83007833] border-4 border-[#FF8CCF] rounded-[28px] p-6 pt-10 relative flex-1">
                <Image src='/quote.png' alt='QUote image' width='40' height='44' className="absolute -top-[18px] left-6 " />
                <p className="text-sm text-gray-700 leading-relaxed font-sans font-medium">
                  {t.quote}
                </p>
              </div>

              {/* Profile Details box */}
              <div className="flex items-center gap-4 border-2 border-brand-orange bg-[#eaf5ff] rounded-[20px] p-4 mt-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#D9D9D9] shrink-0 flex items-center justify-center text-gray-600 font-semibold text-base">
                  {t.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-[#2d284b] text-base font-comic">
                    {t.name}
                  </p>
                  <p className="text-sm text-gray-500 font-sans">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-3 mt-12">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              aria-label={`Go to testimonial group ${i + 1}`}
              onClick={() => setPage(i)}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${page === i ? 'w-8 bg-[#2d284b]' : 'w-2.5 bg-[#2d284b]/40 hover:bg-[#2d284b]/60'
                }`}
            />
          ))}
        </div>

        {/* View All button */}
        <div className="flex justify-center mt-12 mb-6">
          <button
            className="inline-block relative w-[90vw] md:w-full m-auto max-w-[640px] h-12 group"
          >
            {/* White rotated background - behind everything */}
            <span className='absolute inset-0 bg-[#2d284b] rounded-xl transition-transform duration-300 rotate-3 group-hover:rotate-0'></span>

            {/* Orange button on top */}
            <span className="inline-block w-full bg-brand-orange hover:bg-brand-orange-deep transition-colors text-white font-semibold px-7 py-2.5 rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 relative font-comic text-center top-0 bottom-0">
              View All
            </span>
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
