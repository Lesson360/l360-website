'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CalendarClock, Info, Loader2, User } from 'lucide-react';
import {
    LiveSession,
    formatSessionTime,
    getSessionPhase,
    liveClassesApi
} from '@/lib/api/live-classes';
import { LiveClassJoinButton } from '@/components/live-classes/LiveClassJoinButton';

const STATUS_LABEL: Record<string, string> = {
    live: 'Live now',
    joinable: 'Starting soon',
    upcoming: 'Scheduled',
    ended: 'Completed',
    cancelled: 'Cancelled'
};

export default function LiveClassDetailPage() {
    const params = useParams<{ sessionId: string }>();
    const router = useRouter();
    const sessionId = params?.sessionId;

    const [session, setSession] = useState<LiveSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const loadSession = useCallback(async (showSpinner: boolean) => {
        if (!sessionId) return;
        if (showSpinner) setIsLoading(true);
        setErrorMessage('');
        try {
            setSession(await liveClassesApi.getById(sessionId));
        } catch (err: any) {
            setSession(null);
            setErrorMessage(
                err?.response?.status === 404
                    ? 'This live class is no longer available for this child.'
                    : err?.response?.data?.message || 'Could not load this live class. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadSession(true);
    }, [loadSession]);

    useEffect(() => {
        const onFocus = () => loadSession(false);
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [loadSession]);

    const back = (
        <Link href="/dashboard/live-classes" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF4801] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Classes</span>
        </Link>
    );

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                {back}
                <div className="bg-white rounded-3xl border border-gray-200 p-8 flex items-center justify-center gap-3 text-sm font-bold text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin text-[#FF4801]" />
                    <span>Loading live class...</span>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                {back}
                <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage || 'Live class not found.'}</span>
                </div>
            </div>
        );
    }

    const phase = getSessionPhase(session);

    return (
        <div className="max-w-2xl mx-auto space-y-5">
            {back}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#FF4801] text-[10px] font-black uppercase">
                            {STATUS_LABEL[phase]}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {session.serviceType === 'one_on_one' ? 'One-to-one' : 'Group class'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 leading-snug">{session.title}</h1>
                    {session.offering?.title && (
                        <p className="text-xs font-semibold text-gray-500">{session.offering.title}</p>
                    )}
                    {session.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{session.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CalendarClock className="w-3.5 h-3.5" /> Starts
                        </span>
                        <p className="text-sm font-bold text-gray-900">{formatSessionTime(session.startsAt)}</p>
                    </div>
                    {session.endsAt && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <CalendarClock className="w-3.5 h-3.5" /> Ends
                            </span>
                            <p className="text-sm font-bold text-gray-900">{formatSessionTime(session.endsAt)}</p>
                        </div>
                    )}
                    {session.facilitatorName && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Teacher
                            </span>
                            <p className="text-sm font-bold text-gray-900">{session.facilitatorName}</p>
                        </div>
                    )}
                </div>

                {session.joinInstructions && (
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1 text-sm text-blue-900">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-blue-700">
                            <Info className="w-3.5 h-3.5" /> Instructions
                        </span>
                        <p className="leading-relaxed">{session.joinInstructions}</p>
                    </div>
                )}

                <LiveClassJoinButton
                    session={session}
                    onJoined={() => loadSession(false)}
                    onGone={() => router.push('/dashboard/live-classes')}
                />
            </div>
        </div>
    );
}
