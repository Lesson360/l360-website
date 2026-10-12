'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { APP_STORE_URL, PLAY_STORE_URL } from './links';

type Store = 'ios' | 'android';

const STORES: Record<Store, { url: string; name: string; icon: string; iconW: number; iconH: number; top: string; topCls: string; bottom: string }> = {
    ios: { url: APP_STORE_URL, name: 'App Store', icon: '/landing/app-store-icon.png', iconW: 30, iconH: 30, top: 'Download on the', topCls: 'tracking-[.02em]', bottom: 'App Store' },
    android: { url: PLAY_STORE_URL, name: 'Google Play', icon: '/landing/google-play-icon.png', iconW: 28, iconH: 29, top: 'Get it on', topCls: 'uppercase tracking-[.04em]', bottom: 'Google Play' },
};

const badgeCls = 'flex min-w-[170px] items-center gap-3 rounded-[14px] bg-ink py-2.5 pl-3.5 pr-5 leading-[1.05] text-cream transition-[transform,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 hover:bg-flame hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flame';

/**
 * App Store / Google Play badges. Until a store listing exists (its env URL is
 * unset), the badge opens a small "still in development — sign up instead" popup.
 */
export function StoreBadges({ className = '', delay, align = 'start' }: { className?: string; delay?: number; align?: 'start' | 'center' }) {
    const [open, setOpen] = useState<Store | null>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const popId = useId();

    useEffect(() => {
        if (!open) return;
        const onDown = (e: PointerEvent) => { if (!groupRef.current?.contains(e.target as Node)) setOpen(null); };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
        document.addEventListener('pointerdown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const content = (s: Store) => (
        <>
            <Image src={STORES[s].icon} alt="" width={STORES[s].iconW} height={STORES[s].iconH} className="flex-none" style={{ width: STORES[s].iconW, height: STORES[s].iconH }} />
            <span className="flex flex-col gap-0.5 text-left">
                <span className={`text-[11px] font-medium ${STORES[s].topCls}`}>{STORES[s].top}</span>
                <span className="font-grotesk text-[21px] font-bold tracking-[-.01em]">{STORES[s].bottom}</span>
            </span>
        </>
    );

    return (
        <div
            ref={groupRef}
            data-reveal=""
            data-delay={delay}
            className={`pointer-events-auto relative flex flex-wrap gap-2.5 ${align === 'center' ? 'justify-center' : ''} ${className}`}
        >
            {(Object.keys(STORES) as Store[]).map(s => STORES[s].url ? (
                <a key={s} href={STORES[s].url} target="_blank" rel="noopener noreferrer" className={badgeCls}>
                    {content(s)}
                </a>
            ) : (
                <button
                    key={s}
                    type="button"
                    className={badgeCls}
                    aria-expanded={open === s}
                    aria-controls={popId}
                    aria-label={`${STORES[s].name} app — coming soon`}
                    onClick={() => setOpen(o => (o === s ? null : s))}
                >
                    {content(s)}
                </button>
            ))}

            {open && (
                <div
                    id={popId}
                    role="dialog"
                    aria-label={`${STORES[open].name} app coming soon`}
                    className={`absolute bottom-full z-20 mb-3 w-[min(320px,calc(100vw-40px))] rounded-2xl bg-cream p-4 text-left text-ink shadow-[0_24px_50px_-18px_rgba(23,21,58,.55)] ring-1 ring-ink/10 ${align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'}`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="font-jetbrains text-[11px] font-bold tracking-[.12em] text-flame">COMING SOON</div>
                        <button
                            type="button"
                            onClick={() => setOpen(null)}
                            aria-label="Close"
                            className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full text-lg leading-none text-ink-muted hover:bg-ink/5 hover:text-ink"
                        >
                            ×
                        </button>
                    </div>
                    <p className="m-0 mt-1 font-grotesk text-lg font-bold leading-snug">
                        Our {STORES[open].name} app is still in development.
                    </p>
                    <p className="m-0 mt-1.5 text-sm leading-normal text-ink-soft">
                        Sign up now and start learning on the web today — it works on any phone, tablet or laptop.
                    </p>
                    <Link
                        href="/signup"
                        className="mt-3 inline-flex rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-flame hover:text-cream"
                    >
                        Sign up free →
                    </Link>
                </div>
            )}
        </div>
    );
}
