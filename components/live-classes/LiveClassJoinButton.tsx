'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, Video } from 'lucide-react';
import {
    LiveSession,
    JOIN_WINDOW_LEAD_MINUTES,
    getSessionPhase,
    liveClassesApi
} from '@/lib/api/live-classes';

interface LiveClassJoinButtonProps {
    session: LiveSession;
    // Called after a successful join so the parent can refresh session state.
    onJoined?: () => void;
    // Called when the backend says this child can no longer access the session (404).
    onGone?: () => void;
    className?: string;
}

export function LiveClassJoinButton({ session, onJoined, onGone, className = '' }: LiveClassJoinButtonProps) {
    const [now, setNow] = useState<number>(() => Date.now());
    const [isJoining, setIsJoining] = useState(false);
    const [message, setMessage] = useState<{ text: string; tone: 'error' | 'info' } | null>(null);
    const [openedLink, setOpenedLink] = useState<string | null>(null);

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(id);
    }, []);

    const phase = getSessionPhase(session, now);
    const canJoin = phase === 'joinable' || phase === 'live';

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMessage(null);
        setOpenedLink(null);
        setIsJoining(true);

        try {
            const result = await liveClassesApi.join(session.id);
            const meeting = result.meeting;

            if (meeting?.joinUrl && meeting.inApp !== true) {
                const opened = window.open(meeting.joinUrl, '_blank', 'noopener,noreferrer');
                if (!opened) setOpenedLink(meeting.joinUrl);
                onJoined?.();
            } else if (meeting?.provider === 'zoom') {
                setMessage({
                    tone: 'info',
                    text: 'This class is hosted on Zoom in-app, which isn’t supported on the web yet. Please join from the Lesson360 mobile app.'
                });
                onJoined?.();
            } else {
                setMessage({ tone: 'error', text: 'This live class does not have a join link yet.' });
            }
        } catch (err: any) {
            const status = err?.response?.status;
            const apiMessage = err?.response?.data?.message;
            setMessage({
                tone: 'error',
                text: apiMessage || 'Could not join this class. Please try again.'
            });
            if (status === 404) onGone?.();
        } finally {
            setIsJoining(false);
        }
    };

    let label = 'Join Class';
    if (phase === 'upcoming') label = `Opens ${JOIN_WINDOW_LEAD_MINUTES} min before start`;
    if (phase === 'ended') label = 'Class ended';
    if (phase === 'cancelled') label = 'Cancelled';

    return (
        <div className={`space-y-2 ${className}`}>
            <button
                type="button"
                disabled={!canJoin || isJoining}
                onClick={handleJoin}
                className={`w-full px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${canJoin
                    ? 'bg-[#00C838] hover:bg-emerald-600 text-white shadow-md cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } disabled:opacity-80`}
            >
                {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                <span>{isJoining ? 'Joining...' : phase === 'live' ? 'Join Live Class' : label}</span>
            </button>

            {openedLink && (
                <a
                    href={openedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#FF4801] hover:underline flex items-center gap-1 justify-center"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Popup blocked — open the meeting link</span>
                </a>
            )}

            {message && (
                <p className={`text-[11px] font-semibold text-center ${message.tone === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
