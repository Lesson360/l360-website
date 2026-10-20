import Link from 'next/link';
import type { ReactNode } from 'react';
import { LaunchShell } from '@/components/launch/LaunchShell';

export interface LegalSection {
    id: string;
    title: string;
    body: ReactNode;
}

/** Frame for /privacy and /terms: headline, contents list and numbered sections. */
export function LegalPage({ eyebrow, title, intro, updated, sections, related }: {
    eyebrow: string;
    title: string;
    intro: ReactNode;
    /** Human-readable "last updated" date, e.g. "20 October 2026". */
    updated: string;
    sections: LegalSection[];
    related: { href: string; label: string };
}) {
    return (
        <LaunchShell action={{ href: '/', label: '← Home' }}>
            <article className="mx-auto w-full max-w-[1180px] px-[clamp(20px,5vw,72px)] pb-20 pt-[clamp(104px,13vw,140px)]">
                <header className="flex max-w-[760px] flex-col gap-5">
                    <div className="self-start rounded-full border border-ink/[.12] bg-cream px-3 py-[7px] font-jetbrains text-[11px] font-bold tracking-[.08em] sm:text-xs">
                        {eyebrow}
                    </div>
                    <h1 className="m-0 text-balance font-grotesk text-[clamp(40px,5.5vw,72px)] font-extrabold leading-[.95] tracking-[-.04em]">
                        {title}
                    </h1>
                    <div className="m-0 text-pretty text-[clamp(16px,1.3vw,18px)] leading-relaxed text-ink-soft">{intro}</div>
                    <p className="m-0 font-jetbrains text-xs font-bold tracking-[.06em] text-ink-soft">LAST UPDATED · {updated.toUpperCase()}</p>
                </header>

                <div className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
                    <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
                        <p className="m-0 mb-3 font-jetbrains text-[11px] font-bold tracking-[.08em] text-ink-soft">CONTENTS</p>
                        <ol className="m-0 flex list-none flex-col gap-2 p-0 text-[15px]">
                            {sections.map((s, i) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`} className="text-[#2D2A52] hover:text-flame hover:underline">
                                        {i + 1}. {s.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="flex max-w-[760px] flex-col">
                        {sections.map((s, i) => (
                            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-ink/15 py-8 first:border-t-0 first:pt-0">
                                <h2 className="m-0 mb-4 font-grotesk text-[clamp(22px,2vw,28px)] font-extrabold tracking-[-.02em]">
                                    <span className="text-flame">{i + 1}.</span> {s.title}
                                </h2>
                                <div className="flex flex-col gap-4 text-[16px] leading-relaxed text-[#2D2A52] [&_a]:font-semibold [&_a]:text-flame [&_a:hover]:underline [&_li]:pl-1 [&_strong]:text-ink [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_p]:m-0">
                                    {s.body}
                                </div>
                            </section>
                        ))}

                        <p className="m-0 mt-4 rounded-2xl bg-cream px-5 py-4 text-[15px] text-[#2D2A52]">
                            Also read our <Link href={related.href} className="font-semibold text-flame hover:underline">{related.label}</Link>.
                        </p>
                    </div>
                </div>
            </article>
        </LaunchShell>
    );
}
