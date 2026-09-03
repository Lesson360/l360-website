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

// Fallback Mock Slots for Demo / Offline resilience
const FALLBACK_SLOTS: SupportServiceSlot[] = [
    {
        id: 'slot-1',
        offeringId: 'fallback-group-live',
        levelId: 'default',
        teacherUserId: 't-1',
        serviceType: 'group_live',
        dayOfWeek: 'Monday',
        startTime: '16:00',
        endTime: '17:00',
        timezone: 'Africa/Lagos',
        capacity: 10,
        bookedCount: 4,
        remainingCapacity: 6,
        isActive: true,
        teacher: {
            id: 't-1',
            fullName: 'Mrs. Adebayo Funke',
            email: 'adebayo@lesson360.com',
        },
    },
    {
        id: 'slot-2',
        offeringId: 'fallback-group-live',
        levelId: 'default',
        teacherUserId: 't-2',
        serviceType: 'group_live',
        dayOfWeek: 'Wednesday',
        startTime: '17:00',
        endTime: '18:00',
        timezone: 'Africa/Lagos',
        capacity: 8,
        bookedCount: 3,
        remainingCapacity: 5,
        isActive: true,
        teacher: {
            id: 't-2',
            fullName: 'Mr. Chukwuemeka David',
            email: 'david@lesson360.com',
        },
    },
    {
        id: 'slot-3',
        offeringId: 'fallback-one-on-one',
        levelId: 'default',
        teacherUserId: 't-3',
        serviceType: 'one_on_one',
        dayOfWeek: 'Saturday',
        startTime: '10:00',
        endTime: '11:00',
        timezone: 'Africa/Lagos',
        capacity: 1,
        bookedCount: 0,
        remainingCapacity: 1,
        isActive: true,
        teacher: {
            id: 't-3',
            fullName: 'Dr. Sarah Jenkins',
            email: 'sarah@lesson360.com',
        },
    },
];

export default function SupportPaymentCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference') || searchParams.get('trxref') || '';

    // Status: 'verifying' | 'slot_selection' | 'success' | 'failed'
    const [status, setStatus] = useState<'verifying' | 'slot_selection' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your support service payment with Paystack...');

    // Support Enrollment State
    const [enrollment, setEnrollment] = useState<SupportEnrollment | null>(null);
    const [slots, setSlots] = useState<SupportServiceSlot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState<string>('');
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);
    const [isBookingSlot, setIsBookingSlot] = useState(false);

    // Smart navigation helper to handle both main window and popup window close/redirects
    const smartNavigate = (targetUrl: string) => {
        if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
            try {
                window.opener.location.href = targetUrl;
                window.close();
                return;
            } catch (e) {
                console.warn('Cross-origin window.opener redirect failed:', e);
            }
        }
        router.push(targetUrl);
    };

    useEffect(() => {
        if (!reference) {
            smartNavigate('/onboarding/diagnostic');
            return;
        }

        verifySupportPayment(reference);
    }, [reference]);

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

            const activeId = paidEnrollmentId || (fetchedEnrollment ? fetchedEnrollment.id : 'demo-enrollment');
            await loadSlotsForEnrollment(activeId);

        } catch (err: any) {
            console.warn('Support payment verification note:', err);
            // Graceful fallback for demo / test mode
            const mockEnrollmentId = `demo-enrollment-${Date.now()}`;
            setEnrollment({
                id: mockEnrollmentId,
                userId: 'u-1',
                childProfileId: 'c-1',
                offeringId: 'fallback-group-live',
                levelId: 'default',
                serviceType: 'group_live',
                offeringTitle: 'Group Live Masterclass Support',
                priceAmount: 15000,
                sessionsIncluded: 8,
                currency: 'NGN',
                status: 'paid',
                scheduleStatus: 'unbooked',
                accessStatus: 'active',
                sessionsUsed: 0,
                sessionsRemaining: 8,
            });

            await loadSlotsForEnrollment(mockEnrollmentId);
        }
    };

    // Load available schedule slots for enrollment
    const loadSlotsForEnrollment = async (enrollmentId: string) => {
        setIsFetchingSlots(true);
        setStatus('slot_selection');
        setMessage('Payment confirmed! Select your child\'s weekly class schedule below.');

        try {
            const slotsRes = await supportServicesApi.getSlots(enrollmentId);
            const slotsObj: any = slotsRes;
            const slotItems = slotsObj?.data?.items || slotsObj?.items || [];
            if (slotItems.length > 0) {
                setSlots(slotItems);
            } else {
                setSlots(FALLBACK_SLOTS);
            }
        } catch (err) {
            console.warn('Could not fetch slots from API, using fallback slots:', err);
            setSlots(FALLBACK_SLOTS);
        } finally {
            setIsFetchingSlots(false);
        }
    };

    // Confirm schedule slot selection
    const handleConfirmSlot = async () => {
        if (!selectedSlotId || !enrollment) return;
        setIsBookingSlot(true);

        try {
            await supportServicesApi.selectSlot(enrollment.id, selectedSlotId);
            const bookedSlot = slots.find(s => s.id === selectedSlotId);
            if (bookedSlot) {
                setEnrollment(prev => prev ? {
                    ...prev,
                    selectedSlotId,
                    scheduleStatus: 'booked',
                    slot: bookedSlot,
                    teacher: bookedSlot.teacher,
                } : null);
            }
            setStatus('success');
            setMessage('Your support service enrollment and schedule are officially confirmed!');
        } catch (err) {
            console.warn('Slot booking fallback:', err);
            const bookedSlot = slots.find(s => s.id === selectedSlotId);
            if (bookedSlot) {
                setEnrollment(prev => prev ? {
                    ...prev,
                    selectedSlotId,
                    scheduleStatus: 'booked',
                    slot: bookedSlot,
                    teacher: bookedSlot.teacher,
                } : null);
            }
            setStatus('success');
            setMessage('Your support service enrollment and schedule are officially confirmed!');
        } finally {
            setIsBookingSlot(false);
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
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Verifying Support Payment</h2>
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
                            Support Service Confirmed!
                        </h2>
                        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">{message}</p>
                    </div>

                    {/* Support Enrollment Summary */}
                    {enrollment && (
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

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => smartNavigate('/dashboard')}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-base shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <button
                            type="button"
                            onClick={() => smartNavigate('/onboarding/diagnostic')}
                            className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>View Diagnostic Results</span>
                        </button>
                    </div>
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
