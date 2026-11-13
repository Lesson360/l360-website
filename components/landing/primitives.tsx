import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { LAPTOP_SHOTS, PHONE_COLORS, PHONE_SHOTS } from './stage/screens';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export const EASE = 'ease-[cubic-bezier(.2,.8,.2,1)]';

export function Eyebrow({ children, color, className }: { children: ReactNode; color: string; className?: string }) {
    return (
        <div data-reveal="" className={cx('relative font-jetbrains text-xs font-bold tracking-[.12em]', className)} style={{ color }}>
            {children}
        </div>
    );
}

export function Heading({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h2
            data-reveal=""
            data-delay="80"
            className={cx('relative m-0 text-balance font-grotesk text-[34px] font-extrabold md:text-[clamp(40px,5vw,76px)] leading-[.95] tracking-[-.04em]', className)}
        >
            {children}
        </h2>
    );
}

export function Lede({ children, className, delay = 140 }: { children: ReactNode; className?: string; delay?: number }) {
    return (
        <p data-reveal="" data-delay={delay} className={cx('m-0 max-w-[500px] text-pretty text-[clamp(17px,1.4vw,19px)] leading-[1.55]', className)}>
            {children}
        </p>
    );
}

export function Chip({ children, className, href }: { children: ReactNode; className?: string; href?: string }) {
    const cls = cx('rounded-full px-4 py-2.5 text-sm font-bold', className);
    return href ? <a href={href} className={cls}>{children}</a> : <span className={cls}>{children}</span>;
}

type ButtonTone = 'ink' | 'cream' | 'flame' | 'outline';
const TONES: Record<ButtonTone, string> = {
    ink: 'bg-ink text-cream shadow-[0_14px_30px_-12px_rgba(23,21,58,.6)] hover:bg-flame hover:text-cream',
    cream: 'bg-cream text-ink hover:bg-flame hover:text-cream',
    flame: 'bg-flame text-cream hover:bg-[#FF8A3D] hover:text-ink',
    outline: 'border-[1.5px] border-ink text-ink hover:bg-[#FFE1D2]',
};

export function Button({ href, tone = 'ink', children, className }: { href: string; tone?: ButtonTone; children: ReactNode; className?: string }) {
    const cls = cx(
        'inline-flex items-center justify-center rounded-full px-7 py-4 text-base font-bold transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flame',
        EASE,
        TONES[tone],
        className,
    );
    if (href.startsWith('/')) return <Link href={href} className={cls}>{children}</Link>;
    const external = /^https?:/.test(href);
    return <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}

/** Numbered or icon-led row used by the app, quiz and exam lists. */
export function ListRow({ lead, leadColor, title, sub, action, delay, last }: {
    lead: ReactNode; leadColor?: string; title: string; sub: string; action?: ReactNode; delay: number; last?: boolean;
}) {
    return (
        <div
            data-reveal=""
            data-delay={delay}
            className={cx(
                'grid items-center gap-4 border-t border-ink/15 py-[18px]',
                action ? 'grid-cols-[44px_1fr_auto] sm:grid-cols-[56px_1fr_auto]' : 'grid-cols-[44px_1fr] sm:grid-cols-[56px_1fr]',
                last && 'border-b',
            )}
        >
            <div className="font-grotesk text-[28px] font-extrabold leading-none" style={{ color: leadColor }}>{lead}</div>
            <div className="min-w-0">
                <div className="text-[17px] font-bold sm:text-[19px]">{title}</div>
                <div className="mt-1 text-[15px] text-[#4A4770]">{sub}</div>
            </div>
            {action}
        </div>
    );
}

export function StartButton({ href = '/signup', label = 'Start' }: { href?: string; label?: string }) {
    return (
        <Link href={href} className="whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-flame hover:text-cream">
            {label}
        </Link>
    );
}

/**
 * Two-column feature section: copy on one side, an empty [data-slot] on the
 * other that the 3D stage fills with a device. Collapses to one column on
 * narrow screens (the stage moves the slot above the copy).
 */
export function FeatureSection({ id, index, bg, slot, className, children }: {
    id?: string; index: number; bg: string; slot: 'left' | 'right'; className?: string; children: ReactNode;
}) {
    // The 3D stage only runs from the md breakpoint up (see LandingStage); phones get a static screenshot instead.
    const slotEl = <div data-slot="" className="hidden min-h-[min(80vh,760px)] md:block" />;
    return (
        <section
            id={id}
            data-section=""
            data-feature={index}
            data-bg={bg}
            className={cx(
                'relative mx-auto grid max-w-[1360px] scroll-mt-4 items-center gap-7 px-[clamp(20px,5vw,72px)] py-14 md:min-h-[115vh] md:gap-12 md:py-[clamp(88px,10vw,120px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]',
                className,
            )}
        >
            <MobileDevice index={index} tilt={slot === 'left' ? '-rotate-3' : 'rotate-3'} />
            {slot === 'left' && slotEl}
            <div className="pointer-events-auto relative flex flex-col gap-6 md:gap-7">{children}</div>
            {slot === 'right' && slotEl}
        </section>
    );
}

/**
 * Phone-sized stand-in for the 3D devices: the section's app screenshot in a
 * plain frame, cropped and faded at the bottom so it stays compact.
 */
function MobileDevice({ index, tilt }: { index: number; tilt: string }) {
    const k = index % PHONE_SHOTS.length;
    const laptop = DESKTOP_SHOT_FEATURES[index];
    if (laptop) {
        return (
            <div data-reveal="" aria-hidden="true" className="mx-auto w-full max-w-[420px] md:hidden">
                <div className="rounded-[14px] p-[5px] shadow-[0_24px_40px_-22px_rgba(23,21,58,.5)]" style={{ backgroundColor: PHONE_COLORS[k] }}>
                    <Image src={laptop} alt="" width={1280} height={800} sizes="(max-width: 767px) 90vw, 1px" className="block h-auto w-full rounded-[10px]" />
                </div>
            </div>
        );
    }
    return (
        <div
            data-reveal=""
            aria-hidden="true"
            className="flex h-[250px] justify-center overflow-hidden pt-3 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] md:hidden"
        >
            <div className={cx('h-max w-[178px] rounded-[30px] p-[5px] shadow-[0_24px_40px_-18px_rgba(23,21,58,.5)]', tilt)} style={{ backgroundColor: PHONE_COLORS[k] }}>
                <Image src={PHONE_SHOTS[k]} alt="" width={736} height={1600} sizes="(max-width: 767px) 178px, 1px" className="block h-auto w-full rounded-[25px]" />
            </div>
        </div>
    );
}

// Feature sections whose device is a laptop with a real desktop screenshot.
const DESKTOP_SHOT_FEATURES: Record<number, string | undefined> = { 7: LAPTOP_SHOTS.exam };
