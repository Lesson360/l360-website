'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const FEATURES = [
  {
    title: 'All Pre School\nTopics In\n1 App',
    description:
      'Lorem Ipsum Dolor Sit Amet Consectetur. In Elit Nisi Ipsum Velit Congue. At Varius Vitae Sapien Id Velit. Cras Commodo Duis Facilisi Et Vitae. Lorem Ipsum Dolor Sit Amet Consectetur. In Elit Nisi Ipsum Velit Congue. At Varius Vitae Sapien Id Velit. Cras Commodo Duis Facilisi Et Vitae.',
    bgColor: 'bg-[#2d284b]',
    textColor: 'text-white',
    borderColor: 'border-[#2d284b]',
  },
  {
    title: 'Fun And\nEducational\nWorksheet',
    description:
      'Lorem Ipsum Dolor Sit Amet Consectetur. In Elit Nisi Ipsum Velit Congue. At Varius Vitae Sapien Id Velit. Cras Commodo Duis Facilisi Et Vitae. Lorem Ipsum Dolor Sit Amet Consectetur. In Elit Nisi Ipsum Velit Congue. At Varius Vitae Sapien Id Velit. Cras Commodo Duis Facilisi Et Vitae.',
    bgColor: 'bg-brand-orange',
    textColor: 'text-white',
    borderColor: 'border-[#2d284b]',
  },
  {
    title: 'Activity Based On\nProgress With\nLesson360',
    description:
      'Lorem Ipsum Dolor Sit Amet Consectetur. In Elit Nisi Ipsum Velit Congue. At Varius Vitae Sapien Id Velit. Cras Commodo Duis Facilisi Et Vitae. Lorem Ipsum Dolor Sit Amet Consectetur. In Elit Nisi Ipsum Velit Congue. At Varius Vitae Sapien Id Velit. Cras Commodo Duis Facilisi Et Vitae.',
    bgColor: 'bg-[#5468ff]',
    textColor: 'text-white',
    borderColor: 'border-[#2d284b]',
  },
];

export function Features() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white via-brand-peach/20 to-brand-peach/60 py-20 overflow-hidden font-sans">
      {/* Header Section */}
      <div className="text-center mb-36 relative z-10 font-comic">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-orange flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          <span>Why Do</span>
          <span className="relative inline-block mx-1">
            <span
              className="text-brand-orange relative z-10 font-black tracking-wide"
              style={{
                WebkitTextStroke: '8px #2d284b',
                paintOrder: 'stroke fill',
              }}
            >
              Children
            </span>
            <span className="text-brand-orange absolute left-0 top-0 z-20 font-black tracking-wide">
              Children
            </span>
          </span>
          <span>Love Us!!!</span>
        </h2>
      </div>

      {/* 3D Heart Icon & Dashed Line Container */}
      <div className="max-w-6xl mx-auto relative px-4 z-10">
        {/* The 3D Heart */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-24 z-20">
          <div className="relative w-36 h-36">
            <Image
              src="https://cdn.magicpatterns.com/uploads/2ezoB2Bf1GYqz5rkVubuYW/image_2.png"
              alt="Glossy red heart"
              width={144}
              height={144}
              className="w-36 h-36 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Curved dotted line background */}
        <div className="hidden md:block absolute -top-24 left-0 w-full h-32 z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 128"
            preserveAspectRatio="none"
          >
            <path
              d="M 166,96 Q 500,0 834,96"
              fill="none"
              stroke="#FF4800"
              strokeWidth="6"
              strokeDasharray="0 20"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
          {FEATURES.map((card, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: '-100px',
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
              whileHover={{
                y: -10,
              }}
              className={`${card.bgColor} ${card.textColor} border-4 ${card.borderColor} rounded-[36px] p-8 shadow-xl flex flex-col items-center text-center`}
            >
              <h3 className="text-2xl md:text-3xl font-bold font-comic mb-6 whitespace-pre-line leading-tight">
                {card.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Clouds & Sun Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-0 overflow-hidden">
        {/* Sun (Pure SVG) */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-44 sm:w-60 h-28 sm:h-36 z-10">
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Symmetrical Sun Rays */}
            <g stroke="#FF8A00" strokeWidth="3" strokeLinejoin="round" fill="#FFE43A">
              {/* Ray 1 */}
              <path d="M 25,120 L 15,95 L 45,105 Z" />
              {/* Ray 2 */}
              <path d="M 45,105 L 40,75 L 70,90 Z" />
              {/* Ray 3 */}
              <path d="M 70,90 L 75,55 L 100,80 Z" />
              {/* Ray 4 */}
              <path d="M 100,80 L 110,50 L 130,80 Z" />
              {/* Ray 5 */}
              <path d="M 130,80 L 145,55 L 160,90 Z" />
              {/* Ray 6 */}
              <path d="M 160,90 L 180,75 L 185,105 Z" />
              {/* Ray 7 */}
              <path d="M 185,105 L 205,95 L 195,120 Z" />
            </g>
            {/* Sun Core */}
            <circle cx="100" cy="115" r="50" fill="#FFE43A" stroke="#FF8A00" strokeWidth="3" />
            {/* Sun Highlight Inner */}
            <path d="M 60,100 A 42 42 0 0 1 140,100" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>

        {/* Clouds (Pure SVG Cloud Layer) */}
        <svg viewBox="0 0 1440 180" className="absolute bottom-0 left-0 w-full h-24 sm:h-32 z-20" fill="white" preserveAspectRatio="none">
          <path d="M0,180 L1440,180 L1440,85 C1380,55 1300,55 1240,85 C1180,45 1080,45 1020,85 C940,55 840,55 780,95 C720,55 620,55 560,95 C500,55 400,55 340,85 C280,45 180,45 120,85 C60,55 0,65 0,105 Z" />
        </svg>
      </div>
    </section>
  );
}