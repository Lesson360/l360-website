'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AFFILIATE_URL } from './links';

// Learning sections, grouped under "Learn" on desktop to keep the bar short.
const LEARN = [
    { href: '#explore', label: 'Videos', sub: 'Video lessons for every class' },
    { href: '#executive-program', label: 'Executive Development Program', sub: 'Skills beyond the classroom' },
];
// The other sections on this page, plus the footer's contact details.
const OTHER = [
    { href: '#library', label: 'Library' },
    { href: '#start', label: 'Subscription' },
    { href: '#contact', label: 'Contact' },
];
const SECTIONS = [...LEARN, ...OTHER];

export function LandingNav() {
    const [open, setOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    // Close on Escape, on a tap outside the menu, and when the layout grows past the menu breakpoint.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        const onDown = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpen(false); };
        const wide = window.matchMedia('(min-width: 1024px)');
        const onWide = () => { if (wide.matches) setOpen(false); };
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onDown);
        wide.addEventListener('change', onWide);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onDown);
            wide.removeEventListener('change', onWide);
        };
    }, [open]);

    const close = () => setOpen(false);

    return (
        <nav
            ref={navRef}
            aria-label="Main"
            className="fixed left-1/2 top-3 z-[5] w-[min(1180px,calc(100%-24px))] -translate-x-1/2 sm:top-4"
        >
            <div className="flex items-center justify-between gap-3 rounded-full border border-ink/[.08] bg-[rgba(255,248,236,.74)] py-2 pl-4 pr-2 backdrop-blur-[14px] sm:gap-4 sm:py-2.5 sm:pl-5 sm:pr-2.5">
                <a href="#top" onClick={close} className="flex flex-none items-center" aria-label="Lesson360 home">
                    <Image src="/landing/logo.png" alt="Lesson360" width={2576} height={509} priority className="block h-[22px] w-auto sm:h-[26px]" />
                </a>

                <ul className="m-0 hidden list-none items-center gap-[clamp(14px,1.8vw,28px)] p-0 text-[15px] font-medium lg:flex">
                    {/* Opens on hover, or on focus for keyboard and touch; Escape closes it. */}
                    <li
                        className="group relative"
                        onKeyDown={e => { if (e.key === 'Escape') (document.activeElement as HTMLElement | null)?.blur(); }}
                    >
                        <button
                            type="button"
                            aria-haspopup="true"
                            className="flex items-center gap-1 whitespace-nowrap text-ink hover:text-flame group-focus-within:text-flame"
                        >
                            Learn
                            <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                        </button>
                        <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                            <ul className="m-0 w-[300px] list-none rounded-3xl border border-ink/[.08] bg-[rgba(255,248,236,.98)] p-2 shadow-[0_24px_48px_-24px_rgba(23,21,58,.35)] backdrop-blur-[14px]">
                                {LEARN.map(s => (
                                    <li key={s.href}>
                                        <a href={s.href} className="group/item block rounded-2xl px-4 py-3 text-ink hover:bg-ink/[.05] focus-visible:bg-ink/[.05]">
                                            <span className="block font-bold group-hover/item:text-flame">{s.label}</span>
                                            <span className="block text-[13px] text-ink-soft">{s.sub}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                    {OTHER.map(s => (
                        <li key={s.href}>
                            <a href={s.href} className="whitespace-nowrap text-ink hover:text-flame">{s.label}</a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-[clamp(10px,2vw,24px)] text-[15px] font-medium">
                    <a href={AFFILIATE_URL} className="hidden whitespace-nowrap text-ink hover:text-flame xl:inline">
                        Become a Partner
                    </a>
                    <Link href="/login" className="hidden whitespace-nowrap text-ink hover:text-flame min-[420px]:inline">
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="whitespace-nowrap rounded-full bg-ink px-4 py-2.5 font-bold text-cream transition-colors hover:bg-flame hover:text-cream sm:px-5 sm:py-[11px]"
                    >
                        Sign Up
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen(v => !v)}
                        aria-expanded={open}
                        aria-controls="landing-menu"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-ink/15 bg-white/60 text-ink hover:border-ink/40 lg:hidden sm:h-11 sm:w-11"
                    >
                        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {open && (
                <div
                    id="landing-menu"
                    className="mt-2 rounded-[28px] border border-ink/[.08] bg-[rgba(255,248,236,.96)] p-3 shadow-[0_24px_48px_-24px_rgba(23,21,58,.35)] backdrop-blur-[14px] lg:hidden"
                >
                    <ul className="m-0 flex list-none flex-col p-0">
                        {SECTIONS.map(s => (
                            <li key={s.href}>
                                <a
                                    href={s.href}
                                    onClick={close}
                                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-grotesk text-[19px] font-bold tracking-[-.01em] text-ink hover:bg-ink/[.05] hover:text-flame"
                                >
                                    {s.label}
                                    <span aria-hidden="true" className="text-ink/30">→</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-2 grid grid-cols-2 gap-2 border-t border-ink/10 pt-3">
                        <a
                            href={AFFILIATE_URL}
                            onClick={close}
                            className="flex items-center justify-center rounded-full border border-ink/15 px-4 py-3 text-[15px] font-bold text-ink hover:border-ink/40"
                        >
                            Become a Partner
                        </a>
                        <Link
                            href="/login"
                            onClick={close}
                            className="flex items-center justify-center rounded-full border border-ink/15 px-4 py-3 text-[15px] font-bold text-ink hover:border-ink/40"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
