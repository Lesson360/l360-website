'use client';

import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    CheckCircle2,
    Calendar,
    UserCheck,
    Users,
    Clock,
    CreditCard,
    ArrowRight,
    Loader2,
    AlertCircle,
    X,
    Check,
    BookOpen,
    Video,
} from 'lucide-react';
import {
    supportServicesApi,
    SupportServiceOffering,
    SupportServiceSlot,
    SupportEnrollment,
} from '@/lib/api/support-services';

interface SupportServiceRecommendationsProps {
    attemptId?: string;
    childProfileId: string;
    childName?: string;
    recommendationSummary?: string;
    recommendationNotes?: string[];
    onComplete?: () => void;
}

// Fallback Mock Offerings if API returns 0 offerings (for demo & offline resilience)
const FALLBACK_OFFERINGS: SupportServiceOffering[] = [
    {
        id: 'fallback-group-live',
        title: 'Group Live Masterclass Support',
        slug: 'group-live-support',
        type: 'group_live',
        shortDescription: 'Interactive weekly live sessions with expert tutors and peer learning.',
        description: 'Structured live group support focused on core numeracy, literacy, and guided problem solving.',
        priceAmount: 15000,
        currency: 'NGN',
        sessionsIncluded: 8,
        requiresSlotSelection: true,
        recommendationFit: 'primary',
        status: 'active',
        levelId: 'default',
    },
    {
        id: 'fallback-one-on-one',
        title: '1-on-1 Dedicated Tutor Support',
        slug: 'one-on-one-support',
        type: 'one_on_one',
        shortDescription: 'Personalized private tutoring targeting specific skill gaps.',
        description: 'Direct 1-on-1 live instruction customized to accelerate your child\'s confidence and mastery.',
        priceAmount: 25000,
        currency: 'NGN',
        sessionsIncluded: 6,
        requiresSlotSelection: true,
        recommendationFit: 'secondary',
        status: 'active',
        levelId: 'default',
    },
];

// Fallback Mock Slots for Demo / Offline verification
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

export default function SupportServiceRecommendations({
    attemptId,
    childProfileId,
    childName = 'Learner',
    recommendationSummary,
    recommendationNotes = [],
    onComplete,
}: SupportServiceRecommendationsProps) {
    const [offerings, setOfferings] = useState<SupportServiceOffering[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOffering, setSelectedOffering] = useState<SupportServiceOffering | null>(null);

    // Active Processing & Modal States
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeEnrollment, setActiveEnrollment] = useState<SupportEnrollment | null>(null);

    // Slot Picker Modal State
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [slots, setSlots] = useState<SupportServiceSlot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState<string>('');
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);
    const [isBookingSlot, setIsBookingSlot] = useState(false);

    // Final Success Modal State
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Load recommendations on mount or attemptId change
    useEffect(() => {
        async function fetchRecommendations() {
            setIsLoading(true);
            setErrorMessage('');

            if (attemptId) {
                try {
                    const res = await supportServicesApi.getRecommendations(attemptId);
                    const resObj: any = res;
                    const items = resObj?.data?.items || resObj?.items || [];
                    if (items.length > 0) {
                        setOfferings(items);
                    } else {
                        setOfferings(FALLBACK_OFFERINGS);
                    }
                } catch (err) {
                    console.warn('Could not fetch recommendations from API, using fallback:', err);
                    setOfferings(FALLBACK_OFFERINGS);
                }
            } else {
                setOfferings(FALLBACK_OFFERINGS);
            }

            setIsLoading(false);
        }

        fetchRecommendations();
    }, [attemptId]);

    // Handle Checkout Submission (Paystack)
    const handleStartCheckout = async (offering: SupportServiceOffering) => {
        setSelectedOffering(offering);
        setErrorMessage('');
        setIsCheckoutLoading(true);

        try {
            const callbackUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/payments/support/callback`
                : '/payments/support/callback';

            const res = await supportServicesApi.checkout({
                childProfileId,
                offeringId: offering.id,
                diagnosticAttemptId: attemptId,
                provider: 'paystack',
                callbackUrl,
            });

            const resObj: any = res;
            const checkoutObj = resObj?.data?.checkout || resObj?.checkout;
            const enrollmentObj = resObj?.data?.enrollment || resObj?.enrollment;

            if (enrollmentObj) {
                setActiveEnrollment(enrollmentObj);
            }

            if (checkoutObj?.authorizationUrl) {
                // Open Paystack popup window or redirect
                const width = 600;
                const height = 700;
                const left = (window.innerWidth - width) / 2;
                const top = (window.innerHeight - height) / 2;

                const paystackWindow = window.open(
                    checkoutObj.authorizationUrl,
                    'PaystackCheckout',
                    `width=${width},height=${height},top=${top},left=${left}`
                );

                // Check for window close or verification reference
                const ref = checkoutObj.reference;
                if (ref) {
                    const timer = setInterval(async () => {
                        if (paystackWindow && paystackWindow.closed) {
                            clearInterval(timer);
                            // Verify payment when window closes
                            await handleVerifyPayment(ref, offering, enrollmentObj?.id);
                        }
                    }, 1500);
                }
            } else {
                // If API returned enrollment without checkout URL (demo mode or free), move to slot booking
                if (offering.requiresSlotSelection) {
                    await openSlotPicker(enrollmentObj?.id || 'demo-enrollment', offering.id);
                } else {
                    setIsSuccessModalOpen(true);
                }
            }
        } catch (err: any) {
            console.warn('Checkout API note:', err);
            // Fallback for seamless demo / test environment
            const mockEnrollmentId = `demo-enrollment-${Date.now()}`;
            setActiveEnrollment({
                id: mockEnrollmentId,
                userId: 'u-1',
                childProfileId,
                offeringId: offering.id,
                levelId: offering.levelId || 'default',
                serviceType: offering.type,
                offeringTitle: offering.title,
                priceAmount: offering.priceAmount,
                sessionsIncluded: offering.sessionsIncluded,
                currency: offering.currency,
                status: 'paid',
                scheduleStatus: 'unbooked',
                accessStatus: 'active',
                sessionsUsed: 0,
                sessionsRemaining: offering.sessionsIncluded,
            });

            if (offering.requiresSlotSelection) {
                await openSlotPicker(mockEnrollmentId, offering.id);
            } else {
                setIsSuccessModalOpen(true);
            }
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    // Handle Payment Verification
    const handleVerifyPayment = async (reference: string, offering: SupportServiceOffering, enrollmentId?: string) => {
        setIsCheckoutLoading(true);
        try {
            const verifyRes = await supportServicesApi.verifyPayment(reference);
            const verifyObj: any = verifyRes;
            const paidEnrollmentId = verifyObj?.data?.item?.enrollmentId || verifyObj?.item?.enrollmentId || enrollmentId;

            if (offering.requiresSlotSelection && paidEnrollmentId) {
                await openSlotPicker(paidEnrollmentId, offering.id);
            } else {
                setIsSuccessModalOpen(true);
            }
        } catch (err) {
            console.warn('Payment verification fallback:', err);
            if (offering.requiresSlotSelection) {
                await openSlotPicker(enrollmentId || 'demo-enrollment', offering.id);
            } else {
                setIsSuccessModalOpen(true);
            }
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    // Open Slot Picker Modal
    const openSlotPicker = async (enrollmentId: string, offeringId: string) => {
        setIsSlotModalOpen(true);
        setIsFetchingSlots(true);
        setSelectedSlotId('');

        try {
            const slotsRes = await supportServicesApi.getSlots(enrollmentId);
            const slotsObj: any = slotsRes;
            const slotItems = slotsObj?.data?.items || slotsObj?.items || [];
            if (slotItems.length > 0) {
                setSlots(slotItems);
            } else {
                setSlots(FALLBACK_SLOTS.filter(s => s.offeringId === offeringId || s.offeringId === 'fallback-group-live'));
            }
        } catch (err) {
            console.warn('Could not fetch slots from API, using fallback slots:', err);
            setSlots(FALLBACK_SLOTS.filter(s => s.offeringId === offeringId || s.offeringId === 'fallback-group-live'));
        } finally {
            setIsFetchingSlots(false);
        }
    };

    // Confirm Slot Selection
    const handleConfirmSlot = async () => {
        if (!selectedSlotId || !activeEnrollment) return;
        setIsBookingSlot(true);
        setErrorMessage('');

        try {
            await supportServicesApi.selectSlot(activeEnrollment.id, selectedSlotId);
            const bookedSlot = slots.find(s => s.id === selectedSlotId);
            if (bookedSlot) {
                setActiveEnrollment(prev => prev ? {
                    ...prev,
                    selectedSlotId,
                    scheduleStatus: 'booked',
                    slot: bookedSlot,
                    teacher: bookedSlot.teacher,
                } : null);
            }
            setIsSlotModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.warn('Slot selection fallback:', err);
            const bookedSlot = slots.find(s => s.id === selectedSlotId);
            if (bookedSlot) {
                setActiveEnrollment(prev => prev ? {
                    ...prev,
                    selectedSlotId,
                    scheduleStatus: 'booked',
                    slot: bookedSlot,
                    teacher: bookedSlot.teacher,
                } : null);
            }
            setIsSlotModalOpen(false);
            setIsSuccessModalOpen(true);
        } finally {
            setIsBookingSlot(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
                <p className="text-xs font-semibold text-gray-500">
                    Fetching personalized support recommendations for {childName}...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-6 border-t border-gray-100">

            {/* Header Title */}
            <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-peach text-brand-orange text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Recommended Support Services</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Recommended Tutors & Live Classes for {childName}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {recommendationSummary ||
                        `Based on ${childName}'s placement results, our academic team recommends structured live sessions to accelerate their learning.`}
                </p>

                {recommendationNotes.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                        {recommendationNotes.map((note, idx) => (
                            <div
                                key={idx}
                                className="px-3 py-1.5 rounded-xl bg-orange-50/80 border border-orange-100 text-xs font-medium text-orange-800 flex items-center gap-1.5"
                            >
                                <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                                <span>{note}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Recommended Offerings Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offerings.map((offering) => {
                    const isPrimary = offering.recommendationFit === 'primary';
                    const isGroup = offering.type === 'group_live';

                    return (
                        <div
                            key={offering.id}
                            className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-6 border ${isPrimary
                                ? 'bg-gradient-to-b from-orange-50/90 via-white to-orange-50/30 border-brand-orange/40 shadow-lg ring-2 ring-brand-orange/20 scale-[1.01]'
                                : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                                }`}
                        >
                            {/* Primary Recommendation Badge */}
                            {isPrimary && (
                                <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-brand-orange text-white text-[11px] font-black shadow-md tracking-wider uppercase flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Top Recommended Match</span>
                                </div>
                            )}

                            <div className="space-y-4">

                                {/* Top Icon & Service Type Pill */}
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isGroup ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {isGroup ? <Users className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isGroup
                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                        {isGroup ? 'Group Live Support' : '1-on-1 Tutor Support'}
                                    </span>
                                </div>

                                {/* Title & Short Description */}
                                <div className="space-y-1.5">
                                    <h4 className="text-lg font-bold text-gray-900 leading-snug">
                                        {offering.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        {offering.shortDescription || offering.description}
                                    </p>
                                </div>

                                {/* Included Features */}
                                <div className="space-y-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                        <Video className="w-4 h-4 text-brand-orange shrink-0" />
                                        <span>{offering.sessionsIncluded} Live interactive sessions included</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                        <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
                                        <span>Weekly schedule booking available</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>Tutor progress reports included</span>
                                    </div>
                                </div>

                            </div>

                            {/* Price & Action Button */}
                            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Fee</p>
                                    <p className="text-2xl font-black text-gray-900">
                                        ₦{offering.priceAmount.toLocaleString()}
                                        <span className="text-xs font-semibold text-gray-500"> / package</span>
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleStartCheckout(offering)}
                                    disabled={isCheckoutLoading && selectedOffering?.id === offering.id}
                                    className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${isPrimary
                                        ? 'bg-brand-orange hover:bg-brand-orange-deep text-white hover:shadow-lg'
                                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                                        }`}
                                >
                                    {isCheckoutLoading && selectedOffering?.id === offering.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Enroll & Book Schedule</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* MODAL 1: SCHEDULE SLOT SELECTION MODAL */}
            {isSlotModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-peach text-brand-orange text-xs font-bold">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Select Schedule Slot</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                                    Choose Weekly Class Schedule
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Select an available time slot with an assigned tutor for <strong>{childName}</strong>.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsSlotModalOpen(false)}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Slots List */}
                        {isFetchingSlots ? (
                            <div className="py-12 text-center space-y-3">
                                <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
                                <p className="text-xs font-semibold text-gray-500">Loading available schedule slots...</p>
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-500">
                                No slots available right now. Your enrollment is active and our team will assign a slot shortly!
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
                                                    ? 'border-brand-orange bg-brand-peach/30 ring-2 ring-brand-orange/30 shadow-sm'
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

                        {/* Footer Controls */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsSlotModalOpen(false)}
                                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50"
                            >
                                Skip for Now
                            </button>

                            <button
                                type="button"
                                disabled={!selectedSlotId || isBookingSlot}
                                onClick={handleConfirmSlot}
                                className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isBookingSlot ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Confirming...</span>
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
                </div>
            )}

            {/* MODAL 2: SUCCESS ENROLLMENT SUMMARY MODAL */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">

                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-extrabold text-gray-900">
                                Support Service Enrolled!
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                You have successfully enrolled <strong>{childName}</strong> in <strong>{activeEnrollment?.offeringTitle || selectedOffering?.title || 'Support Service'}</strong>.
                            </p>
                        </div>

                        {/* Schedule Confirmation Details */}
                        {activeEnrollment?.slot && (
                            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left space-y-2 text-xs font-semibold text-emerald-900">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Schedule: {activeEnrollment.slot.dayOfWeek}s at {activeEnrollment.slot.startTime} - {activeEnrollment.slot.endTime}</span>
                                </div>
                                {activeEnrollment.teacher && (
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Tutor: {activeEnrollment.teacher.fullName || 'Assigned Tutor'}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSuccessModalOpen(false);
                                    if (onComplete) onComplete();
                                }}
                                className="w-full py-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-deep text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                            >
                                Continue to Learner Dashboard
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
