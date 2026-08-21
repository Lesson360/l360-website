'use client';

import Image from 'next/image';

const FEATURES = [
  {
    title: 'All Pre School\nTopics In\n1 App',
    bgColor: 'bg-[#F2FCE4]',
    borderColor: 'border-gray-300',
    image: '/feature-col1-phone.png',
    alt: 'Lesson360 Pre-School App',
  },
  {
    title: 'Fun And Educational\nWorksheet',
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
    image: '/feature-col2-phone.png',
    alt: 'Fun and Educational Worksheet Test',
  },
  {
    title: 'Activity Based On\nProgress With\nLesson360',
    bgColor: 'bg-[#FFF0F2]',
    borderColor: 'border-gray-300',
    image: '/feature-col3-phone.png',
    alt: 'Activity Progress Dashboard',
  },
];

export function Features() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#FFFFFF] via-[#FFF8F8] to-[#FFD8D8] pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden font-sans">

      {/* Glossy Red Heart 1 (Top-Left) */}
      <motion.div
        initial={{ scale: 0.8, rotate: -15 }}
        animate={{ y: [0, -8, 0], rotate: [-15, -10, -15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-3 sm:top-12 sm:left-8 md:left-16 z-20 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 pointer-events-none select-none drop-shadow-md"
      >
        <Image
          src="https://cdn.magicpatterns.com/uploads/2ezoB2Bf1GYqz5rkVubuYW/image_2.png"
          alt="Glossy red heart badge"
          fill
          sizes="80px"
          className="object-contain"
        />
      </motion.div>

      {/* Header Section */}
      <div className="text-center mb-10 sm:mb-14 relative z-10 font-comic px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-orange flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
          <span>Why Do</span>
          <span className="relative inline-block mx-1">
            <span
              className="text-brand-orange relative z-10 font-black tracking-wide"
              style={{
                WebkitTextStroke: '6px #2d284b',
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

      {/* 3D Cards Grid Container */}
      <div className="max-w-6xl mx-auto relative px-4 sm:px-6 lg:px-8 z-10">

        {/* Cards Grid - Identical Height for All 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3  relative z-10">
          {FEATURES.map((card, index) => (
            <div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6 }}
              className={`${card.bgColor} rounded-[28px] sm:rounded-[32px] pt-6 sm:pt-8 px-4 shadow-sm flex flex-col items-center text-center overflow-hidden relative h-[280px] sm:h-[320px] md:h-[340px] w-full`}
            >
              {/* Card Title - Positioned close above phone image */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-normal font-comic text-[#1E1B3A] mb-3 sm:mb-4 whitespace-pre-line leading-tight">
                {card.title}
              </h3>

              {/* Phone Image - Directly inside container taking 90% width */}
              <div className="w-full flex-grow flex items-start justify-center overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={440}
                  height={600}
                  priority={index === 0}
                  className="w-[90%] sm:w-full h-auto object-top object-fit"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Glossy Red Heart 2 (Bottom-Right) */}
      <motion.div
        initial={{ scale: 0.8, rotate: 15 }}
        animate={{ y: [0, 8, 0], rotate: [15, 20, 15] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-3 sm:bottom-24 sm:right-8 md:right-16 z-20 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 pointer-events-none select-none drop-shadow-md"
      >
        <Image
          src="https://cdn.magicpatterns.com/uploads/2ezoB2Bf1GYqz5rkVubuYW/image_2.png"
          alt="Glossy red heart badge bottom"
          fill
          sizes="80px"
          className="object-contain"
        />
      </motion.div>

      

    </section>
  );
}
