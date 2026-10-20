import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { CONTACT } from '@/components/landing/links';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How Lesson360 collects, uses and protects information about parents, guardians and learners.',
};

const UPDATED = '20 October 2026';

const email = <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

const SECTIONS: LegalSection[] = [
    {
        id: 'who-we-are',
        title: 'Who we are',
        body: (
            <>
                <p>
                    Lesson360 Online School (“Lesson360”, “we”, “us”) runs the Lesson360 website, web app and mobile apps
                    (together, the “Service”). We are responsible for the personal information described in this policy.
                </p>
                <p>
                    Address: {CONTACT.address}. Email: {email}. Phone: <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>.
                </p>
                <p>
                    We handle personal information in line with the Nigeria Data Protection Act 2023 and, where they apply
                    to you, other data protection laws.
                </p>
            </>
        ),
    },
    {
        id: 'children',
        title: 'Children and parental control',
        body: (
            <>
                <p>
                    Lesson360 is built for learners from early years to secondary school, so most learners are children.
                    <strong> Accounts are created and managed by a parent or guardian</strong>, not by the child. The parent
                    or guardian sets up each child profile, chooses the class and level, and makes any payments.
                </p>
                <p>
                    We collect only what we need to teach the child and report progress to the parent. We do not sell
                    children’s information, we do not show children targeted advertising, and we do not ask children for
                    contact details.
                </p>
                <p>
                    A parent or guardian can see, correct or delete their child’s information at any time from the dashboard
                    or by emailing {email}.
                </p>
            </>
        ),
    },
    {
        id: 'what-we-collect',
        title: 'Information we collect',
        body: (
            <>
                <p><strong>Information you give us</strong></p>
                <ul>
                    <li>Parent or guardian account details: name, email address, phone number and password.</li>
                    <li>Child profile details: the child’s name, level and class.</li>
                    <li>A referral code, if you sign up through a referral or affiliate.</li>
                    <li>Waitlist details: name, email, phone, whether you are a parent, teacher, school or student, and the levels you’re interested in.</li>
                    <li>Messages you send us, and details you share when booking support services.</li>
                </ul>
                <p><strong>Information created as your child learns</strong></p>
                <ul>
                    <li>Lessons and videos watched, and how far through them.</li>
                    <li>Quiz, diagnostic, test and practice exam answers, scores and attempts.</li>
                    <li>Points, badges and progress summaries.</li>
                    <li>Books opened in the Digital Library, and live classes joined.</li>
                </ul>
                <p><strong>Payment information</strong></p>
                <p>
                    Payments are processed by Paystack. We receive a payment reference, the amount, the currency and whether
                    the payment succeeded. <strong>We never see or store your full card details.</strong>
                </p>
                <p><strong>Technical information</strong></p>
                <p>
                    Your device and browser type, IP address, approximate location (used to show prices in your local
                    currency), and logs needed to keep the Service secure and working.
                </p>
            </>
        ),
    },
    {
        id: 'how-we-use',
        title: 'How we use information',
        body: (
            <ul>
                <li>To create and run your account and your children’s profiles.</li>
                <li>To deliver lessons, quizzes, exams, the Digital Library, live classes and support services.</li>
                <li>To recommend content at the right level and show progress to parents.</li>
                <li>To take payments, manage subscriptions and confirm purchases.</li>
                <li>To send account, security and payment messages by email or SMS.</li>
                <li>To send launch news and product updates when you’ve asked for them. You can unsubscribe at any time.</li>
                <li>To credit referrals and affiliates.</li>
                <li>To keep the Service safe, prevent fraud and fix problems.</li>
                <li>To meet our legal obligations.</li>
            </ul>
        ),
    },
    {
        id: 'legal-basis',
        title: 'Our legal basis',
        body: (
            <p>
                We use your information to perform our contract with you (providing the Service you signed up for), with your
                consent (for example, marketing emails and the waitlist), for our legitimate interests (keeping the Service
                secure and improving it) and to comply with the law. Where we rely on consent, you can withdraw it at any time.
            </p>
        ),
    },
    {
        id: 'sharing',
        title: 'Who we share it with',
        body: (
            <>
                <p>We do not sell personal information. We share it only with:</p>
                <ul>
                    <li><strong>Service providers</strong> who help us run Lesson360, under contracts that limit how they use it: Paystack (payments), Amazon Web Services (hosting, file storage and video delivery), Mux (video streaming), and our email and SMS providers.</li>
                    <li><strong>Live class platforms</strong> such as Google Meet or Zoom, when your child joins a live class held there. Their own privacy policies apply.</li>
                    <li><strong>Tutors and support staff</strong> who deliver a support service you’ve booked, limited to what they need.</li>
                    <li><strong>Referrers and affiliates</strong>, who may see that someone signed up with their code, but not your child’s information.</li>
                    <li><strong>Authorities</strong>, when the law requires it or to protect someone’s safety.</li>
                </ul>
                <p>
                    Some of these providers store data outside Nigeria. When that happens, we make sure the transfer is
                    allowed under the Nigeria Data Protection Act and that your information stays protected.
                </p>
            </>
        ),
    },
    {
        id: 'cookies',
        title: 'Cookies and local storage',
        body: (
            <>
                <p>We use a small number of cookies and browser storage items that the Service needs to work:</p>
                <ul>
                    <li>A sign-in cookie that keeps you logged in.</li>
                    <li>Short-lived cookies that let protected lesson videos play.</li>
                    <li>Browser storage that remembers your chosen child profile and currency, and where to return you after a payment.</li>
                </ul>
                <p>
                    We don’t use advertising cookies. If you block cookies, you won’t be able to sign in.
                </p>
            </>
        ),
    },
    {
        id: 'retention',
        title: 'How long we keep it',
        body: (
            <p>
                We keep account and learning information while your account is open. When you delete a child profile or close
                your account, we delete or anonymise that information, except records we must keep by law, such as payment
                and tax records. Waitlist details are kept until we launch or until you ask us to remove them.
            </p>
        ),
    },
    {
        id: 'security',
        title: 'How we protect it',
        body: (
            <p>
                Information is sent over encrypted connections. Learning files and videos are stored privately and are only
                reachable through short-lived signed links, and passwords are stored in hashed form. No system is perfectly
                secure, but if a breach affects your information, we will tell you and the regulator as the law requires.
            </p>
        ),
    },
    {
        id: 'your-rights',
        title: 'Your rights',
        body: (
            <>
                <p>You, and a parent or guardian on behalf of their child, can ask us to:</p>
                <ul>
                    <li>Give you a copy of the information we hold.</li>
                    <li>Correct information that is wrong or incomplete.</li>
                    <li>Delete information we no longer need.</li>
                    <li>Restrict or object to how we use it.</li>
                    <li>Send your information to you or another provider in a usable format.</li>
                    <li>Stop sending you marketing messages.</li>
                </ul>
                <p>
                    Email {email} and we will respond within 30 days. If you’re not satisfied with our response, you can
                    complain to the Nigeria Data Protection Commission.
                </p>
            </>
        ),
    },
    {
        id: 'changes',
        title: 'Changes to this policy',
        body: (
            <p>
                We may update this policy as Lesson360 grows. We will change the “last updated” date above and, for
                significant changes, tell you by email or in the app before they take effect.
            </p>
        ),
    },
    {
        id: 'contact',
        title: 'Contact us',
        body: (
            <p>
                Questions about privacy? Email {email}, call <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>, or write to us at {CONTACT.address}.
            </p>
        ),
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            eyebrow="PRIVACY POLICY"
            title="Your family’s privacy comes first."
            intro={<p className="m-0">This policy explains what information Lesson360 collects about parents, guardians and learners, why we collect it, and the choices you have.</p>}
            updated={UPDATED}
            sections={SECTIONS}
            related={{ href: '/terms', label: 'Terms and Conditions' }}
        />
    );
}
