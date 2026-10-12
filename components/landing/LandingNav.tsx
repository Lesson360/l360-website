import Image from 'next/image';
import Link from 'next/link';
import { AFFILIATE_URL } from './links';

export function LandingNav() {
    return (
        <nav
            aria-label="Main"
            className="fixed left-1/2 top-3 z-[5] flex w-[min(1180px,calc(100%-24px))] -translate-x-1/2 items-center justify-between gap-3 rounded-full border border-ink/[.08] bg-[rgba(255,248,236,.74)] py-2 pl-4 pr-2 backdrop-blur-[14px] sm:top-4 sm:gap-4 sm:py-2.5 sm:pl-5 sm:pr-2.5"
        >
            <a href="#top" className="flex flex-none items-center" aria-label="Lesson360 home">
                <Image src="/landing/logo.png" alt="Lesson360" width={2576} height={509} priority className="block h-[22px] w-auto sm:h-[26px]" />
            </a>
            <div className="flex items-center gap-[clamp(10px,2.4vw,32px)] text-[15px] font-medium">
                <a href={AFFILIATE_URL} className="hidden whitespace-nowrap text-ink hover:text-flame min-[480px]:inline">
                    Become a Partner
                </a>
                <Link href="/login" className="whitespace-nowrap text-ink hover:text-flame">
                    Login
                </Link>
                <Link
                    href="/signup"
                    className="whitespace-nowrap rounded-full bg-ink px-4 py-2.5 font-bold text-cream transition-colors hover:bg-flame hover:text-cream sm:px-5 sm:py-[11px]"
                >
                    Sign Up
                </Link>
            </div>
        </nav>
    );
}
