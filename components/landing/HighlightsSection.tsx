import { FileText, GraduationCap, Play, Trophy, Users, Wifi, type LucideIcon } from 'lucide-react';
import { EASE } from './primitives';

const HIGHLIGHTS: { icon: LucideIcon; title: string; sub: string }[] = [
    { icon: Play, title: '3,000+', sub: 'Lessons' },
    { icon: Users, title: 'One-on-One', sub: 'Tutorials' },
    { icon: Wifi, title: 'Live', sub: 'Classes' },
    { icon: FileText, title: 'CBT Exam', sub: 'Practice' },
    { icon: GraduationCap, title: 'Scholarship Opportunities', sub: 'for Exceptional Students' },
    { icon: Trophy, title: 'Science & Essay Competitions', sub: 'for Students' },
];

/** Six-up grid of what Lesson360 offers, directly under the hero. */
export function HighlightsSection() {
    return (
        <section
            id="highlights"
            data-section=""
            data-nodevice=""
            data-bg="#FFFFFF"
            className="relative mx-auto max-w-[1360px] px-[clamp(20px,5vw,72px)] py-[clamp(48px,7vw,96px)]"
        >
            <div className="pointer-events-auto grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {HIGHLIGHTS.map(({ icon: Icon, title, sub }, i) => (
                    <div
                        key={title}
                        data-reveal=""
                        data-delay={i * 60}
                        className={`flex items-center gap-4 rounded-3xl bg-cream p-5 transition-transform duration-500 hover:-translate-y-1 sm:gap-5 sm:p-7 ${EASE}`}
                    >
                        <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-white text-flame sm:h-16 sm:w-16">
                            <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <div className="font-grotesk text-[clamp(19px,1.7vw,24px)] font-extrabold leading-[1.15] tracking-[-.02em]">{title}</div>
                            <div className="mt-1 text-[15px] text-ink-soft sm:text-base">{sub}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
