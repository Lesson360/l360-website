import { AFFILIATE_URL, APP_STORE_URL, PLAY_STORE_URL } from './links';
import { StoreBadges } from './StoreBadges';
import {
    Button, Chip, EASE, Eyebrow, FeatureSection, Heading, Lede, ListRow, StartButton,
} from './primitives';

const card = `flex flex-col rounded-3xl p-6 transition-transform duration-500 ${EASE}`;

export function AppSection() {
    const steps = [
        ['Take a quiz', 'Test what you have learned with 10 fun questions.'],
        ['Performance assessment', 'Monitor your progress.'],
        ['Enrichment courses', 'Master new subjects.'],
        ['Live videos', 'Real-time learning experiences.'],
    ];
    return (
        <FeatureSection id="app" index={0} bg="#FDE9E0" slot="right">
            <Eyebrow color="oklch(0.52 0.19 35)">THE APP</Eyebrow>
            <Heading>Everything they need to learn, in one app.</Heading>
            <div className="flex flex-col">
                {steps.map(([title, sub], i) => (
                    <ListRow key={title} lead={i + 1} leadColor="oklch(0.55 0.19 35)" title={title} sub={sub} delay={120 + i * 60} last={i === steps.length - 1} />
                ))}
            </div>
            <div data-reveal="" className="text-[15px] font-bold">
                {APP_STORE_URL && PLAY_STORE_URL ? 'Available on iOS and the Google Play Store' : 'Coming soon to iOS and the Google Play Store'}
            </div>
            <StoreBadges delay={80} />
        </FeatureSection>
    );
}

export function PreschoolSection() {
    return (
        <FeatureSection index={1} bg="#E6ECFB" slot="left">
            <Eyebrow color="oklch(0.48 0.17 265)">PRE-SCHOOL</Eyebrow>
            <Heading>Why children love us!</Heading>
            <Lede className="text-ink-soft">Every pre-school topic in one app, with fun worksheets and activities that adapt to each child’s progress.</Lede>
            <div data-reveal="" data-delay="200" className="flex flex-wrap gap-2">
                <Chip className="bg-[#5B7BEA] text-cream">All pre-school topics in 1 app</Chip>
                <Chip className="bg-cream">Fun &amp; educational worksheets</Chip>
                <Chip className="bg-cream">Activities based on progress</Chip>
            </div>
        </FeatureSection>
    );
}

const REVIEWS = [
    { quote: 'My daughter asks to do her quizzes now. Screen time finally feels like learning time.', name: 'Micheal Adewale', initials: 'MA', bg: 'bg-cream', avatar: 'bg-[#F5B935]', tilt: 'hover:-rotate-1' },
    { quote: 'The progress reports show me exactly where my son needs help before his exams.', name: 'Anabelle Joseph', initials: 'AJ', bg: 'bg-[#3FB57A]', avatar: 'bg-cream', tilt: 'hover:rotate-1' },
];

export function ReviewsSection() {
    return (
        <FeatureSection id="reviews" index={2} bg="#E2F3E8" slot="right">
            <Eyebrow color="oklch(0.45 0.13 155)">TESTIMONIALS</Eyebrow>
            <Heading>Check out what guardians are saying.</Heading>
            <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
                {REVIEWS.map((r, i) => (
                    <figure key={r.name} data-reveal="" data-delay={i * 90} className={`${card} m-0 gap-[18px] hover:-translate-y-1.5 ${r.tilt} ${r.bg}`}>
                        <blockquote className="m-0 font-grotesk text-[19px] font-semibold leading-[1.3]">“{r.quote}”</blockquote>
                        <figcaption className="mt-auto flex items-center gap-2.5 text-sm">
                            <span aria-hidden="true" className={`flex h-11 w-11 flex-none items-center justify-center rounded-full font-jetbrains text-xs font-bold text-ink ${r.avatar}`}>
                                {r.initials}
                            </span>
                            <span><b>{r.name}</b> · Guardian</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </FeatureSection>
    );
}

export function AffiliateSection() {
    return (
        <FeatureSection id="partner" index={3} bg="#1C1A45" slot="left" className="text-[#F7F2EA]">
            <Eyebrow color="oklch(0.8 0.12 295)">AFFILIATE PROGRAM</Eyebrow>
            <Heading>Start earning instantly.</Heading>
            <Lede className="text-[#CFCBE8]">Join our affiliate program and earn while you inspire learning. Share education. Earn rewards.</Lede>
            <div data-reveal="" data-delay="200" className="flex flex-wrap gap-2">
                <Chip className="bg-[#8A63E0] text-cream">Share education</Chip>
                <Chip className="bg-[rgba(247,242,234,.12)]">Earn rewards</Chip>
                <Chip className="bg-[rgba(247,242,234,.12)]">Inspire learning</Chip>
            </div>
            <div data-reveal="" data-delay="260">
                <Button href={AFFILIATE_URL} tone="cream">Start earning →</Button>
            </div>
        </FeatureSection>
    );
}

export function VideosSection() {
    return (
        <FeatureSection id="explore" index={4} bg="#FFF1C9" slot="right">
            <Eyebrow color="oklch(0.5 0.12 70)">EXPLORE OUR VIDEOS</Eyebrow>
            <Heading>Your classroom, one tap away.</Heading>
            <Lede className="text-ink-soft">Interactive video lessons designed for success — plus a full video library to pause, replay and master every topic.</Lede>
            <div data-reveal="" data-delay="200" className="flex flex-wrap gap-2">
                <Chip href="#explore" className="bg-[#F5B935] text-ink">Videos</Chip>
                <Chip href="#quizzes" className="bg-cream text-ink hover:text-flame">Quizzes</Chip>
                <Chip href="#exams" className="bg-cream text-ink hover:text-flame">Exams</Chip>
            </div>
            <div data-reveal="" data-delay="260">
                <Button href="/dashboard/video-library">Open the video library →</Button>
            </div>
        </FeatureSection>
    );
}

export function QuizzesSection() {
    const quizzes = [
        ['🧮', 'Mathematics quiz', '10 questions'],
        ['📖', 'English quiz', '12 questions'],
        ['🏛️', 'Government quiz', 'Civic knowledge'],
    ];
    return (
        <FeatureSection id="quizzes" index={5} bg="#DDF2F1" slot="left">
            <Eyebrow color="oklch(0.45 0.09 195)">QUIZZES</Eyebrow>
            <Heading>Test your knowledge.</Heading>
            <Lede className="text-ink-soft">Monitor your progress and turn knowledge into rewards.</Lede>
            <div className="flex flex-col">
                {quizzes.map(([icon, title, sub], i) => (
                    <ListRow key={title} lead={<span aria-hidden="true">{icon}</span>} title={title} sub={sub} delay={180 + i * 60} last={i === quizzes.length - 1} action={<StartButton />} />
                ))}
            </div>
        </FeatureSection>
    );
}

export function ExamsSection() {
    const exams = [
        ['Σ', 'Mathematics', 'Algebra, geometry, arithmetic, statistics and more · 24 practice questions'],
        ['⚛', 'Physics', 'Motion, energy, waves, electricity and more · 24 practice questions'],
        ['⚗', 'Chemistry', 'Atoms, bonding, reactions, acids and more · 24 practice questions'],
    ];
    return (
        <FeatureSection id="exams" index={6} bg="#FCE4EE" slot="right">
            <Eyebrow color="oklch(0.5 0.17 355)">EXAMS</Eyebrow>
            <Heading>Explore a variety of subjects.</Heading>
            <Lede className="text-ink-soft">Exam practice that tests your knowledge, one subject at a time.</Lede>
            <div className="flex flex-col">
                {exams.map(([icon, title, sub], i) => (
                    <ListRow key={title} lead={<span aria-hidden="true">{icon}</span>} leadColor="oklch(0.5 0.17 355)" title={title} sub={sub} delay={180 + i * 60} last={i === exams.length - 1} action={<StartButton />} />
                ))}
            </div>
        </FeatureSection>
    );
}

export function LevelsSection() {
    const levels = [
        { n: '01', name: 'Early Years', sub: 'Play-based foundations', cls: 'bg-cream', tilt: 'hover:-rotate-1' },
        { n: '02', name: 'Nursery', sub: 'Pre-school topics & worksheets', cls: 'bg-[#FF8A3D]', tilt: 'hover:rotate-1' },
        { n: '03', name: 'Primary', sub: 'Core subjects, step by step', cls: 'bg-[#8A63E0] text-cream', tilt: 'hover:-rotate-1' },
        { n: '04', name: 'Secondary', sub: 'Exam practice & past questions', cls: 'bg-cream', tilt: 'hover:rotate-1' },
    ];
    return (
        <FeatureSection id="levels" index={7} bg="#FFE4D3" slot="left">
            <Eyebrow color="oklch(0.52 0.17 45)">LEARNING LEVELS</Eyebrow>
            <Heading>Support for every learning level.</Heading>
            <Lede className="text-ink-soft">Lesson360 is structured for early years, nursery, primary, and secondary learners.</Lede>
            <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
                {levels.map((l, i) => (
                    <div key={l.name} data-reveal="" data-delay={i * 90} className={`${card} gap-2.5 hover:-translate-y-1.5 ${l.tilt} ${l.cls}`}>
                        <div className="font-jetbrains text-[11px] font-bold tracking-[.12em] opacity-75">LEVEL {l.n}</div>
                        <div className="font-grotesk text-[28px] font-extrabold leading-none tracking-[-.02em]">{l.name}</div>
                        <div className="text-sm">{l.sub}</div>
                    </div>
                ))}
            </div>
        </FeatureSection>
    );
}
