'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CalendarClock, ChevronRight, Loader2, User } from 'lucide-react';
import { useChildProfile } from '@/lib/context/ChildProfileContext';
import {
    LiveSession,
    formatSessionTime,
    getSessionPhase,
    liveClassesApi
} from '@/lib/api/live-classes';
import { LiveClassJoinButton } from '@/components/live-classes/LiveClassJoinButton';

type Tab = 'live' | 'upcoming' | 'past';

const PHASE_BADGE: Record<string, { label: string; className: string }> = {
    live: { label: 'Live now', className: 'bg-emerald-100 text-emerald-700' },
    joinable: { label: 'Starting soon', className: 'bg-amber-100 text-amber-700' },
    upcoming: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700' },
    ended: { label: 'Completed', className: 'bg-gray-100 text-gray-600' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600' }
};

export default function LiveClassesPage() {
    const { activeChild } = useChildProfile();
    const childId = activeChild?.id || activeChild?._id || '';

    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [tab, setTab] = useState<Tab>('upcoming');

    const loadSessions = useCallback(async (showSpinner: boolean) => {
        if (!childId) return;
        if (showSpinner) setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await liveClassesApi.list(childId, { limit: 100 });
            setSessions(res.items);
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || 'Could not load live classes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [childId]);

    // Reload (and drop any previous child's sessions) whenever the selected child changes.
    useEffect(() => {
        setSessions([]);
        if (childId) loadSessions(true);
        else setIsLoading(false);
    }, [childId, loadSessions]);

    // Statuses change server-side (a teacher starts the class), so refresh on window focus.
    useEffect(() => {
        const onFocus = () => loadSessions(false);
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [loadSessions]);

    const now = Date.now();
    const byStart = (a: LiveSession, b: LiveSession) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

    const liveNow = sessions.filter((s) => ['live', 'joinable'].includes(getSessionPhase(s, now))).sort(byStart);
    const upcoming = sessions.filter((s) => getSessionPhase(s, now) === 'upcoming').sort(byStart);
    const past = sessions.filter((s) => ['ended', 'cancelled'].includes(getSessionPhase(s, now))).sort((a, b) => byStart(b, a));

    const tabs: { key: Tab; label: string; items: LiveSession[] }[] = [
        { key: 'live', label: 'Live Now', items: liveNow },
        { key: 'upcoming', label: 'Upcoming', items: upcoming },
        { key: 'past', label: 'Past', items: past }
    ];
    const visible = tabs.find((t) => t.key === tab)?.items || [];

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FF4801] tracking-tight">Live Classes</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Scheduled support classes{activeChild?.name ? ` for ${activeChild.name}` : ''}.
                </p>
            </div>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs w-fit">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === t.key ? 'bg-[#FF4801] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        {t.label} ({t.items.length})
                    </button>
                ))}
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                    <button type="button" onClick={() => loadSessions(true)} className="ml-auto text-xs font-black underline cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[0, 1].map((i) => (
                        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 animate-pulse">
                            <div className="h-4 w-1/3 rounded-full bg-gray-200" />
                            <div className="h-5 w-2/3 rounded-full bg-gray-200" />
                            <div className="h-3 w-1/2 rounded-full bg-gray-100" />
                            <div className="h-10 w-full rounded-xl bg-gray-200" />
                        </div>
                    ))}
                </div>
            ) : !childId ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center text-sm font-bold text-gray-600">
                    Add or select a child to see their live classes.
                </div>
            ) : visible.length === 0 ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center space-y-2">
                    <CalendarClock className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-bold text-gray-700">
                        {tab === 'live' ? 'No classes are live right now.' : tab === 'upcoming' ? 'No upcoming live classes scheduled.' : 'No past live classes yet.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {visible.map((session) => {
                        const phase = getSessionPhase(session, now);
                        const badge = PHASE_BADGE[phase];
                        return (
                            <Link
                                key={session.id}
                                href={`/dashboard/live-classes/${session.id}`}
                                className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${badge.className}`}>
                                            {badge.label}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                                            {session.serviceType === 'one_on_one' ? 'One-to-one' : 'Group'}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-extrabold text-gray-900 leading-snug">{session.title}</h3>
                                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                                        <CalendarClock className="w-3.5 h-3.5" />
                                        {formatSessionTime(session.startsAt)}
                                    </p>
                                    {session.facilitatorName && (
                                        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {session.facilitatorName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <LiveClassJoinButton
                                        session={session}
                                        onJoined={() => loadSessions(false)}
                                        onGone={() => setSessions((prev) => prev.filter((s) => s.id !== session.id))}
                                    />
                                    <span className="text-xs font-bold text-[#FF4801] flex items-center justify-center gap-1">
                                        View details <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
