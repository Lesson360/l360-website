import type { Metadata } from 'next';
import { ReactNode } from 'react'
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
