'use client';

import {
    MailIcon,
    PhoneIcon,
    MapPinIcon,
    InstagramIcon,
} from 'lucide-react';
import Image from 'next/image';

const SOCIALS = [
    {
        Icon: InstagramIcon,
        label: 'Instagram',
        href: 'https://www.instagram.com/lesson_360/',
    },
];

export function Footer() {
    return (
        <footer className="relative w-full overflow-hidden bg-[#2d284b] text-white py-12 sm:py-16 px-6">
            <div className="site-shell relative z-10">
                <Image
                    src="/lesson360-logo.png"
                    alt="Lesson 360"
                    width={160}
                    height={40}
                    className="h-9 sm:h-10 object-contain mb-8"
                    style={{ width: 'auto', height: 'auto' }}
                />

                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                        <MailIcon
                            className="w-5 h-5 text-green-400 shrink-0"
                            aria-hidden="true"
                        />
                        <a
                            href="mailto:info@lesson360.org"
                            className="text-white/90 hover:text-white transition-colors break-all"
                        >
                            info@lesson360.org
                        </a>
                    </li>
                    <li className="flex items-center gap-3">
                        <PhoneIcon
                            className="w-5 h-5 text-green-400 shrink-0"
                            aria-hidden="true"
                        />
                        <a
                            href="tel:+2348145448426"
                            className="text-white/90 hover:text-white transition-colors"
                        >
                            +234 814 544 8426
                        </a>
                    </li>
                    <li className="flex items-start gap-3">
                        <MapPinIcon
                            className="w-5 h-5 text-green-400 shrink-0 mt-0.5"
                            aria-hidden="true"
                        />
                        <span className="text-white/90">
                            LESSON360 ONLINE SCHOOL, OKOSISI AGUATA PHD STREET, OFF MOPOL BASE, AGU AWKA, AWKA SOUTH, ANAMBRA STATE, NIGERIA
                        </span>
                    </li>
                </ul>

                <h2 className="text-brand-orange font-bold text-xl mb-4">Socials</h2>
                <ul className="flex items-center gap-5">
                    {SOCIALS.map(({ Icon, label, href }) => (
                        <li key={label}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                                className="inline-flex w-9 h-9 items-center justify-center rounded-md hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                            >
                                <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Giraffe mascot */}
            <Image src='/giraff.png' alt='giraffe' className='w-64 h-64 object-contain absolute bottom-6 right-10' width={256} height={256} />
        </footer>
    );
}

