'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Dependency-free NProgress-style top loading bar. Next's App Router gives no "navigation
// started" event, so we fake one: clicking any same-origin, non-hash internal link starts the
// bar immediately (so it feels instant), and it ramps toward 90% while waiting. The bar
// completes when this component re-renders with a new pathname/search — i.e. the destination
// page has actually mounted.
export function TopLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const rampRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isNavigatingRef = useRef(false);
    const currentKeyRef = useRef(`${pathname}?${searchParams?.toString() || ''}`);

    const clearTimers = () => {
        if (rampRef.current) clearInterval(rampRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };

    const start = () => {
        if (isNavigatingRef.current) return;
        isNavigatingRef.current = true;
        clearTimers();
        setVisible(true);
        setProgress(8);
        rampRef.current = setInterval(() => {
            setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.1 + 1));
        }, 200);
    };

    const finish = () => {
        if (!isNavigatingRef.current) return;
        isNavigatingRef.current = false;
        clearTimers();
        setProgress(100);
        hideTimeoutRef.current = setTimeout(() => {
            setVisible(false);
            setProgress(0);
        }, 250);
    };

    // A new pathname/search means the destination route has rendered — finish the bar.
    useEffect(() => {
        const key = `${pathname}?${searchParams?.toString() || ''}`;
        if (key !== currentKeyRef.current) {
            currentKeyRef.current = key;
        }
        finish();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            const anchor = (e.target as HTMLElement)?.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

            let url: URL;
            try {
                url = new URL(href, window.location.href);
            } catch {
                return;
            }
            if (url.origin !== window.location.origin) return;

            const destination = `${url.pathname}${url.search}`;
            const current = `${window.location.pathname}${window.location.search}`;
            if (destination === current) return;

            start();
        };

        const onPopState = () => start();

        document.addEventListener('click', onClick);
        window.addEventListener('popstate', onPopState);
        return () => {
            document.removeEventListener('click', onClick);
            window.removeEventListener('popstate', onPopState);
            clearTimers();
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent pointer-events-none">
            <div
                className="h-full bg-[#FF4801] shadow-[0_0_10px_rgba(255,72,1,0.6)] transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
