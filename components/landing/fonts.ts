import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google';

// Landing-page typefaces. Scoped to the landing wrapper so the rest of the
// app keeps its Comic Neue styling.
// Variable font with the optical-size axis: the big headlines rely on it for
// their tighter large-size letterforms.
export const grotesk = Bricolage_Grotesque({
    subsets: ['latin'],
    axes: ['opsz'],
    display: 'swap',
    variable: '--font-grotesk',
});

export const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
    variable: '--font-dm',
});

export const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['500', '700'],
    display: 'swap',
    variable: '--font-jetbrains',
});

export const landingFontVars = `${grotesk.variable} ${dmSans.variable} ${jetbrains.variable}`;
