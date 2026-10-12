'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { dmSans, grotesk, jetbrains, landingFontVars } from '../fonts';
import { setScreenFonts } from './screens';

/**
 * Wraps the landing page. Owns the fixed background layer and the WebGL
 * canvas, and hands the rendered markup to the scroll-driven stage.
 */
export function LandingStage({ children }: { children: ReactNode }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const [available, setAvailable] = useState(true);

    useEffect(() => {
        const root = rootRef.current, canvas = canvasRef.current, bgLayer = bgRef.current;
        if (!root || !canvas || !bgLayer) return;

        setScreenFonts({
            display: grotesk.style.fontFamily,
            body: dmSans.style.fontFamily,
            mono: jetbrains.style.fontFamily,
        });

        let destroy: (() => void) | undefined;
        let cancelled = false;
        import('./createStage').then(({ createStage }) => {
            if (cancelled) return;
            destroy = createStage({
                root,
                canvas,
                bgLayer,
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                onUnavailable: () => setAvailable(false),
            });
        });
        return () => { cancelled = true; destroy?.(); };
    }, []);

    return (
        <div
            ref={rootRef}
            data-stage={available ? 'on' : 'off'}
            className={`landing relative min-h-screen overflow-x-clip bg-white font-dm text-ink antialiased ${landingFontVars}`}
        >
            <div ref={bgRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-white" />
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-[1] block h-screen w-screen"
            />
            {children}
        </div>
    );
}
