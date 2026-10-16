'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { waitlistApi, WaitlistLevel, WaitlistRole } from '@/lib/api/waitlist';

const ROLES: { value: WaitlistRole; label: string }[] = [
    { value: 'parent', label: 'Parent / guardian' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'school', label: 'School' },
    { value: 'student', label: 'Student' },
];

const LEVELS: { value: WaitlistLevel; label: string }[] = [
    { value: 'early_years', label: 'Early Years' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
];

const schema = z.object({
    fullName: z.string().trim().min(2, 'Please enter your name.'),
    email: z.string().trim().min(1, 'Please enter your email address.').email('That email address doesn’t look right.'),
    phoneNumber: z
        .string()
        .trim()
        .refine(v => v === '' || /^\+?[\d\s()-]{7,20}$/.test(v), 'Please enter a valid phone number.'),
    role: z.enum(['parent', 'teacher', 'school', 'student']),
    levels: z.array(z.enum(['early_years', 'nursery', 'primary', 'secondary'])),
});

type FormValues = z.infer<typeof schema>;

const field = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/70 shadow-sm outline-none transition-colors focus:border-flame focus:ring-2 focus:ring-flame/20 aria-[invalid=true]:border-red-400';
const chip = 'cursor-pointer select-none rounded-full border px-4 py-2 text-sm font-bold transition-colors';

export function WaitlistForm() {
    const [done, setDone] = useState<string | null>(null);
    const [serverError, setServerError] = useState('');

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { fullName: '', email: '', phoneNumber: '', role: 'parent', levels: [] },
    });

    const onSubmit = async (values: FormValues) => {
        setServerError('');
        try {
            await waitlistApi.join({ ...values, phoneNumber: values.phoneNumber || undefined });
            setDone(values.fullName.split(' ')[0]);
        } catch (err: any) {
            setServerError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    if (done) {
        return (
            <div role="status" className="flex flex-col items-start gap-4 rounded-[28px] bg-cream p-7 shadow-[0_24px_50px_-30px_rgba(23,21,58,.55)] sm:p-9">
                <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3FB57A] text-2xl font-extrabold text-cream">✓</span>
                <h2 className="m-0 font-grotesk text-[clamp(30px,3.4vw,40px)] font-extrabold leading-[1] tracking-[-.03em]">
                    You’re on the list, {done}!
                </h2>
                <p className="m-0 text-[15px] leading-relaxed text-ink-soft">
                    We’ll email you as soon as Lesson360 opens. Keep an eye on your inbox — and tell a friend who’d love it too.
                </p>
                <Link href="/coming-soon" className="mt-1 rounded-full border-[1.5px] border-ink px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-[#FFE1D2]">
                    ← Back to Lesson360
                </Link>
            </div>
        );
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 rounded-[28px] bg-cream p-6 shadow-[0_24px_50px_-30px_rgba(23,21,58,.55)] sm:p-8"
        >
            <div className="flex flex-col gap-1.5">
                <label htmlFor="wl-name" className="text-sm font-bold">Full name</label>
                <input id="wl-name" autoComplete="name" placeholder="e.g. Ada Okafor" className={field}
                    aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? 'wl-name-err' : undefined} {...register('fullName')} />
                {errors.fullName && <p id="wl-name-err" className="m-0 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="wl-email" className="text-sm font-bold">Email address</label>
                <input id="wl-email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" className={field}
                    aria-invalid={!!errors.email} aria-describedby={errors.email ? 'wl-email-err' : undefined} {...register('email')} />
                {errors.email && <p id="wl-email-err" className="m-0 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="wl-phone" className="text-sm font-bold">
                    Phone number <span className="font-medium text-ink-muted">(optional)</span>
                </label>
                <input id="wl-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+234 801 234 5678" className={field}
                    aria-invalid={!!errors.phoneNumber} aria-describedby={errors.phoneNumber ? 'wl-phone-err' : undefined} {...register('phoneNumber')} />
                {errors.phoneNumber && <p id="wl-phone-err" className="m-0 text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="mb-2 p-0 text-sm font-bold">I am a…</legend>
                <Controller
                    control={control}
                    name="role"
                    render={({ field: f }) => (
                        <div role="radiogroup" className="flex flex-wrap gap-2">
                            {ROLES.map(r => {
                                const on = f.value === r.value;
                                return (
                                    <label key={r.value} className={`${chip} ${on ? 'border-ink bg-ink text-cream' : 'border-ink/15 bg-white text-ink hover:border-ink/40'} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-flame`}>
                                        <input type="radio" name={f.name} value={r.value} checked={on} onChange={() => f.onChange(r.value)} className="sr-only" />
                                        {r.label}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                />
            </fieldset>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="mb-2 p-0 text-sm font-bold">
                    Learning levels you’re interested in <span className="font-medium text-ink-muted">(optional)</span>
                </legend>
                <Controller
                    control={control}
                    name="levels"
                    render={({ field: f }) => (
                        <div className="flex flex-wrap gap-2">
                            {LEVELS.map(l => {
                                const on = f.value.includes(l.value);
                                return (
                                    <label key={l.value} className={`${chip} ${on ? 'border-flame bg-flame text-cream' : 'border-ink/15 bg-white text-ink hover:border-ink/40'} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-flame`}>
                                        <input
                                            type="checkbox"
                                            value={l.value}
                                            checked={on}
                                            onChange={() => f.onChange(on ? f.value.filter(v => v !== l.value) : [...f.value, l.value])}
                                            className="sr-only"
                                        />
                                        {on ? '✓ ' : ''}{l.label}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                />
            </fieldset>

            {serverError && <p role="alert" className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-bold text-cream shadow-[0_14px_30px_-12px_rgba(23,21,58,.6)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-flame disabled:translate-y-0 disabled:opacity-70"
            >
                {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Joining…</> : 'Join the waitlist →'}
            </button>

            <p className="m-0 text-center text-xs leading-relaxed text-ink-muted">
                We’ll only use your details to tell you about Lesson360’s launch. Unsubscribe anytime.
            </p>
        </form>
    );
}
