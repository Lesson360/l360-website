import { LandingStage } from '@/components/landing/stage/LandingStage';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import {
    AppSection, PreschoolSection, ReviewsSection, AffiliateSection, VideosSection, LibrarySection, QuizzesSection, ExamsSection, LevelsSection,
} from '@/components/landing/FeatureSections';
import { FamiliesSection, CommunitySection } from '@/components/landing/PhotoSections';
import { SubscriptionSection } from '@/components/landing/SubscriptionSection';

export default function Home() {
    return (
        <LandingStage>
            <LandingNav />
            {/* Content ignores the pointer so hovering the 3D phones works; interactive blocks opt back in. */}
            <main id="top" className="pointer-events-none relative z-[2]">
                <Hero />
                <AppSection />
                <PreschoolSection />
                <FamiliesSection />
                <ReviewsSection />
                <AffiliateSection />
                <VideosSection />
                <LibrarySection />
                <QuizzesSection />
                <ExamsSection />
                <LevelsSection />
                <CommunitySection />
                <SubscriptionSection />
            </main>
        </LandingStage>
    );
}
