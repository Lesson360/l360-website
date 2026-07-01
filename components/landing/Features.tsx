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
    bgColor: 'bg-[#ff5714]',
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
    <section className="relative w-full bg-gradient-to-b from-[#fff5f0] to-[#ffd1c4] py-20 overflow-hidden font-sans">
      {/* Header Section */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#ff5714] flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          <span>Why Do</span>
          <span className="relative inline-block">
            <span
              className="text-[#ff5714] relative z-10 font-black tracking-wide"
              style={{
                WebkitTextStroke: '8px #2d284b',
                paintOrder: 'stroke fill',
              }}
            >
              Children
            </span>
            <span className="text-[#ff5714] absolute left-0 top-0 z-20 font-black tracking-wide">
              Children
            </span>
          </span>
          <span>Love Us!!!</span>
        </h2>
      </div>

      {/* 3D Heart Icon & Dashed Line Container */}
      <div className="max-w-6xl mx-auto relative px-4 z-10">
        {/* The 3D Heart */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-20">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-24 h-24"
          >
            <Image
              src="https://cdn.magicpatterns.com/uploads/2ezoB2Bf1GYqz5rkVubuYW/image_2.png"
              alt="Glossy red heart"
              width={96}
              height={96}
              className="w-24 h-24 object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>

        {/* Dashed curved line background */}
        <div className="hidden md:block absolute top-10 left-0 w-full h-40 z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
          >
            <path
              d="M 50,150 Q 250,20 500,20 T 950,150"
              fill="none"
              stroke="#ff8a66"
              strokeWidth="2"
              strokeDasharray="8,8"
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
              className={`${card.bgColor} ${card.textColor} border-4 ${card.borderColor} rounded-3xl p-8 shadow-xl flex flex-col items-center text-center`}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 whitespace-pre-line leading-tight">
                {card.title}
              </h3>
              <p className="text-sm opacity-90 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Clouds & Sun Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-0 overflow-hidden">
        {/* Sun */}
        <Image
          src="https://cdn.magicpatterns.com/uploads/cCkwphH3pJYKU5tVE24dY6/image_5.jpg"
          alt=""
          aria-hidden="true"
          width={224}
          height={224}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-auto z-0 mix-blend-multiply"
        />

        {/* Clouds */}
        <div className="absolute bottom-0 left-0 w-full h-full flex justify-between items-end">
          {/* Left Cloud Group */}
          <div className="relative w-1/3 h-32">
            <div className="absolute bottom-0 -left-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-0 left-20 w-48 h-24 bg-white rounded-full"></div>
          </div>

          {/* Right Cloud Group */}
          <div className="relative w-1/3 h-32">
            <div className="absolute bottom-0 -right-10 w-48 h-48 bg-white rounded-full"></div>
            <div className="absolute bottom-12 right-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-0 right-32 w-40 h-24 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}