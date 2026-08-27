import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen lg:h-screen w-full bg-white flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans overflow-y-auto ">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">

                {/* Left Column: Visual Mock Card constrained to viewport height */}
                <div className="hidden lg:flex lg:col-span-6 justify-center items-center relative py-2">
                    <div className="relative w-full max-w-[400px] max-h-[calc(100vh-4rem)] flex items-center justify-center">

                        {/* Top-Right Orange Circle Decorative Dot */}
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-brand-orange rounded-full z-10 shadow-sm" />

                        {/* Bottom-Left Dark Navy Badge Circle */}
                        <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#26203B] rounded-full z-10 shadow-sm" />

                        {/* Main Framed Classroom Photo Box */}
                        <div className="relative rounded overflow-hidden border-2 p-1 bg-white shadow-xl w-full">

                            {/* Top-Left Orange Corner Bracket Accent */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-orange z-20 " />

                            {/* Bottom-Right Orange Corner Bracket Accent */}
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-orange z-20 " />

                            {/* Classroom Image */}
                            <div className="relative aspect-[3/4] w-full max-h-[calc(100vh-6rem)] overflow-hidden rounded-xl bg-amber-50">
                                <Image
                                    src="/class.jpg"
                                    alt="Lesson 360 Classroom"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>


                        </div>
                    </div>
                </div>

                {/* Right Column: Form Container */}
                <div className="col-span-1 lg:col-span-6 flex flex-col justify-center max-w-md mx-auto w-full px-2 sm:px-4">

                    {/* Logo Header */}
                    <div className="mb-6 text-left">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/lesson360-logo.png"
                                alt="Lesson 360 Logo"
                                width={160}
                                height={40}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Form Content */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}
