import { Button, StoreBadges } from './primitives';

const CHIPS = [
    { label: '3,000+ VIDEO LESSONS', href: '#explore' },
    { label: '200+ QUIZZES', href: '#quizzes' },
    { label: 'ENRICHMENT COURSES', href: '#app' },
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
                <div data-reveal="" className="flex flex-wrap gap-2 font-jetbrains text-[11px] font-bold tracking-[.06em] sm:text-xs">
                    {CHIPS.map(c => (
                        <a key={c.label} href={c.href} className="rounded-full border border-ink/[.12] bg-cream px-3 py-[7px] text-ink hover:text-flame">
                            {c.label}
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
                    Video lessons, fun quizzes, exams and enrichment courses — for early years, nursery, primary and secondary learners.
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
                    <Button href="#explore" tone="outline" className="px-[26px] py-[17px] text-[17px]">Explore lessons</Button>
                </div>

                <StoreBadges delay={300} />
            </div>

            <div data-slot="hero" className="relative flex min-h-[min(72vh,660px)] items-end justify-center">
                <div className="hidden font-jetbrains text-[11px] font-bold tracking-[.12em] text-ink-muted min-[900px]:block [@media(hover:none)]:hidden">
                    HOVER A PHONE · CLICK TO JUMP
                </div>
            </div>
        </section>
    );
}
