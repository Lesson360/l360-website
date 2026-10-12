import localFont from 'next/font/local';

// Landing-page typefaces. Scoped to the landing wrapper so the rest of the
// app keeps its Comic Neue styling.
//
// Self-hosted (latin variable fonts from Google Fonts) rather than loaded via
// next/font/google: Next 14.2.5's Google loader crashes at build time when
// Google returns a font URL without a file extension, which broke Vercel builds.

// Includes the optical-size axis — the big headlines rely on it for their
// tighter large-size letterforms.
export const grotesk = localFont({
    src: './fonts/bricolage-grotesque-latin.woff2',
    weight: '200 800',
    display: 'swap',
    variable: '--font-grotesk',
    fallback: ['system-ui', 'sans-serif'],
});

export const dmSans = localFont({
    src: './fonts/dm-sans-latin.woff2',
    weight: '400 700',
    display: 'swap',
    variable: '--font-dm',
    fallback: ['system-ui', 'sans-serif'],
});

export const jetbrains = localFont({
    src: './fonts/jetbrains-mono-latin.woff2',
    weight: '100 800',
    display: 'swap',
    variable: '--font-jetbrains',
    fallback: ['ui-monospace', 'monospace'],
});

export const landingFontVars = `${grotesk.variable} ${dmSans.variable} ${jetbrains.variable}`;
