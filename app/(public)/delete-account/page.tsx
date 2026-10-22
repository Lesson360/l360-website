import type { Metadata } from 'next';
import { LaunchShell } from '@/components/launch/LaunchShell';
import { DeleteAccountFlow } from '@/components/account/DeleteAccountFlow';

export const metadata: Metadata = {
    title: 'Delete your account',
    description: 'Permanently delete your Lesson360 account. We email you a code to confirm.',
};

// Public on purpose: App Store reviewers (and parents who can't sign in) must be
// able to reach this without logging in. Ownership is proven by the emailed code.
export default function DeleteAccountPage() {
    return (
        <LaunchShell action={{ href: '/', label: '← Home' }}>
            <section className="mx-auto w-full max-w-[720px] px-[clamp(20px,5vw,72px)] pb-20 pt-[clamp(104px,13vw,140px)]">
                <div className="self-start inline-block rounded-full border border-ink/[.12] bg-cream px-3 py-[7px] font-jetbrains text-[11px] font-bold tracking-[.08em] sm:text-xs">
                    ACCOUNT
                </div>
                <h1 className="m-0 mt-5 font-grotesk text-[clamp(36px,5vw,56px)] font-extrabold leading-[.98] tracking-[-.04em]">
                    Delete your <span className="text-flame">Lesson360</span> account
                </h1>
                <p className="m-0 mt-4 text-[17px] leading-relaxed text-ink-soft">
                    Enter the email address on your account. We’ll send a code to that email, and your account is deleted once you
                    enter it. You don’t need to sign in.
                </p>

                <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(23,21,58,.35)] sm:p-8">
                    <DeleteAccountFlow />
                </div>
            </section>
        </LaunchShell>
    );
}
