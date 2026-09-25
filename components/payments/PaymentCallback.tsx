'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Loader2,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Calendar,
    UserCheck,
    Check,
    ArrowRight,
} from 'lucide-react';
import {
    supportServicesApi,
    SupportServiceSlot,
    SupportEnrollment,
} from '@/lib/api/support-services';
import { subscriptionsApi } from '@/lib/api/subscriptions';
import { authApi } from '@/lib/api/auth';

export default function PaymentCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
    
    const [status, setStatus] = useState<'verifying' | 'slot_selection' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');
    const [paymentType, setPaymentType] = useState<'support' | 'subscription'>('subscription');

    // Support Enrollment State
    const [enrollment, setEnrollment] = useState<SupportEnrollment | null>(null);
    const [slots, setSlots] = useState<SupportServiceSlot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState<string>('');

    const [isFetchingSlots, setIsFetchingSlots] = useState(false);
    const [isBookingSlot, setIsBookingSlot] = useState(false);
    const [slotsError, setSlotsError] = useState('');
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        if (!reference) {
            // Redirect back if no reference is present
            router.push('/onboarding/diagnostic');
            return;
        }

        const isSupport = reference.includes('support') || reference.startsWith('paystack-support');

        if (isSupport) {
            setPaymentType('support');
            verifySupportPayment(reference);
        } else {
            setPaymentType('subscription');
            verifySubscriptionPayment(reference);
        }
    }, [reference, router]);

    // Verify Support Services Payment
    const verifySupportPayment = async (ref: string) => {
        setStatus('verifying');
        setMessage('Verifying your support service payment with Paystack...');

        try {
            const verifyRes = await supportServicesApi.verifyPayment(ref);
            const verifyObj: any = verifyRes;

            const paidEnrollmentId =
                verifyObj?.data?.item?.enrollmentId ||
                verifyObj?.item?.enrollmentId ||
                verifyObj?.data?.enrollment?.id ||
                verifyObj?.enrollment?.id ||
                '';

            const fetchedEnrollment =
                verifyObj?.data?.item ||
                verifyObj?.item ||
                verifyObj?.data?.enrollment ||
                verifyObj?.enrollment ||
                null;

            if (fetchedEnrollment) {
                setEnrollment(fetchedEnrollment);
            }

            if (!paidEnrollmentId) {
                setStatus('failed');
                setMessage(verifyObj?.message || 'We could not confirm this payment. Please contact support if you were charged.');
                return;
            }

            await loadSlotsForEnrollment(paidEnrollmentId);
        } catch (err: any) {
            console.warn('Support payment verification error:', err);
            setStatus('failed');
            setMessage(err?.response?.data?.message || 'We could not verify this payment. Please try again or contact support.');
        }
    };

    // Load available schedule slots. Response: { data: { offering: { title, requiresSlotSelection }, items: [], total } }
    const loadSlotsForEnrollment = async (enrollmentId: string) => {
        setIsFetchingSlots(true);
        setSlotsError('');
        setBookingError('');
        setStatus('slot_selection');
        setMessage("Payment confirmed! Select your child's weekly class schedule below.");

        try {
            const slotsRes = await supportServicesApi.getSlots(enrollmentId);
            const body: any = (slotsRes as any)?.data ?? slotsRes;
            const offering = body?.offering;

            if (offering?.title) {
                setEnrollment((prev) => (prev ? { ...prev, offeringTitle: prev.offeringTitle || offering.title } : prev));
            }

            if (offering?.requiresSlotSelection === false) {
                setStatus('success');
                setMessage('Payment confirmed! Your support service is active.');
                return;
            }

            setSlots(body?.items || []);
        } catch (err: any) {
            setSlotsError(err?.response?.data?.message || 'Could not load the available schedule slots. Please try again.');
        } finally {
            setIsFetchingSlots(false);
        }
    };

    // Confirm schedule slot selection
    const handleConfirmSlot = async () => {
        if (!selectedSlotId || !enrollment) return;
        setIsBookingSlot(true);
        setBookingError('');

        try {
            await supportServicesApi.selectSlot(enrollment.id, selectedSlotId);
            const bookedSlot = slots.find((sl) => sl.id === selectedSlotId);
            if (bookedSlot) {
                setEnrollment((prev) => prev ? {
                    ...prev,
                    selectedSlotId,
                    scheduleStatus: 'booked',
                    slot: bookedSlot,
                    teacher: bookedSlot.teacher,
                } : null);
            }
            setStatus('success');
            setMessage('Your support service enrollment and schedule are officially confirmed!');
        } catch (err: any) {
            setBookingError(err?.response?.data?.message || 'Could not book this slot. Please try again or choose another.');
        } finally {
            setIsBookingSlot(false);
        }
    };

    // Verify Standard Subscription Payment
    const verifySubscriptionPayment = async (ref: string) => {
        setStatus('verifying');
        setMessage('Verifying your plan subscription...');

        try {
            const res = await subscriptionsApi.verifyPaymentCallback(ref);
            const rawData: any = res.data || res;
            const itemStatus = (
                rawData?.item?.status ||
                rawData?.payment?.status ||
                rawData?.status ||
                rawData?.subscription?.status ||
                ''
            ).toLowerCase();

            const msg = (res.message || '').toLowerCase();
            const isSuccess =
                ['success', 'paid', 'active', 'completed', 'verified'].includes(itemStatus) ||
                msg.includes('completed') ||
                msg.includes('success') ||
                msg.includes('verified') ||
                msg.includes('paid');

            if (isSuccess) {
                setStatus('success');
                setMessage('Subscription confirmed! Finalizing your learner setup...');

                setTimeout(async () => {
                    const profileRes = await authApi.getProfile().catch(() => null);
                    const nextScreen = (profileRes as any)?.data?.progress?.screen || 'kindly_take_quiz';
                    const targetUrl = nextScreen === 'home' ? '/dashboard' : '/onboarding/diagnostic';

                    if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
                        try {
                            window.opener.location.href = targetUrl;
                            window.close();
                            return;
                        } catch (e) { }
                    }
                    router.push(targetUrl);
                }, 1500);
            } else {
                setStatus('failed');
                setMessage(res.message || 'Payment verification failed. Please try again.');
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                'Could not verify payment reference. Please try again or contact support.';
            setStatus('failed');
            setMessage(msg);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">

            {/* VERIFYING STATE */}
            {status === 'verifying' && (
                <div className="space-y-4 py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-brand-peach/50 text-brand-orange flex items-center justify-center mx-auto shadow-sm">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Verifying Payment</h2>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">{message}</p>
                </div>
            )}

            {/* SUPPORT SERVICE SLOT SELECTION STATE */}
            {status === 'slot_selection' && (
                <div className="space-y-6 animate-in fade-in duration-300">

                    <div className="space-y-2 text-center sm:text-left border-b border-gray-100 pb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Payment Received</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Select Weekly Tutor Schedule
                        </h2>
                        <p className="text-sm text-gray-600">
                            You have enrolled in <strong>{enrollment?.offeringTitle || 'Support Service'}</strong>. Please select your child's weekly class slot.
                        </p>
                    </div>

                    {isFetchingSlots ? (
                        <div className="py-10 text-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
                            <p className="text-xs font-semibold text-gray-500">Loading available tutor schedule slots...</p>
                        </div>
                    ) : slotsError ? (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium space-y-2">
                            <p>{slotsError}</p>
                            <button
                                type="button"
                                onClick={() => enrollment && loadSlotsForEnrollment(enrollment.id)}
                                className="text-xs font-black underline cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center text-sm font-semibold text-gray-600">
                            No schedule slots are available yet. Our team will reach out to arrange your class times.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {slots.map((slot) => {
                                const isSelected = selectedSlotId === slot.id;
                                const isFull = slot.remainingCapacity <= 0;

                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        disabled={isFull}
                                        onClick={() => setSelectedSlotId(slot.id)}
                                        className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${isFull
                                            ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                                            : isSelected
                                                ? 'border-brand-orange bg-brand-peach/40 ring-2 ring-brand-orange/30 shadow-sm'
                                                : 'border-gray-200 bg-white hover:border-brand-orange/40 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {slot.dayOfWeek}s at {slot.startTime} - {slot.endTime}
                                                </span>
                                                <span className="text-[11px] text-gray-500 font-medium">({slot.timezone})</span>
                                            </div>

                                            <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                                                <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
                                                <span>Tutor: {slot.teacher?.fullName || 'Assigned Expert Tutor'}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                                                {isFull ? 'Full' : `${slot.remainingCapacity} seats left`}
                                            </span>

                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-orange bg-brand-orange text-white' : 'border-gray-300'}`}>
                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {bookingError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                            {bookingError}
                        </div>
                    )}

                    {/* Action controls */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/onboarding/diagnostic')}
                            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50"
                        >
                            Skip for Now
                        </button>

                        <button
                            type="button"
                            disabled={!selectedSlotId || isBookingSlot}
                            onClick={handleConfirmSlot}
                            className="px-7 py-3.5 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {isBookingSlot ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Confirming Schedule...</span>
                                </>
                            ) : (
                                <>
                                    <span>Confirm Schedule</span>
                                    <Check className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            )}

            {/* FINAL SUCCESS STATE */}
            {status === 'success' && (
                <div className="space-y-6 py-6 text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            {paymentType === 'support' ? 'Support Service Confirmed!' : 'Payment Confirmed!'}
                        </h2>
                        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">{message}</p>
                    </div>

                    {/* Support Enrollment Summary */}
                    {paymentType === 'support' && enrollment && (
                        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-left space-y-2 text-xs font-semibold text-emerald-900 max-w-md mx-auto">
                            <p className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold">Enrollment Details</p>
                            <p className="text-sm font-bold text-emerald-950">{enrollment.offeringTitle}</p>
                            {enrollment.slot && (
                                <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/60">
                                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Schedule: {enrollment.slot.dayOfWeek}s at {enrollment.slot.startTime} - {enrollment.slot.endTime}</span>
                                </div>
                            )}
                            {enrollment.teacher && (
                                <div className="flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Tutor: {enrollment.teacher.fullName}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => router.push('/onboarding/diagnostic')}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Return to Diagnostic Quiz</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* FAILED STATE */}
            {status === 'failed' && (
                <div className="space-y-6 py-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                        <XCircle className="w-10 h-10" />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">Payment Unsuccessful</h2>
                        <p className="text-xs sm:text-sm text-gray-500">{message}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/onboarding/diagnostic')}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Return to Diagnostic Quiz</span>
                    </button>
                </div>
            )}

        </div>
    );
}
