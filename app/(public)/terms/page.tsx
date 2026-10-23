import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { CONTACT } from '@/components/landing/links';

export const metadata: Metadata = {
    title: 'Terms and Conditions',
    description: 'The terms that apply when you use Lesson360’s website, apps, lessons and paid services.',
};

const UPDATED = '20 October 2026';

const email = <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

const SECTIONS: LegalSection[] = [
    {
        id: 'agreement',
        title: 'About these terms',
        body: (
            <>
                <p>
                    These terms are an agreement between you and Lesson360 Online School (“Lesson360”, “we”, “us”), of {CONTACT.address}.
                    They apply when you use the Lesson360 website, web app or mobile apps (the “Service”).
                </p>
                <p>
                    By creating an account, joining the waitlist or making a purchase, you agree to these terms and to our{' '}
                    <Link href="/privacy">Privacy Policy</Link>. If you don’t agree, please don’t use the Service.
                </p>
            </>
        ),
    },
    {
        id: 'accounts',
        title: 'Accounts',
        body: (
            <ul>
                <li>You must be at least 18 years old, and a parent, guardian, teacher or school representative, to create an account.</li>
                <li>Children use Lesson360 through a child profile that a parent or guardian creates and supervises. You are responsible for how children use the Service under your account.</li>
                <li>Give accurate details and keep them up to date, including the child’s correct class and level.</li>
                <li>Keep your password private. You are responsible for activity on your account. Tell us at once at {email} if you think someone else has used it.</li>
            </ul>
        ),
    },
    {
        id: 'service',
        title: 'What Lesson360 provides',
        body: (
            <>
                <p>
                    Lesson360 offers video lessons, quizzes, diagnostic tests, the Test Driller and practice exams, a Digital
                    Library, the Executive Development Program, live classes and support services. What you can use depends on your plan and
                    purchases, and on your child’s class and level.
                </p>
                <p>
                    We work to keep content accurate and the Service available, but we don’t promise that it will always be
                    uninterrupted or error-free, or that it will produce particular exam results. We may add, change or remove
                    features and content over time.
                </p>
            </>
        ),
    },
    {
        id: 'payments',
        title: 'Subscriptions and payments',
        body: (
            <ul>
                <li>Prices are shown before you pay. Prices may be displayed in your local currency for convenience, but you are charged in the currency shown at checkout.</li>
                <li>Payments are processed securely by Paystack. Paystack’s own terms also apply to your payment.</li>
                <li>A subscription gives access to the content in your plan for the period shown at checkout. Some items, such as Test Driller packages, paid library books, Executive Development Program courses and support services, are sold separately.</li>
                <li>Access starts once your payment has been confirmed.</li>
                <li>We may change our prices. Changes won’t affect a period you have already paid for, and we’ll tell you before a new price applies to you.</li>
            </ul>
        ),
    },
    {
        id: 'refunds',
        title: 'Cancellations and refunds',
        body: (
            <>
                <p>
                    You can stop using a subscription at any time, and you keep access until the end of the period you’ve paid for.
                </p>
                <p>
                    Because digital content is available as soon as you pay, payments are generally not refundable once access
                    has been given. If you were charged in error, charged twice, or could not access something you paid for,
                    email {email} within 14 days and we will put it right, including with a refund where appropriate. This does
                    not affect any rights you have under consumer protection law.
                </p>
            </>
        ),
    },
    {
        id: 'acceptable-use',
        title: 'Using Lesson360 responsibly',
        body: (
            <>
                <p>You agree not to:</p>
                <ul>
                    <li>Share your login, or let people outside your household use your account.</li>
                    <li>Copy, download, record, resell or redistribute lessons, videos, books, quizzes or exam questions, except where a download option is provided for your own personal use.</li>
                    <li>Try to get around access controls, payment checks or content protection.</li>
                    <li>Interfere with the Service, or use bots or scrapers on it.</li>
                    <li>Behave abusively towards tutors, teachers, other learners or our staff, including in live classes.</li>
                    <li>Use the Service for anything unlawful.</li>
                </ul>
                <p>
                    We may suspend or close accounts that break these rules. Where we can, we will tell you why first and give you a chance to respond.
                </p>
            </>
        ),
    },
    {
        id: 'content',
        title: 'Our content',
        body: (
            <p>
                Lessons, videos, books, questions, designs and the Lesson360 name and logo belong to Lesson360 or to the people
                who license them to us. While your account is active, we give you a personal, non-transferable licence to use
                them for your family’s or your class’s learning. Nothing in these terms transfers ownership to you.
            </p>
        ),
    },
    {
        id: 'live-classes',
        title: 'Live classes and support services',
        body: (
            <p>
                Live classes may be hosted on third-party platforms such as Google Meet or Zoom, and their terms also apply.
                Times are shown in the dashboard. If we have to cancel a session, we will reschedule it or offer another
                remedy. A parent or guardian should supervise younger children during live sessions.
            </p>
        ),
    },
    {
        id: 'referrals',
        title: 'Referrals and affiliates',
        body: (
            <p>
                If you sign up with a referral code, the referrer may be credited for your sign-up. Affiliates take part under
                separate affiliate terms. We may withdraw rewards that were earned through fraud or misuse.
            </p>
        ),
    },
    {
        id: 'liability',
        title: 'Our responsibility to you',
        body: (
            <>
                <p>
                    We provide the Service with reasonable care and skill. As far as the law allows, we are not responsible for
                    losses we could not reasonably foresee, or for losses caused by things outside our control, such as internet
                    outages or third-party platforms.
                </p>
                <p>
                    As far as the law allows, our total responsibility to you for any claim is limited to the amount you paid us
                    in the 12 months before the claim. Nothing in these terms limits liability that cannot be limited by law.
                </p>
            </>
        ),
    },
    {
        id: 'ending',
        title: 'Closing your account',
        body: (
            <p>
                You can close your account at any time by emailing {email}. We may close or suspend an account that seriously
                or repeatedly breaks these terms. When an account is closed, access to paid content ends and we handle your
                information as described in our <Link href="/privacy">Privacy Policy</Link>.
            </p>
        ),
    },
    {
        id: 'changes',
        title: 'Changes to these terms',
        body: (
            <p>
                We may update these terms from time to time. We will change the “last updated” date above and, for significant
                changes, tell you by email or in the app before they take effect. If you keep using the Service after that,
                the new terms apply.
            </p>
        ),
    },
    {
        id: 'law',
        title: 'Governing law and disputes',
        body: (
            <p>
                These terms are governed by the laws of the Federal Republic of Nigeria. If something goes wrong, please contact
                us first so we can try to resolve it. If we can’t, disputes will be handled by the courts of Nigeria.
            </p>
        ),
    },
    {
        id: 'contact',
        title: 'Contact us',
        body: (
            <p>
                Questions about these terms? Email {email}, call <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>, or write to us at {CONTACT.address}.
            </p>
        ),
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            eyebrow="TERMS AND CONDITIONS"
            title="The rules of the classroom."
            intro={<p className="m-0">These terms explain what you can expect from Lesson360, and what we ask of you, when you use our lessons, apps and paid services.</p>}
            updated={UPDATED}
            sections={SECTIONS}
            related={{ href: '/privacy', label: 'Privacy Policy' }}
        />
    );
}
