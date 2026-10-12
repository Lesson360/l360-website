import Link from 'next/link';
import type { ReactNode } from 'react';

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
            className={cx('relative m-0 text-balance font-grotesk text-[clamp(40px,5vw,76px)] font-extrabold leading-[.95] tracking-[-.04em]', className)}
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

/** Large outlined section number that drifts with scroll. */
export function GhostNumber({ n, stroke }: { n: string; stroke: string }) {
    return (
        <div
            aria-hidden="true"
            data-speed="-0.18"
            className="pointer-events-none absolute -left-3 -top-[120px] select-none font-grotesk text-[clamp(150px,18vw,220px)] font-extrabold leading-none text-transparent"
            style={{ WebkitTextStroke: `1.5px ${stroke}` }}
        >
            {n}
        </div>
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
    const slotEl = <div data-slot="" className="min-h-[min(80vh,760px)]" />;
    return (
        <section
            id={id}
            data-section=""
            data-feature={index}
            data-bg={bg}
            className={cx(
                'relative mx-auto grid min-h-[115vh] max-w-[1360px] scroll-mt-4 items-center gap-12 px-[clamp(20px,5vw,72px)] py-[clamp(88px,10vw,120px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]',
                className,
            )}
        >
            {slot === 'left' && slotEl}
            <div className="pointer-events-auto relative flex flex-col gap-7">{children}</div>
            {slot === 'right' && slotEl}
        </section>
    );
}
