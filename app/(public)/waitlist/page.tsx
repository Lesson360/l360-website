import type { Metadata } from 'next';
import Image from 'next/image';
import { LaunchShell } from '@/components/launch/LaunchShell';
import { WaitlistForm } from '@/components/launch/WaitlistForm';

export const metadata: Metadata = {
    title: 'Join the waitlist',
    description: 'Be first in line when Lesson360 launches — video lessons, quizzes, exams and a digital library for every learner.',
    robots: { index: false, follow: false },
};

const PERKS = [
    { icon: '⚡', title: 'Early access', sub: 'Get in before everyone else when we open.' },
    { icon: '📣', title: 'Launch updates', sub: 'Hear first about new features and launch dates.' },
    { icon: '🔒', title: 'No spam, ever', sub: 'Only Lesson360 news. Unsubscribe in one click.' },
];

const FACES = ['/landing/portrait-parent.webp', '/landing/portrait-teacher.webp', '/landing/portrait-school-admin.webp'];

export default function WaitlistPage() {
    return (
        <LaunchShell action={{ href: '/coming-soon', label: '← Back' }}>
            <section className="mx-auto grid w-full max-w-[1360px] flex-1 items-start gap-8 px-[clamp(20px,5vw,72px)] pb-16 pt-[clamp(104px,13vw,140px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-x-16 lg:gap-y-8">
                <div className="flex max-w-[560px] flex-col gap-6 lg:col-start-1 lg:row-start-1">
                    <div className="self-start rounded-full border border-ink/[.12] bg-cream px-3 py-[7px] font-jetbrains text-[11px] font-bold tracking-[.08em] sm:text-xs">
                        THE WAITLIST
                    </div>
                    <h1 className="m-0 text-balance font-grotesk text-[clamp(44px,6vw,84px)] font-extrabold leading-[.92] tracking-[-.045em]">
                        Be first in line for <span className="text-flame">Lesson360.</span>
                    </h1>
                    <p className="m-0 max-w-[500px] text-pretty text-[clamp(17px,1.4vw,19px)] leading-normal text-ink-soft">
                        Leave your details and we’ll let you know the moment Lesson360 opens — for your family, your class or your school.
                    </p>
                </div>

                {/* On phones the form follows the headline; on desktop it sits in the right column. */}
                <div className="w-full max-w-[560px] justify-self-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end">
                    <WaitlistForm />
                </div>

                <div className="flex max-w-[560px] flex-col gap-6 lg:col-start-1 lg:row-start-2">
                    <div className="flex flex-col">
                        {PERKS.map((p, i) => (
                            <div key={p.title} className={`grid grid-cols-[44px_1fr] items-center gap-4 border-t border-ink/15 py-4 ${i === PERKS.length - 1 ? 'border-b' : ''}`}>
                                <span aria-hidden="true" className="text-[26px] leading-none">{p.icon}</span>
                                <div>
                                    <div className="text-[17px] font-bold">{p.title}</div>
                                    <div className="mt-0.5 text-[15px] text-[#4A4770]">{p.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {FACES.map(src => (
                                <div key={src} className="relative h-11 w-11 overflow-hidden rounded-full ring-[3px] ring-white">
                                    <Image src={src} alt="" fill sizes="44px" className="scale-[1.12] object-cover" />
                                </div>
                            ))}
                        </div>
                        <p className="m-0 text-sm leading-snug text-ink-soft">
                            For parents, teachers and schools across Nigeria.
                        </p>
                    </div>
                </div>
            </section>
        </LaunchShell>
    );
}
