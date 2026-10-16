export type WaitlistRole = 'parent' | 'teacher' | 'school' | 'student';
export type WaitlistLevel = 'early_years' | 'nursery' | 'primary' | 'secondary';

export interface WaitlistPayload {
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: WaitlistRole;
    levels: WaitlistLevel[];
}

/**
 * PLACEHOLDER — the waitlist endpoint isn't available yet, so this only
 * simulates a successful signup and nothing is stored. Before linking the
 * waitlist page publicly, replace the body with the real call, e.g.
 *
 *   return apiClient.post<{ message: string }>('/waitlist', payload);
 *
 * and map field names to whatever the backend expects.
 */
export const waitlistApi = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    join: async (payload: WaitlistPayload): Promise<{ message: string }> => {
        console.warn('[waitlist] API not connected yet — submission was not saved.');
        await new Promise(r => setTimeout(r, 900));
        return { message: 'ok' };
    },
};
