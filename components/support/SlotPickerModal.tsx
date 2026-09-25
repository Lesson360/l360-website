'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Loader2, UserCheck, X } from 'lucide-react';
import { supportServicesApi, SupportServiceSlot } from '@/lib/api/support-services';

interface SlotPickerModalProps {
    enrollmentId: string;
    offeringTitle: string;
    onClose: () => void;
    onBooked: () => void;
}

export function SlotPickerModal({ enrollmentId, offeringTitle, onClose, onBooked }: SlotPickerModalProps) {
    const [slots, setSlots] = useState<SupportServiceSlot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [bookError, setBookError] = useState('');

    const loadSlots = async () => {
        setIsLoading(true);
        setLoadError('');
        try {
            const res: any = await supportServicesApi.getSlots(enrollmentId);
            const body = res?.data ?? res;
            setSlots(body?.items || []);
        } catch (err: any) {
            setLoadError(err?.response?.data?.message || 'Could not load the available schedule slots.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSlots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enrollmentId]);

    const handleConfirm = async () => {
        if (!selectedSlotId) return;
        setIsBooking(true);
        setBookError('');
        try {
            await supportServicesApi.selectSlot(enrollmentId, selectedSlotId);
            onBooked();
        } catch (err: any) {
            setBookError(err?.response?.data?.message || 'Could not book this slot. Please choose another.');
            // A full/invalid slot means the list is stale — refresh it.
            if ([400, 409].includes(err?.response?.status)) {
                setSelectedSlotId('');
                loadSlots();
            }
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Choose a Weekly Schedule</h2>
                        <p className="text-xs text-gray-500 mt-1">{offeringTitle}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="py-10 flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin text-[#FF4801]" /> Loading available slots...
                    </div>
                ) : loadError ? (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium space-y-2">
                        <p>{loadError}</p>
                        <button type="button" onClick={loadSlots} className="text-xs font-black underline cursor-pointer">Retry</button>
                    </div>
                ) : slots.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center text-sm font-semibold text-gray-600">
                        No schedule slots are available yet. Our team will reach out to arrange your class times.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {slots.map((slot) => {
                            const isFull = slot.remainingCapacity <= 0;
                            const isSelected = selectedSlotId === slot.id;
                            return (
                                <button
                                    key={slot.id}
                                    type="button"
                                    disabled={isFull}
                                    onClick={() => setSelectedSlotId(slot.id)}
                                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${isFull
                                        ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                                        : isSelected
                                            ? 'border-[#FF4801] bg-orange-50 ring-2 ring-[#FF4801]/30'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900 capitalize">
                                            {slot.dayOfWeek}s · {slot.startTime} - {slot.endTime}
                                            <span className="text-[11px] text-gray-500 font-medium normal-case"> ({slot.timezone})</span>
                                        </p>
                                        {slot.teacher?.fullName && (
                                            <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                                                <UserCheck className="w-3.5 h-3.5 text-[#FF4801]" /> {slot.teacher.fullName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                                            {isFull ? 'Full' : `${slot.remainingCapacity} left`}
                                        </span>
                                        {isSelected && <Check className="w-4 h-4 text-[#FF4801]" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {bookError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {bookError}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-1">
                    <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs cursor-pointer hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!selectedSlotId || isBooking}
                        onClick={handleConfirm}
                        className="px-6 py-3 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                        {isBooking && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{isBooking ? 'Booking...' : 'Confirm Schedule'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
