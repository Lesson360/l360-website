import Image from 'next/image';
import { Eyebrow, Heading, Lede } from './primitives';

const MOSAIC = [
    { src: '/landing/mother-toddler-tablet.webp', alt: 'A mother and her young daughter learning the alphabet together on the Lesson360 app', big: true, pos: 'center' },
    { src: '/landing/pupil-writing-at-desk.webp', alt: 'A pupil in school uniform writing in her workbook beside a tablet', pos: 'center 35%' },
    { src: '/landing/teacher-leading-class.webp', alt: 'A teacher holding a tablet while leading a class discussion', pos: 'center 30%' },
    { src: '/landing/teens-studying-laptop.webp', alt: 'Three teenagers studying together for exams on a laptop', pos: 'center 40%' },
];

export function FamiliesSection() {
    return (
        <section
            id="families"
            data-section=""
            data-nodevice=""
            data-bg="#FFFFFF"
            className="relative mx-auto flex min-h-screen max-w-[1360px] flex-col justify-center gap-8 px-[clamp(20px,5vw,72px)] py-[clamp(88px,10vw,120px)] sm:gap-10"
        >
            <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-6">
                <div className="flex max-w-[680px] flex-col gap-5">
                    <Eyebrow color="#FF4A00">LESSON360 FAMILIES</Eyebrow>
                    <Heading>Real children. <span className="text-flame">Real progress.</span></Heading>
                </div>
                <Lede className="max-w-[380px] text-ink-soft">
                    Children across Nigeria learn with Lesson360 at home, in class and on the go — and their parents see every step.
                </Lede>
            </div>

            <div className="landing-mosaic pointer-events-auto">
                {MOSAIC.map((p, i) => (
                    <div
                        key={p.src}
                        data-reveal=""
                        data-delay={i * 80}
                        className={`group relative overflow-hidden rounded-[20px] bg-ink/5 sm:rounded-3xl ${p.big ? 'is-big' : ''}`}
                    >
                        <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            sizes={p.big ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 25vw'}
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            style={{ objectPosition: p.pos }}
                        />
                    </div>
                ))}
                <div data-reveal="" data-delay={320} className="flex flex-col justify-end gap-1 rounded-[20px] bg-flame p-4 text-cream sm:rounded-3xl sm:p-6">
                    <div className="font-grotesk text-[clamp(36px,4.4vw,64px)] font-extrabold leading-none tracking-[-.04em]">2M+</div>
                    <div className="text-sm font-medium leading-snug sm:text-base">kids learning with Lesson360</div>
                </div>
            </div>
        </section>
    );
}

const AUDIENCES = [
    { src: '/landing/portrait-parent.webp', title: 'Parents & guardians', sub: 'Follow progress and get updates' },
    { src: '/landing/portrait-teacher.webp', title: 'Teachers', sub: 'Bring videos, quizzes and exams into class' },
    { src: '/landing/portrait-school-admin.webp', title: 'Schools & partners', sub: 'One platform for every learner' },
];

export function CommunitySection() {
    return (
        <section
            id="community"
            data-section=""
            data-nodevice=""
            data-bg="#1C1A45"
            className="relative mx-auto grid min-h-[105vh] max-w-[1360px] items-center gap-14 px-[clamp(20px,5vw,72px)] py-[clamp(88px,10vw,120px)] text-[#F7F2EA] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]"
        >
            <div className="pointer-events-auto flex flex-col gap-6">
                <Eyebrow color="oklch(0.8 0.12 295)">WHO WE SERVE</Eyebrow>
                <Heading>For every home and every classroom.</Heading>
                <Lede className="text-[#CFCBE8]">
                    Parents, guardians, teachers and schools use Lesson360 to keep learning going — on whatever device they have.
                </Lede>
                <div className="flex flex-col">
                    {AUDIENCES.map((a, i) => (
                        <div key={a.title} data-reveal="" data-delay={160 + i * 60} className="flex items-center gap-4 border-t border-[rgba(247,242,234,.14)] py-3.5">
                            <div className="relative h-14 w-14 flex-none overflow-hidden rounded-full bg-white/10">
                                {/* the portraits are circular cut-outs; zoom slightly to hide their white corners */}
                                <Image src={a.src} alt="" fill sizes="56px" className="scale-[1.12] object-cover" />
                            </div>
                            <div>
                                <div className="text-lg font-bold">{a.title}</div>
                                <div className="mt-0.5 text-sm text-[#CFCBE8]">{a.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pointer-events-auto relative mx-auto w-full max-w-[560px] pb-[12%] pl-[12%]">
                <div data-reveal="" className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:rounded-[32px]">
                    <Image
                        src="/landing/teacher-with-pupils.webp"
                        alt="A smiling teacher helping three pupils with their work in class"
                        fill
                        sizes="(max-width: 900px) 90vw, 560px"
                        className="object-cover"
                    />
                </div>
                <div
                    data-reveal=""
                    data-delay="160"
                    className="absolute bottom-0 left-0 aspect-square w-[46%] overflow-hidden rounded-[24px] border-4 border-[#1C1A45] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] sm:rounded-[28px]"
                >
                    <Image
                        src="/landing/mother-son-progress.webp"
                        alt="A mother and son checking his progress on the Lesson360 dashboard"
                        fill
                        sizes="(max-width: 900px) 45vw, 260px"
                        className="object-cover"
                        style={{ objectPosition: '38% center' }}
                    />
                </div>
            </div>
        </section>
    );
}
