import { Button } from './primitives';
import { StoreBadges } from './StoreBadges';
import { HeroPhotoColumns } from './HeroPhotoColumns';

const CHIPS = [
    {
        key: 'video',
        lines: ['Video Lessons', 'for Every Level'],
        href: '#explore',
        icon: (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-flame text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" />
                </svg>
            </span>
        ),
    },
    {
        key: 'cbt',
        lines: ['CBT Driller for', 'National & International Exams'],
        href: '#quizzes',
        icon: (
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-flame" fill="currentColor" aria-hidden="true">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6Zm7 1.5V8a1 1 0 0 0 1 1h4.5L13 3.5ZM8 12a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                />
            </svg>
        ),
    },
    {
        key: 'skills',
        lines: ['Professional', 'Skills & Courses'],
        href: '#executive-program',
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-flame" fill="currentColor" aria-hidden="true">
                <path d="M12 3 1 9l11 6 9-4.91V17a1 1 0 1 0 2 0V9L12 3Z" />
                <path d="M5 13.18V17c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.82l-7 3.82-7-3.82Z" />
            </svg>
        ),
    },
];

const STATS = [
    { value: '2M+', label: 'Kids love us' },
    { value: '1000+', label: 'Lessons & games' },
    { value: '1M+', label: 'Parents trust us' },
];

export function Hero() {
    return (
        <section
            data-section=""
            data-hero=""
            data-nodevice=""
            data-bg="#FFFFFF"
            className="relative mx-auto grid min-h-[100svh] max-w-[1360px] items-center gap-8 px-[clamp(20px,5vw,72px)] pb-[60px] pt-[clamp(96px,12vw,120px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr))]"
        >
            <div
                aria-hidden="true"
                data-speed="0.25"
                className="pointer-events-none absolute bottom-[2vh] left-[-2vw] select-none font-grotesk text-[clamp(140px,26vw,380px)] font-extrabold leading-[.8] tracking-[-.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(23,21,58,.08)]"
            >
                360°
            </div>

            <div className="pointer-events-auto relative flex max-w-[620px] flex-col gap-6 sm:gap-7">
                <div data-reveal="" className="flex flex-wrap gap-2 text-[12px] font-bold leading-[1.25]">
                    {CHIPS.map(c => (
                        <a key={c.key} href={c.href} className="flex items-center gap-2 rounded-full bg-cream py-1.5 pl-1.5 pr-3.5text-ink hover:text-flame">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white">{c.icon}</span>
                            <span>
                                {c.lines[0]}
                                <br />
                                {c.lines[1]}
                            </span>
                        </a>
                    ))}
                </div>

                <h1
                    data-reveal=""
                    data-delay="80"
                    className="m-0 text-balance font-grotesk text-[clamp(48px,7.4vw,108px)] font-extrabold leading-[.92] tracking-[-.045em]"
                >
                    Turn screen time into <span className="text-flame">learning time.</span>
                </h1>

                <p data-reveal="" data-delay="160" className="m-0 max-w-[500px] text-pretty text-[clamp(17px,1.4vw,20px)] leading-normal text-ink-soft">
                    From early learning to secondary school, pre-college courses, examination preparation and professional development, Lesson360 brings video lessons, CBT practice and digital learning resources together in one place.
                </p>

                <div data-reveal="" data-delay="220" className="flex flex-wrap gap-x-[clamp(20px,3vw,44px)] gap-y-4">
                    {STATS.map(s => (
                        <div key={s.label}>
                            <div className="font-grotesk text-[clamp(32px,3.6vw,50px)] font-extrabold leading-none tracking-[-.035em]">{s.value}</div>
                            <div className="mt-1.5 text-sm text-ink-muted">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div data-reveal="" data-delay="260" className="flex flex-wrap items-center gap-3">
                    <Button href="/signup" className="px-[30px] py-[18px] text-[17px]">Sign up free →</Button>
                </div>

                <StoreBadges delay={300} />
            </div>

            <HeroPhotoColumns />
        </section>
    );
}
