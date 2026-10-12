import { NextRequest, NextResponse } from 'next/server';
import { loginUrlWithRedirect } from '@/lib/redirect';

// The token is issued by the backend, so we can't verify its signature here.
// We only reject requests with no token or a JWT whose `exp` has passed; the
// API client's 401 interceptor remains the source of truth for revoked tokens.
function isTokenUsable(token: string | undefined): boolean {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return true; // not a JWT — let the backend decide

    try {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (typeof payload.exp !== 'number') return true;
        return payload.exp * 1000 > Date.now();
    } catch {
        return true;
    }
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (isTokenUsable(token)) {
        return NextResponse.next();
    }

    const { pathname, search } = request.nextUrl;
    const response = NextResponse.redirect(new URL(loginUrlWithRedirect(pathname + search), request.url));
    if (token) response.cookies.delete('token');
    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/onboarding/:path*', '/payments/:path*'],
};
