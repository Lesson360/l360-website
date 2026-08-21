'use client';

import { Hero } from '@/components/landing/Hero';
import { ShowcaseSection } from '@/components/landing/ShowcaseSection';
import { Features } from '@/components/landing/Features';
import { Testimonials } from '@/components/landing/Testimonials';
import { ExploreOur } from '@/components/landing/ExploreOur';
import { VideoLibrary } from '@/components/landing/VideoLibrary';
import { ClassLevels } from '@/components/landing/ClassLevels';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/shared/Header';

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <ShowcaseSection />
            <Features />
            <Testimonials />
            <ExploreOur />
            <VideoLibrary />
            <ClassLevels />
            <Pricing />
            <Footer />
        </>
    );
}