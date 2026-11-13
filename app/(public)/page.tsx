import { LandingStage } from '@/components/landing/stage/LandingStage';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { HighlightsSection } from '@/components/landing/HighlightsSection';
import {
    AppSection, PreschoolSection, ReviewsSection, AffiliateSection, VideosSection, LibrarySection, QuizzesSection, ExamsSection, ExecutiveProgramSection, LevelsSection,
} from '@/components/landing/FeatureSections';
import { FamiliesSection, CommunitySection, AiAcademySection } from '@/components/landing/PhotoSections';
import { SubscriptionSection } from '@/components/landing/SubscriptionSection';

export default function Home() {
    return (
        <LandingStage>
            <LandingNav />
            {/* Content ignores the pointer so hovering the 3D phones works; interactive blocks opt back in. */}
            <main id="top" className="pointer-events-none relative z-[2]">
                <Hero />
                <HighlightsSection />
                <AppSection />
                <PreschoolSection />
                <FamiliesSection />
                <ReviewsSection />
                <AffiliateSection />
                <VideosSection />
                <AiAcademySection />
                <LibrarySection />
                <QuizzesSection />
                <ExamsSection />
                <ExecutiveProgramSection />
                <LevelsSection />
                <CommunitySection />
                <SubscriptionSection />
            </main>
        </LandingStage>
    );
}
