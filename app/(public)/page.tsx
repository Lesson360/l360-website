'use client';

import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Testimonials } from '@/components/landing/Testimonials';
import { ExploreOur } from '@/components/landing/ExploreOur';
import { VideoLibrary } from '@/components/landing/VideoLibrary';
import { ClassLevels } from '@/components/landing/ClassLevels';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/shared/Header';

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <Features />
            <Testimonials />
            <ExploreOur />
            <VideoLibrary />
            <ClassLevels />
            <Footer />
        </>
    );
}
