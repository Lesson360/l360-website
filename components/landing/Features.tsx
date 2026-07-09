'use client';

import Image from 'next/image';

const FEATURES = [
  {
    title: 'Video Lessons\nBy Class And\nSubject',
    description:
      'Children can learn topic by topic with guided lessons arranged by level, class, and subject instead of jumping between random videos online.',
    bgColor: 'bg-[#2d284b]',
    textColor: 'text-white',
    borderColor: 'border-[#2d284b]',
  },
  {
    title: 'Worksheets That\nMake Practice\nStick',
    description:
      'Each lesson can be reinforced with printable activities and revision work that help children practise what they just watched at home.',
    bgColor: 'bg-brand-orange',
    textColor: 'text-white',
    borderColor: 'border-[#FF4800]',
  },
  {
    title: 'Progress Support\nFor Learning At\nHome',
    description:
      'Parents get a clearer way to keep study time consistent, revisit weak areas, and support children with learning that fits their level.',
    bgColor: 'bg-[#5468ff]',
    textColor: 'text-white',
    borderColor: 'border-[#2d284b]',
  },
];

export function Features() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#FFFFFF] to-[#FFCBCB] pt-20 overflow-hidden font-sans">
      {/* Header Section */}
      <div className="text-center mb-44 relative z-10 font-comic">
        <h2 className="text-4xl md:text-5xl lg:text-6xl  text-brand-orange flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
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
      <div className="site-shell relative px-4 z-10">
        {/* The 3D Heart */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-40 z-20">
          <div className="relative w-36 h-36">
            <Image
              src="/feature-heart.png"
              alt="Glossy red heart"
              width={144}
              height={144}
              className="w-36 h-36 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        <div className='border-2 border-dotted border-[#FF6C6C] rounded-full absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-80'>

        </div>


        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
          {FEATURES.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} ${card.textColor} border-4 ${card.borderColor} rounded-[36px] p-8 shadow-xl flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2`}
            >
              <h3 className="text-2xl md:text-3xl font-comic mb-6 whitespace-pre-line leading-tight">
                {card.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Clouds & Sun Decoration */}
      <div className="flex mt-20 items-end w-full">
        <div className=" w-[56%] ">
          <Image
            src="/cloud.png"
            alt="Clouds Transition"
            width={240}
            height={120}
            className="w-full h-full "
          />
        </div>
        {/* Sun Image */}
        <div className="w-[20%] -z-4 -ml-20">
          <Image
            src="/sun.png"
            alt="Sun Decoration"
            width={240}
            height={120}
            className="  h-auto"
          />
        </div>

        {/* Clouds Image */}
        <div className="w-[53%]">
          <Image
            src="/cloud.png"
            alt="Clouds Transition"
            width={240}
            height={120}
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
