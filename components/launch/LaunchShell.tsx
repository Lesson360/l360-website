import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { landingFontVars } from '@/components/landing/fonts';
import { CONTACT } from '@/components/landing/links';

/**
 * Frame for the pre-launch pages (/coming-soon, /waitlist): the landing
 * page's fonts, colours and floating nav, without the 3D stage.
 */
export function LaunchShell({ children, action }: { children: ReactNode; action: { href: string; label: string } }) {
    return (
        <div className={`landing relative flex min-h-screen flex-col overflow-x-clip bg-white font-dm text-ink antialiased ${landingFontVars}`}>
            {/* soft colour fields borrowed from the landing sections */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-[12%] -top-[10%] h-[55vmax] w-[55vmax] rounded-full bg-[#FDE9E0] opacity-80 blur-[90px]" />
                <div className="absolute -right-[16%] top-[18%] h-[50vmax] w-[50vmax] rounded-full bg-[#E6ECFB] opacity-80 blur-[90px]" />
                <div className="absolute -bottom-[18%] left-[22%] h-[45vmax] w-[45vmax] rounded-full bg-[#ECF6DC] opacity-70 blur-[90px]" />
            </div>

            <nav
                aria-label="Main"
                className="fixed left-1/2 top-3 z-20 flex w-[min(1180px,calc(100%-24px))] -translate-x-1/2 items-center justify-between gap-3 rounded-full border border-ink/[.08] bg-[rgba(255,248,236,.74)] py-2 pl-4 pr-2 backdrop-blur-[14px] sm:top-4 sm:py-2.5 sm:pl-5 sm:pr-2.5"
            >
                <Link href="/coming-soon" className="flex flex-none items-center" aria-label="Lesson360">
                    <Image src="/landing/logo.png" alt="Lesson360" width={2576} height={509} priority className="block h-[22px] w-auto sm:h-[26px]" />
                </Link>
                <Link
                    href={action.href}
                    className="whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-[15px] font-bold text-cream transition-colors hover:bg-flame hover:text-cream sm:px-5 sm:py-[11px]"
                >
                    {action.label}
                </Link>
            </nav>

            <main className="relative z-10 flex flex-1 flex-col">{children}</main>

            <footer className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-ink/10 px-[clamp(20px,5vw,72px)] py-6 text-sm text-[#2D2A52]">
                <span>© {new Date().getFullYear()} Lesson360</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <a href={`mailto:${CONTACT.email}`} className="text-[#2D2A52] hover:text-ink hover:underline">{CONTACT.email}</a>
                    <a href={CONTACT.phoneHref} className="text-[#2D2A52] hover:text-ink hover:underline">{CONTACT.phone}</a>
                    <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="text-[#2D2A52] hover:text-ink hover:underline">Instagram</a>
                </div>
            </footer>
        </div>
    );
}
