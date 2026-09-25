'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    HeartHandshake,
    Loader2,
    UserCheck
} from 'lucide-react';
import { useChildProfile } from '@/lib/context/ChildProfileContext';
import {
    supportServicesApi,
    SupportEnrollment,
    SupportServiceOffering
} from '@/lib/api/support-services';
import { SlotPickerModal } from '@/components/support/SlotPickerModal';

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    pending_payment: { label: 'Payment pending', className: 'bg-amber-100 text-amber-700' },
    paid: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
    payment_failed: { label: 'Payment failed', className: 'bg-red-100 text-red-600' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
    completed: { label: 'Completed', className: 'bg-gray-100 text-gray-600' }
};

function formatPrice(amount: number, currency: string) {
    const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '₦';
    return `${symbol}${(amount || 0).toLocaleString()}`;
}

function typeLabel(type?: string) {
    return type === 'one_on_one' ? 'One-to-one' : type === 'group_live' ? 'Group live' : 'Support';
}

// An enrollment still counts as "owned" while it is paid, active and has credits left.
function isEnrollmentActive(e: SupportEnrollment) {
    return e.status === 'paid' && e.accessStatus === 'active' && e.sessionsRemaining > 0;
}

export default function SupportServicesPage() {
    const { activeChild } = useChildProfile();
    const childId = activeChild?.id || activeChild?._id || '';

    const [enrollments, setEnrollments] = useState<SupportEnrollment[]>([]);
    const [offerings, setOfferings] = useState<SupportServiceOffering[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [enrollmentsError, setEnrollmentsError] = useState('');
    const [offeringsError, setOfferingsError] = useState('');
    const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
    const [checkoutError, setCheckoutError] = useState('');
    const [slotPickerFor, setSlotPickerFor] = useState<SupportEnrollment | null>(null);
    // Set when the parent lands here right after a verified dashboard purchase.
    const [paidEnrollmentId, setPaidEnrollmentId] = useState<string | null>(null);
    const [showPaidBanner, setShowPaidBanner] = useState(false);

    const loadAll = useCallback(async () => {
        if (!childId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setEnrollmentsError('');
        setOfferingsError('');

        const [enrRes, offRes] = await Promise.allSettled([
            supportServicesApi.getEnrollments(childId),
            supportServicesApi.getOfferings({
                levelId: activeChild?.currentLevelId,
                classId: activeChild?.currentClassId
            })
        ]);

        if (enrRes.status === 'fulfilled') {
            const body: any = (enrRes.value as any)?.data ?? enrRes.value;
            setEnrollments(Array.isArray(body) ? body : body?.items || []);
        } else {
            setEnrollments([]);
            setEnrollmentsError((enrRes.reason as any)?.response?.data?.message || 'Could not load your support services.');
        }

        if (offRes.status === 'fulfilled') {
            const body: any = (offRes.value as any)?.data ?? offRes.value;
            const raw: any[] = Array.isArray(body) ? body : body?.items || body?.offerings || [];
            setOfferings(raw.map((o) => ({ ...o, id: String(o.id || o._id || '') })).filter((o) => o.id));
        } else {
            setOfferings([]);
            const status = (offRes.reason as any)?.response?.status;
            setOfferingsError(
                status === 403
                    ? 'Browsing all support offerings is not available for this account yet.'
                    : (offRes.reason as any)?.response?.data?.message || 'Could not load available support offerings.'
            );
        }

        setIsLoading(false);
    }, [childId, activeChild?.currentLevelId, activeChild?.currentClassId]);

    // Reload (dropping the previous child's data) whenever the selected child changes.
    useEffect(() => {
        setEnrollments([]);
        setOfferings([]);
        loadAll();
    }, [loadAll]);

    const handleBuy = async (offeringId: string) => {
        if (!childId) return;
        setCheckingOutId(offeringId);
        setCheckoutError('');
        try {
            const res: any = await supportServicesApi.checkout({
                childProfileId: childId,
                offeringId,
                provider: 'paystack',
                callbackUrl: `${window.location.origin}/dashboard/support-services/callback`
            });
            const body = res?.data ?? res;
            const url = body?.checkout?.authorizationUrl || body?.payment?.checkout?.authorizationUrl;
            if (typeof url === 'string' && url) {
                window.location.href = url;
            } else {
                setCheckoutError('Could not start checkout: no payment link was returned.');
            }
        } catch (err: any) {
            setCheckoutError(err?.response?.data?.message || 'Could not start checkout. Please try again.');
        } finally {
            setCheckingOutId(null);
        }
    };

    // Pick up the post-payment redirect (?payment=success&enrollment=...) once, then clean the URL.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success') {
            setShowPaidBanner(true);
            setPaidEnrollmentId(params.get('enrollment'));
            window.history.replaceState(null, '', window.location.pathname);
        }
    }, []);

    // If the freshly-paid service needs a weekly slot, open the picker straight away.
    useEffect(() => {
        if (!paidEnrollmentId || slotPickerFor) return;
        const paid = enrollments.find((e) => e.id === paidEnrollmentId);
        if (!paid) return;
        setPaidEnrollmentId(null);
        if (paid.status === 'paid' && paid.scheduleStatus === 'unbooked' && paid.offering?.requiresSlotSelection) {
            setSlotPickerFor(paid);
        }
    }, [enrollments, paidEnrollmentId, slotPickerFor]);

    const activeOfferingIds = new Set(enrollments.filter(isEnrollmentActive).map((e) => e.offeringId));

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FF4801] tracking-tight">Support Services</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Live one-to-one and group classes{activeChild?.name ? ` for ${activeChild.name}` : ''}.
                </p>
            </div>

            {!childId && !isLoading && (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center text-sm font-bold text-gray-600">
                    Add or select a child to see their support services.
                </div>
            )}

            {showPaidBanner && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    <span>Payment confirmed! Your support service is now active.</span>
                    <button type="button" onClick={() => setShowPaidBanner(false)} className="ml-auto text-xs font-black underline cursor-pointer">Dismiss</button>
                </div>
            )}

            {checkoutError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" /> <span>{checkoutError}</span>
                </div>
            )}

            {/* MY SUPPORT SERVICES */}
            {childId && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-extrabold text-gray-900">My Support Services</h2>
                        <Link href="/dashboard/live-classes" className="text-xs font-black text-[#FF4801] hover:underline flex items-center gap-1.5">
                            <CalendarClock className="w-4 h-4" /> View Live Classes
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[0, 1].map((i) => (
                                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 animate-pulse">
                                    <div className="h-4 w-1/3 rounded-full bg-gray-200" />
                                    <div className="h-5 w-2/3 rounded-full bg-gray-200" />
                                    <div className="h-3 w-1/2 rounded-full bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    ) : enrollmentsError ? (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" /> <span>{enrollmentsError}</span>
                            <button type="button" onClick={loadAll} className="ml-auto text-xs font-black underline cursor-pointer">Retry</button>
                        </div>
                    ) : enrollments.length === 0 ? (
                        <div className="py-10 bg-white rounded-2xl border border-gray-200 text-center space-y-2">
                            <HeartHandshake className="w-8 h-8 text-gray-400 mx-auto" />
                            <p className="text-sm font-bold text-gray-700">No support services yet.</p>
                            <p className="text-xs text-gray-500">Pick one from the available offerings below.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {enrollments.map((e) => {
                                const badge = STATUS_BADGE[e.status] || { label: e.status, className: 'bg-gray-100 text-gray-600' };
                                const active = isEnrollmentActive(e);
                                const needsSlot = e.status === 'paid' && e.scheduleStatus === 'unbooked' && e.offering?.requiresSlotSelection;
                                const canRebuy = !active && e.status !== 'pending_payment' && !activeOfferingIds.has(e.offeringId);
                                const usedPct = e.sessionsIncluded > 0 ? Math.min(100, Math.round((e.sessionsUsed / e.sessionsIncluded) * 100)) : 0;

                                return (
                                    <div key={e.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${badge.className}`}>{badge.label}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{typeLabel(e.serviceType)}</span>
                                            </div>
                                            <h3 className="text-base font-extrabold text-gray-900 leading-snug">{e.offeringTitle}</h3>

                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                                                    <span>Classes</span>
                                                    <span>{e.sessionsRemaining} of {e.sessionsIncluded} remaining</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#FF4801] rounded-full" style={{ width: `${usedPct}%` }} />
                                                </div>
                                            </div>

                                            {e.slot && (
                                                <p className="text-xs font-semibold text-gray-600 capitalize">
                                                    Schedule: {e.slot.dayOfWeek}s · {e.slot.startTime} - {e.slot.endTime}
                                                </p>
                                            )}
                                            {e.teacher?.fullName && (
                                                <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                                    <UserCheck className="w-3.5 h-3.5 text-[#FF4801]" /> {e.teacher.fullName}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {needsSlot && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSlotPickerFor(e)}
                                                    className="px-4 py-2.5 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-xs shadow-md cursor-pointer"
                                                >
                                                    Choose schedule
                                                </button>
                                            )}
                                            {active && (
                                                <Link
                                                    href="/dashboard/live-classes"
                                                    className="px-4 py-2.5 rounded-xl bg-[#00C838] hover:bg-emerald-600 text-white font-black text-xs shadow-md"
                                                >
                                                    Live classes
                                                </Link>
                                            )}
                                            {canRebuy && (
                                                <button
                                                    type="button"
                                                    disabled={checkingOutId === e.offeringId}
                                                    onClick={() => handleBuy(e.offeringId)}
                                                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-black text-xs cursor-pointer hover:bg-gray-50 disabled:opacity-60 flex items-center gap-2"
                                                >
                                                    {checkingOutId === e.offeringId && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                    Buy again
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* AVAILABLE OFFERINGS */}
            {childId && (
                <section className="space-y-4">
                    <h2 className="text-lg font-extrabold text-gray-900">Available Support Offerings</h2>

                    {isLoading ? null : offeringsError ? (
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium">{offeringsError}</div>
                    ) : offerings.length === 0 ? (
                        <div className="py-10 bg-white rounded-2xl border border-gray-200 text-center text-sm font-bold text-gray-600">
                            No support offerings are available for this class right now.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {offerings.map((o) => {
                                const owned = activeOfferingIds.has(o.id);
                                return (
                                    <div key={o.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{typeLabel(o.type)}</span>
                                            <h3 className="text-base font-extrabold text-gray-900 leading-snug">{o.title}</h3>
                                            {o.shortDescription && <p className="text-xs text-gray-500 leading-relaxed">{o.shortDescription}</p>}
                                            <p className="text-xs font-bold text-gray-600">{o.sessionsIncluded} classes included</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xl font-black text-gray-900">{formatPrice(o.priceAmount, o.currency)}</p>
                                            {owned ? (
                                                <div className="py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black flex items-center justify-center gap-1.5">
                                                    <CheckCircle2 className="w-4 h-4" /> Already active
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={checkingOutId === o.id}
                                                    onClick={() => handleBuy(o.id)}
                                                    className="w-full py-2.5 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                                                >
                                                    {checkingOutId === o.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                                    <span>Subscribe</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {slotPickerFor && (
                <SlotPickerModal
                    enrollmentId={slotPickerFor.id}
                    offeringTitle={slotPickerFor.offeringTitle}
                    onClose={() => setSlotPickerFor(null)}
                    onBooked={() => {
                        setSlotPickerFor(null);
                        loadAll();
                    }}
                />
            )}
        </div>
    );
}
