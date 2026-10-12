export const REDIRECT_PARAM = 'redirect';

/** Builds a /login URL that sends the user back to `returnTo` after signing in. */
export function loginUrlWithRedirect(returnTo: string): string {
    return `/login?${REDIRECT_PARAM}=${encodeURIComponent(returnTo)}`;
}

/**
 * Returns `value` only if it is a same-origin path (e.g. `/dashboard/settings?tab=1`).
 * Rejects absolute and protocol-relative URLs so the param can't be used as an open redirect.
 */
export function getSafeRedirect(value: string | null | undefined): string | null {
    if (!value || !value.startsWith('/')) return null;

    // Parse against a placeholder origin the way a browser would (it normalises
    // tricks like `/\evil.com` or embedded tabs into `//evil.com`), then require
    // that the result is still on that origin.
    const base = 'http://same-origin.invalid';
    let url: URL;
    try {
        url = new URL(value, base);
    } catch {
        return null;
    }
    if (url.origin !== base || url.pathname === '/login') return null;

    return url.pathname + url.search + url.hash;
}
