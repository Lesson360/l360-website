import Image from 'next/image';
import { CONTACT } from './links';
import { PlanCards } from './PlanCards';
import { StoreBadges } from './StoreBadges';

export function SubscriptionSection() {
    return (
        <section
            id="start"
            data-section=""
            data-bg="#FF5A14"
            className="relative flex min-h-screen flex-col items-center gap-7 px-[clamp(20px,5vw,72px)] pb-10 pt-[clamp(88px,10vw,110px)] text-center"
        >
            <div className="pointer-events-auto flex max-w-[860px] flex-col items-center gap-5">
                <div data-reveal="" className="font-jetbrains text-xs font-bold tracking-[.12em] text-ink">SUBSCRIPTION</div>
                <h2 data-reveal="" data-delay="60" className="m-0 text-balance font-grotesk text-[clamp(44px,7vw,104px)] font-extrabold leading-[.92] tracking-[-.045em]">
                    Our subscription options.
                </h2>
                <p data-reveal="" data-delay="120" className="m-0 max-w-[520px] text-pretty text-[clamp(17px,1.4vw,19px)] leading-normal text-[#2D2A52]">
                    Flexible learning packages designed for every learner’s academic journey.
                </p>
            </div>

            {/* App screenshots flank the slot where the phone ring returns. */}
            <div className="flex w-full max-w-[1360px] items-center justify-center">
                <Image
                    data-speed="0.14"
                    src="/landing/app-dashboard.png"
                    alt="Lesson360 app dashboard"
                    width={351}
                    height={891}
                    sizes="(max-width: 760px) 22vw, 230px"
                    className="hidden h-auto w-[clamp(84px,15vw,230px)] sm:block drop-shadow-[0_30px_40px_rgba(23,21,58,.35)]"
                />
                <div data-slot="cta" className="min-h-[min(52vh,480px)] max-w-[720px] flex-1" />
                <Image
                    data-speed="-0.14"
                    src="/landing/app-welcome.png"
                    alt="Lesson360 app welcome screen"
                    width={616}
                    height={891}
                    sizes="(max-width: 760px) 26vw, 260px"
                    className="hidden h-auto w-[clamp(96px,17vw,260px)] sm:block drop-shadow-[0_30px_40px_rgba(23,21,58,.35)]"
                />
            </div>

            <PlanCards />

            <StoreBadges align="center" delay={120} />

            <footer className="pointer-events-auto mt-auto grid w-full max-w-[1360px] gap-6 border-t border-ink/15 pt-12 text-left text-sm leading-normal text-[#2D2A52] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
                <div className="flex flex-col gap-3">
                    <Image src="/landing/logo.png" alt="Lesson360" width={2576} height={509} className="block h-[22px] w-auto self-start [filter:brightness(0)_saturate(100%)_invert(8%)_sepia(30%)_hue-rotate(210deg)]" />
                    <span>© {new Date().getFullYear()} Lesson360</span>
                </div>
                <div className="flex flex-col gap-1.5">
                    <b className="text-ink">Contact</b>
                    <a href={`mailto:${CONTACT.email}`} className="text-[#2D2A52] hover:text-ink hover:underline">{CONTACT.email}</a>
                    <a href={CONTACT.phoneHref} className="text-[#2D2A52] hover:text-ink hover:underline">{CONTACT.phone}</a>
                </div>
                <div className="flex flex-col gap-1.5">
                    <b className="text-ink">Address</b>
                    <span>{CONTACT.address}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                    <b className="text-ink">Socials</b>
                    <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="text-[#2D2A52] hover:text-ink hover:underline">Instagram</a>
                </div>
            </footer>
        </section>
    );
}
