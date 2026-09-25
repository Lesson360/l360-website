import { apiClient } from './client';

export type LiveSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface LiveSession {
    id: string;
    offeringId?: string;
    enrollmentId?: string;
    slotId?: string;
    childProfileId?: string;
    teacherUserId?: string;
    serviceType?: 'group_live' | 'one_on_one' | string;
    title: string;
    description?: string;
    facilitatorName?: string;
    facilitatorEmail?: string;
    meetingProvider?: 'custom' | 'google_meet' | 'zoom' | string;
    joinUrl?: string;
    joinInstructions?: string;
    startsAt: string;
    endsAt?: string | null;
    status: LiveSessionStatus | string;
    notes?: string;
    offering?: { id?: string; title?: string; type?: string } | null;
    enrollment?: any;
    childProfile?: { id?: string; name?: string } | null;
}

export interface LiveSessionMeeting {
    provider: 'custom' | 'google_meet' | 'zoom' | string;
    // Manual-link sessions
    joinUrl?: string;
    inApp?: boolean;
    // Zoom Meeting SDK sessions
    sdkKey?: string;
    signature?: string;
    meetingNumber?: string;
    password?: string;
    userName?: string;
    role?: number;
    expiresAt?: string;
}

export interface LiveSessionJoinResult {
    message?: string;
    enrollmentId?: string;
    meeting?: LiveSessionMeeting;
}

export interface LiveSessionFilters {
    status?: LiveSessionStatus;
    offeringId?: string;
    page?: number;
    limit?: number;
}

// Responses follow the backend's usual envelope: { message, data: { ... } }. Lists arrive as
// data.items (+ total), single resources as data.item. Parsing is defensive so a slightly
// different wrapper never blanks the screen.
function unwrap(res: any): any {
    return res?.data ?? res;
}

function normalizeSession(raw: any): LiveSession {
    return { ...raw, id: String(raw?.id || raw?._id || '') };
}

export const liveClassesApi = {
    async list(
        childProfileId: string,
        filters: LiveSessionFilters = {}
    ): Promise<{ items: LiveSession[]; total: number }> {
        const res: any = await apiClient.get('/support-services/sessions', {
            params: { childProfileId, ...filters }
        });
        const body = unwrap(res);
        const rawItems: any[] = Array.isArray(body)
            ? body
            : body?.items || body?.sessions || [];
        const items = rawItems.filter((s) => s && (s.id || s._id)).map(normalizeSession);
        return { items, total: typeof body?.total === 'number' ? body.total : items.length };
    },

    async getById(sessionId: string): Promise<LiveSession> {
        const res: any = await apiClient.get(`/support-services/sessions/${sessionId}`);
        const body = unwrap(res);
        return normalizeSession(body?.item || body?.session || body);
    },

    async join(sessionId: string): Promise<LiveSessionJoinResult> {
        const res: any = await apiClient.post(`/support-services/sessions/${sessionId}/join`, {});
        const body = unwrap(res);
        return {
            message: res?.message || body?.message,
            enrollmentId: body?.enrollmentId,
            meeting: body?.meeting
        };
    }
};

// ------------------------------------------------------------------
// Product join-window policy (client-side — the backend only blocks
// cancelled/completed sessions): joinable from 10 minutes before the start
// until the scheduled end (or 2h after start when no end is given).
// ------------------------------------------------------------------
export const JOIN_WINDOW_LEAD_MINUTES = 10;
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export type LiveSessionPhase = 'upcoming' | 'joinable' | 'live' | 'ended' | 'cancelled';

export function getSessionPhase(session: LiveSession, now: number = Date.now()): LiveSessionPhase {
    if (session.status === 'cancelled') return 'cancelled';
    if (session.status === 'completed') return 'ended';

    const start = new Date(session.startsAt).getTime();
    const end = session.endsAt ? new Date(session.endsAt).getTime() : start + DEFAULT_DURATION_MS;

    if (session.status === 'in_progress') return now > end + DEFAULT_DURATION_MS ? 'ended' : 'live';
    if (now > end) return 'ended';
    if (now >= start - JOIN_WINDOW_LEAD_MINUTES * 60 * 1000) return 'joinable';
    return 'upcoming';
}

export function formatSessionTime(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}
