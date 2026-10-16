import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react'
import { TopLoader } from '@/components/shared/TopLoader';
import { CurrencyProvider } from '@/lib/currency/CurrencyProvider';
import localFont from 'next/font/local';
import './globals.css';

// Self-hosted (latin subset from Google Fonts): next/font/google in Next 14.2.5
// can crash the build when Google returns a font URL without a file extension.
const comicNeue = localFont({
  src: [
    { path: './fonts/comic-neue-300.woff2', weight: '300', style: 'normal' },
    { path: './fonts/comic-neue-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/comic-neue-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-comic-neue',
  fallback: ['cursive', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lesson360.org'),
  title: {
    default: 'Lesson360 | Turn Screen Time Into Learning Time',
    template: '%s | Lesson360',
  },
  description:
    'Lesson360 helps families turn screen time into structured learning with guided video lessons, worksheets, quizzes, and support for nursery, primary, and secondary learners.',
  keywords: [
    'Lesson360',
    'online school Nigeria',
    'African learning platform',
    'video lessons',
    'worksheets',
    'quizzes',
    'home learning',
    'nursery',
    'primary school',
    'secondary school',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lesson360 | Turn Screen Time Into Learning Time',
    description:
      'Structured learning for families with video lessons, worksheets, quizzes, and progress support from nursery to secondary level.',
    url: 'https://lesson360.org',
    siteName: 'Lesson360',
    images: [
      {
        url: '/secondary-student.jpg',
        width: 1200,
        height: 630,
        alt: 'Lesson360 student learning experience',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lesson360 | Turn Screen Time Into Learning Time',
    description:
      'Structured learning for families with video lessons, worksheets, quizzes, and progress support from nursery to secondary level.',
    images: ['/secondary-student.jpg'],
  },
};


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${comicNeue.variable}`}>
      <body>
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
