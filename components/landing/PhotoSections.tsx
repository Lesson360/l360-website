import Image from 'next/image';
import { BookOpenCheck, Cpu, MessageSquareText, Palette, Rocket, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Eyebrow, Heading, Lede, ListRow, StartButton } from './primitives';

// Swap for the generated AI-classroom photo once it's in public/landing/ (portrait, about 4:5).
const AI_PHOTO = { src: '/landing/teens-studying-laptop.webp', alt: 'Students learning together on a laptop' };
const AI_COURSES_URL = '/dashboard/enrichment-courses';

const AI_TRACKS: { icon: LucideIcon; color: string; title: string; sub: string }[] = [
    { icon: Cpu, color: '#FF4A00', title: 'AI Fundamentals', sub: 'What artificial intelligence is and how it works.' },
    { icon: MessageSquareText, color: '#8A63E0', title: 'AI Tools & Prompting', sub: 'Use AI tools well and write clear, effective prompts.' },
    { icon: BookOpenCheck, color: '#3FB57A', title: 'AI for Learning & Productivity', sub: 'Get help with research, study and everyday tasks.' },
    { icon: ShieldCheck, color: '#5B7BEA', title: 'Responsible AI Use', sub: 'Ethics, privacy, accuracy and staying safe online.' },
    { icon: Palette, color: '#EC6FA0', title: 'Creative AI', sub: 'Explore AI for writing, design and content creation.' },
    { icon: Rocket, color: '#F5B935', title: 'Practical AI Projects', sub: 'Put AI skills to work on real-world tasks.' },
];

/** AI Literacy Academy. A photo section, so the 3D phones fade out here and return at the library. */
export function AiAcademySection() {
    return (
        <section
            id="ai-academy"
            data-section=""
            data-nodevice=""
            data-bg="#FFF6EF"
            className="relative mx-auto grid max-w-[1360px] scroll-mt-4 items-center gap-8 px-[clamp(20px,5vw,72px)] py-14 md:min-h-screen md:gap-14 md:py-[clamp(88px,10vw,120px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]"
        >
            <div data-reveal="" className="pointer-events-auto relative aspect-[4/3] overflow-hidden rounded-[24px] sm:rounded-[32px] md:aspect-[4/5]">
                <Image src={AI_PHOTO.src} alt={AI_PHOTO.alt} fill sizes="(max-width: 900px) 92vw, 600px" className="object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1.5 font-jetbrains text-[11px] font-bold tracking-[.1em] text-flame backdrop-blur sm:left-5 sm:top-5">
                    NEW · AI ACADEMY
                </span>
            </div>

            <div className="pointer-events-auto flex flex-col gap-6 md:gap-7">
                <Eyebrow color="#FF4A00">AI LITERACY ACADEMY</Eyebrow>
                <Heading>Learn AI. <span className="text-flame">Use it wisely.</span></Heading>
                <Lede className="text-ink-soft">
                    Understand how artificial intelligence works, use AI tools responsibly and build practical skills for school, work and everyday life.
                </Lede>
                <div className="flex flex-col">
                    {AI_TRACKS.map(({ icon: Icon, color, title, sub }, i) => (
                        <ListRow
                            key={title}
                            lead={<Icon aria-hidden="true" className="h-7 w-7" strokeWidth={2.1} />}
                            leadColor={color}
                            title={title}
                            sub={sub}
                            delay={160 + i * 50}
                            last={i === AI_TRACKS.length - 1}
                            action={<StartButton href={AI_COURSES_URL} label="Explore" />}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

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
            className="relative mx-auto flex max-w-[1360px] flex-col justify-center gap-7 px-[clamp(20px,5vw,72px)] py-14 sm:gap-10 md:min-h-screen md:py-[clamp(88px,10vw,120px)]"
        >
            <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-6">
                <div className="flex max-w-[680px] flex-col gap-5">
                    <Eyebrow color="#FF4A00">LESSON360 FAMILIES</Eyebrow>
                    <Heading>Confident Students and <span className="text-flame">Reassured Parents.</span></Heading>
                </div>
                <Lede className="max-w-[380px] text-ink-soft">
                    Helping Year 6, Year 9 and Year 12 students prepare for their examinations through structured lessons, CBT practice and learning support.
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
                <div data-reveal="" data-delay={320} className="flex flex-col justify-center gap-2.5 rounded-[20px] bg-flame p-4 text-cream sm:rounded-3xl lg:gap-4 lg:p-6">
                    {/* laptop with a graduation cap on its screen */}
                    <svg viewBox="0 0 64 48" className="h-10 w-auto flex-none self-start lg:h-14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="9" y="3" width="46" height="32" rx="4" />
                        <path d="M3 43h58" strokeWidth="4" />
                        <path d="M32 11 19 17l13 6 13-6-13-6Z" fill="currentColor" strokeWidth="1.5" />
                        <path d="M25 21.5v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" strokeWidth="2.5" />
                        <path d="M45 17v6" strokeWidth="2.5" />
                    </svg>
                    <div className="font-grotesk text-[clamp(15px,1.55vw,22px)] font-extrabold leading-[1.15] tracking-[-.02em]">
                        Structured Learning for{' '}
                        <span className="relative inline-block">
                            Better Exam Results.
                            <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-2.5 left-0 h-2.5 w-full text-[#FFD43B]" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" aria-hidden="true">
                                <path d="M4 7c40-5 110-5 192-1" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

const LEARNERS = [
    { title: 'Early Years', range: '6 months – 5 years', sub: 'A strong start for lifelong learning.' },
    { title: 'Primary', range: 'Years 1 – 6', sub: 'Build core skills with confidence.' },
    { title: 'Secondary', range: 'Years 7 – 12', sub: 'Deeper learning and real-world readiness.' },
    { title: 'Exam Classes', range: 'WAEC, NECO, JAMB, IGCSE, SAT, IELTS', sub: 'Focused preparation and practice to excel.' },
    { title: 'PreCollege', range: 'Ages 17 – 20', sub: 'Bridge the gap to university, work and life.' },
];

export function CommunitySection() {
    return (
        <section
            id="community"
            data-section=""
            data-nodevice=""
            data-bg="#1C1A45"
            className="relative mx-auto grid max-w-[1360px] items-center gap-10 px-[clamp(20px,5vw,72px)] py-14 text-[#F7F2EA] md:min-h-[105vh] md:gap-14 md:py-[clamp(88px,10vw,120px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]"
        >
            <div className="pointer-events-auto flex flex-col gap-6">
                <Eyebrow color="oklch(0.8 0.12 295)">WHO WE SERVE</Eyebrow>
                <Heading>For every home and every classroom.</Heading>
                <Lede className="text-[#CFCBE8]">
                    Parents, guardians, teachers and schools use Lesson360 to keep learning going — for learners from 6 months to 20 years, including students in exam classes.
                </Lede>
                <div className="flex flex-col">
                    {LEARNERS.map((l, i) => (
                        <div key={l.title} data-reveal="" data-delay={160 + i * 60} className="flex items-center gap-4 border-t border-[rgba(247,242,234,.14)] py-3.5">
                            <div className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white/10 font-grotesk text-base font-extrabold sm:h-14 sm:w-14 sm:text-lg">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <div>
                                <div className="text-[17px] font-bold leading-snug sm:text-lg">
                                    {l.title} <span className="text-[#FF8A3D]">({l.range})</span>
                                </div>
                                <div className="mt-0.5 text-sm text-[#CFCBE8]">{l.sub}</div>
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
