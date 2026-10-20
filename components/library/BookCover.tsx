'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import type { LibraryBook } from '@/lib/api/library';

const FALLBACK_COLORS = ['#5B7BEA', '#EC6FA0', '#F5B935', '#3FB57A', '#8A63E0', '#FF8A3D', '#2FAFAA'];

/** Displayable cover URL, preferring the signed URL because the storage bucket is private. */
function getCoverSrc(book: LibraryBook) {
    return book.coverAccessUrl || book.cover?.accessUrl || book.coverUrl || book.cover?.url || '';
}

/** Book cover image, or a coloured placeholder with the title when there's no cover or it fails to load. */
export function BookCover({ book, className = '' }: { book: LibraryBook; className?: string }) {
    const src = getCoverSrc(book);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    if (src && failedSrc !== src) {
        return (
            // Covers come from the API's storage host, so a plain <img> avoids
            // hard-coding that host into next.config image domains.
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt=""
                loading="lazy"
                onError={() => setFailedSrc(src)}
                className={`h-full w-full object-cover ${className}`}
            />
        );
    }
    const color = FALLBACK_COLORS[(book.title.charCodeAt(0) || 0) % FALLBACK_COLORS.length];
    return (
        <div className={`relative flex h-full w-full flex-col justify-between overflow-hidden p-3 text-white ${className}`} style={{ backgroundColor: color }}>
            <div className="absolute inset-y-0 left-0 w-2.5 bg-black/15" aria-hidden="true" />
            <BookOpen className="ml-1.5 h-5 w-5 opacity-80" aria-hidden="true" />
            <span className="ml-1.5 line-clamp-4 text-sm font-extrabold leading-tight">{book.title}</span>
        </div>
    );
}
