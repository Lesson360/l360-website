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
        <div className="absolute left-1/2 -translate-x-1/2 -top-32 z-20">
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
        <div className="hidden md:block absolute -top-32 left-0 w-full h-40 z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 160"
            preserveAspectRatio="none"
          >
            <path
              d="M 166,128 Q 500,-16 834,128"
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
        {/* Sun Image */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-44 sm:w-60 h-28 sm:h-36 z-10 mix-blend-multiply">
          <Image
            src="/sun.png"
            alt="Sun Decoration"
            width={240}
            height={120}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Clouds Image */}
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 z-20 overflow-hidden mix-blend-screen">
          <Image
            src="/cloud.png"
            alt="Clouds Transition"
            fill
            className="object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  );
}