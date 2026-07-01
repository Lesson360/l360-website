import type { Metadata } from 'next';
import { ReactNode } from 'react'
import './globals.css';

export const metadata: Metadata = {
  title: 'Lesson360 - Turn Screen Time Into Learning Time',
  description: 'Educational platform for African families and learners. Structured learning by level/class with assessments and support.',
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