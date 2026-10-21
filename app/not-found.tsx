import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CreditCard, FileText, Home, HelpCircle, MonitorPlay } from 'lucide-react';
import { landingFontVars } from '@/components/landing/fonts';
import { CONTACT } from '@/components/landing/links';
import { UnpluggedPhone } from '@/components/not-found/UnpluggedPhone';

export const metadata: Metadata = {
    title: 'Page not found',
    robots: { index: false, follow: false },
};

// Landing page sections, so the links work whether or not the visitor is signed in.
const SHORTCUTS = [
    { href: '/#explore', label: 'Video lessons', short: 'Videos', Icon: MonitorPlay, tint: 'bg-[#FFF1C9] hover:bg-[#FFE7A3]' },
    { href: '/#quizzes', label: 'Quizzes', short: 'Quizzes', Icon: HelpCircle, tint: 'bg-[#DDF2F1] hover:bg-[#C6E9E7]' },
    { href: '/#exams', label: 'Exams', short: 'Exams', Icon: FileText, tint: 'bg-[#FCE4EE] hover:bg-[#F8D0E0]' },
    { href: '/#start', label: 'Subscription plans', short: 'Plans', Icon: CreditCard, tint: 'bg-[#E6ECFB] hover:bg-[#D3DDF8]' },
];

export default function NotFound() {
    return (
        <div className={`landing relative flex min-h-screen flex-col overflow-hidden bg-white font-dm text-ink antialiased ${landingFontVars}`}>
            {/* colour fields */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -right-[38vw] -top-[22vw] h-[80vw] w-[80vw] rounded-full bg-[#FEEFE4] lg:-right-[12vw] lg:-top-[28vw] lg:h-[58vw] lg:w-[58vw]" />
                <div className="absolute -bottom-[34vw] -left-[40vw] h-[70vw] w-[70vw] rounded-full bg-[#EEF1FC] lg:-bottom-[14vw] lg:-left-[16vw] lg:h-[34vw] lg:w-[34vw]" />
            </div>

            <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 pt-5 sm:px-10 sm:pt-8 lg:px-[clamp(40px,10vw,152px)] lg:pt-7">
                <Link href="/" aria-label="Lesson360 home" className="flex-none">
                    <Image src="/landing/logo.png" alt="Lesson360" width={2576} height={509} priority className="block h-[22px] w-auto sm:h-[28px]" />
                </Link>
                <Link
                    href="/"
                    aria-label="Back to home"
                    className="inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/70 text-[15px] font-bold text-ink backdrop-blur hover:border-ink/40 hover:bg-white sm:h-auto sm:w-auto sm:px-5 sm:py-3"
                >
                    <Home className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span className="hidden sm:inline">Back to home</span>
                </Link>
            </header>

            <main className="relative z-10 mx-auto grid w-full max-w-[1280px] flex-1 content-center items-center gap-6 px-5 pb-10 pt-4 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:px-[clamp(40px,10vw,152px)] lg:py-10">
                <div className="mx-auto w-full max-w-[340px] sm:max-w-[440px] lg:order-2 lg:max-w-[560px]">
                    <UnpluggedPhone className="block h-auto w-full" />
                </div>

                <div className="flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
                    <p className="m-0 font-jetbrains text-[11px] font-bold tracking-[.14em] text-flame sm:text-xs">
                        ERROR 404 · PAGE NOT FOUND
                    </p>
                    <h1 className="m-0 mt-3 font-grotesk text-[clamp(38px,10vw,56px)] font-extrabold leading-[.98] tracking-[-.045em] lg:mt-6 lg:text-[clamp(56px,5.4vw,84px)] lg:leading-[.92] lg:tracking-[-.055em]">
                        Oops…<br className="hidden lg:inline" /> <span className="whitespace-nowrap">this page</span><br />
                        <span className="whitespace-nowrap text-flame">skipped class.</span>
                    </h1>
                    <p className="m-0 mt-4 max-w-[480px] text-pretty text-[16px] leading-relaxed text-ink-soft sm:text-[17px] lg:mt-7 lg:text-[18px]">
                        <span className="lg:hidden">We can’t find that page. Let’s get you back to learning.</span>
                        <span className="hidden lg:inline">We can’t find the page you’re looking for. It may have moved, or the link might be broken. Let’s get you back to learning.</span>
                    </p>

                    <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:mt-9">
                        <Link
                            href="/"
                            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[16px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(23,21,58,.55)] hover:bg-flame focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame/30"
                        >
                            Take me home
                            <ArrowRight className="h-[18px] w-[18px] group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/#explore"
                            className="inline-flex items-center justify-center rounded-full border-[1.5px] border-ink bg-white/60 px-7 py-4 text-[16px] font-bold text-ink hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/20"
                        >
                            Explore lessons
                        </Link>
                    </div>

                    {/* Phones: a simple row of text links */}
                    <nav aria-label="Popular pages" className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:hidden">
                        {SHORTCUTS.map(s => (
                            <Link key={s.href} href={s.href} className="text-[15px] font-bold text-ink hover:text-flame hover:underline">
                                {s.short}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop: tinted chips */}
                    <div className="mt-10 hidden lg:block">
                        <p className="m-0 text-sm font-bold text-ink-muted">Or jump straight to</p>
                        <nav aria-label="Popular pages" className="mt-3.5 flex max-w-[420px] flex-wrap gap-2.5">
                            {SHORTCUTS.map(({ href, label, Icon, tint }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-[15px] font-bold text-ink ${tint}`}
                                >
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 mx-auto hidden w-[calc(100%-80px)] max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-ink/10 py-6 text-sm text-ink-muted sm:flex lg:px-[clamp(0px,calc(10vw-40px),72px)]">
                <span>Still stuck? We’re happy to help.</span>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-ink">
                    <a href={`mailto:${CONTACT.email}`} className="hover:text-flame hover:underline">{CONTACT.email}</a>
                    <a href={CONTACT.phoneHref} className="hover:text-flame hover:underline">{CONTACT.phone}</a>
                </div>
            </footer>
        </div>
    );
}
