'use client';

import {
    MailIcon,
    PhoneIcon,
    MapPinIcon,
    InstagramIcon,
    TwitterIcon,
    FacebookIcon,
    YoutubeIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SOCIALS = [
    {
        Icon: InstagramIcon,
        label: 'Instagram',
        href: '#',
    },
    {
        Icon: TwitterIcon,
        label: 'Twitter',
        href: '#',
    },
    {
        Icon: FacebookIcon,
        label: 'Facebook',
        href: '#',
    },
    {
        Icon: YoutubeIcon,
        label: 'YouTube',
        href: '#',
    },
];

export function Footer() {
    return (
        <footer className="relative w-full overflow-hidden bg-[#2d284b] text-white py-12 sm:py-16 px-6">
            <div className="max-w-6xl mx-auto relative z-10">
                <Image
                    src="https://cdn.magicpatterns.com/uploads/gCuHuVJSJspn2uVtMavkc6/l360-logo.png"
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
                            href="mailto:lesson360@gmail.com"
                            className="text-white/90 hover:text-white transition-colors break-all"
                        >
                            lesson360@gmail.com
                        </a>
                    </li>
                    <li className="flex items-center gap-3">
                        <PhoneIcon
                            className="w-5 h-5 text-green-400 shrink-0"
                            aria-hidden="true"
                        />
                        <a
                            href="tel:+2349139135953"
                            className="text-white/90 hover:text-white transition-colors"
                        >
                            +234 91 391 35 953
                        </a>
                    </li>
                    <li className="flex items-start gap-3">
                        <MapPinIcon
                            className="w-5 h-5 text-green-400 shrink-0 mt-0.5"
                            aria-hidden="true"
                        />
                        <span className="text-white/90">
                            Lorem Ipsum Dolor Sit Amet Consectetur. Lectus
                        </span>
                    </li>
                </ul>

                <h2 className="text-brand-orange font-bold text-xl mb-4">Socials</h2>
                <ul className="flex items-center gap-5">
                    {SOCIALS.map(({ Icon, label, href }) => (
                        <li key={label}>
                            <a
                                href={href}
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

