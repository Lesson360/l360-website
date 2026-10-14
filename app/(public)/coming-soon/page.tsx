import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LaunchShell } from '@/components/launch/LaunchShell';

export const metadata: Metadata = {
    title: 'Coming soon',
    description: 'Lesson360 is almost here. Join the waitlist to be first in line when we launch.',
    // Pre-launch page under review — keep it out of search results for now.
    robots: { index: false, follow: false },
};

const TEASERS = [
    { icon: '🎬', title: 'Video lessons', sub: '3,000+ lessons to pause, replay and master', bg: 'bg-[#FFF1C9]' },
    { icon: '🧮', title: 'Quizzes & exams', sub: 'Practice that tracks every step of progress', bg: 'bg-[#DDF2F1]' },
    { icon: '📚', title: 'Digital library', sub: 'Storybooks, textbooks and revision guides', bg: 'bg-[#ECF6DC]', isNew: true },
    { icon: '🎥', title: 'Live classes', sub: 'Real-time learning with real teachers', bg: 'bg-[#E6ECFB]' },
];

export default function ComingSoonPage() {
    return (
        <LaunchShell action={{ href: '/waitlist', label: 'Join the waitlist' }}>
            <section className="mx-auto grid w-full max-w-[1360px] flex-1 items-center gap-12 px-[clamp(20px,5vw,72px)] pb-16 pt-[clamp(104px,13vw,140px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
                <div className="flex max-w-[620px] flex-col gap-6 sm:gap-7">
                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-ink/[.12] bg-cream px-3 py-[7px] font-jetbrains text-[11px] font-bold tracking-[.08em] sm:text-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-60 motion-reduce:animate-none" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
                        </span>
                        COMING SOON
                    </div>

                    <h1 className="m-0 text-balance font-grotesk text-[clamp(46px,7vw,100px)] font-extrabold leading-[.92] tracking-[-.045em]">
                        Learning time is <span className="text-flame">almost here.</span>
                    </h1>

                    <p className="m-0 max-w-[520px] text-pretty text-[clamp(17px,1.4vw,20px)] leading-normal text-ink-soft">
                        We’re putting the finishing touches on Lesson360 — video lessons, quizzes, exams and a digital library of books for early years,
                        nursery, primary and secondary learners. Join the waitlist and be first in line when we open the doors.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Link
                            href="/waitlist"
                            className="inline-flex items-center justify-center rounded-full bg-ink px-[30px] py-[18px] text-[17px] font-bold text-cream shadow-[0_14px_30px_-12px_rgba(23,21,58,.6)] transition-[transform,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 hover:bg-flame hover:text-cream"
                        >
                            Join the waitlist →
                        </Link>
                        <span className="text-sm text-ink-muted">Free to join · No spam, ever</span>
                    </div>
                </div>

                {/* Visual: photos and the app, floating */}
                <div className="relative mx-auto aspect-[6/5] w-full max-w-[560px]">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-[6%] left-1/2 -translate-x-1/2 select-none font-grotesk text-[clamp(120px,20vw,280px)] font-extrabold leading-none tracking-[-.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(23,21,58,.08)]"
                    >
                        360°
                    </div>
                    <div className="launch-float absolute left-0 top-[4%] w-[50%] [--tilt:-4deg]">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] shadow-[0_30px_60px_-24px_rgba(23,21,58,.45)] sm:rounded-[28px]">
                            <Image src="/landing/mother-toddler-tablet.webp" alt="A mother and her daughter learning together on a tablet" fill sizes="(max-width: 760px) 50vw, 280px" className="object-cover" />
                        </div>
                    </div>
                    <div className="launch-float absolute bottom-[2%] right-0 w-[52%] [--tilt:3deg] [animation-delay:-3s]">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] shadow-[0_30px_60px_-24px_rgba(23,21,58,.45)] sm:rounded-[26px]">
                            <Image src="/landing/teens-studying-laptop.webp" alt="Teenagers studying together on a laptop" fill sizes="(max-width: 760px) 52vw, 290px" className="object-cover" />
                        </div>
                    </div>
                    <div className="absolute left-1/2 top-1/2 z-10 w-[34%] -translate-x-1/2 -translate-y-1/2">
                        <div className="launch-float [animation-delay:-1.5s]">
                            <Image
                                src="/landing/app-welcome.png"
                                alt="The Lesson360 app welcome screen"
                                width={616}
                                height={891}
                                sizes="(max-width: 760px) 34vw, 190px"
                                className="h-auto w-full drop-shadow-[0_30px_40px_rgba(23,21,58,.4)]"
                            />
                        </div>
                    </div>
                    <div className="launch-float absolute right-[6%] top-[6%] rounded-full bg-flame px-3.5 py-2 font-jetbrains text-[11px] font-bold tracking-[.08em] text-cream shadow-lg [--tilt:6deg] [animation-delay:-4s] sm:text-xs">
                        NEW: DIGITAL LIBRARY
                    </div>
                </div>
            </section>

            <section aria-label="What’s coming" className="mx-auto w-full max-w-[1360px] px-[clamp(20px,5vw,72px)] pb-16">
                <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]">
                    {TEASERS.map(t => (
                        <div key={t.title} className={`relative flex flex-col gap-2 rounded-3xl p-6 ${t.bg}`}>
                            {t.isNew && (
                                <span className="absolute right-4 top-4 rounded-full bg-ink px-2.5 py-1 font-jetbrains text-[10px] font-bold tracking-[.1em] text-cream">NEW</span>
                            )}
                            <span aria-hidden="true" className="text-[28px] leading-none">{t.icon}</span>
                            <div className="mt-1 font-grotesk text-[22px] font-extrabold tracking-[-.02em]">{t.title}</div>
                            <div className="text-sm leading-snug text-ink-soft">{t.sub}</div>
                        </div>
                    ))}
                </div>
            </section>
        </LaunchShell>
    );
}
