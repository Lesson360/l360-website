'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useChildProfile } from '@/lib/context/ChildProfileContext';
import { libraryApi, libraryErrorMessage } from '@/lib/api/library';

// pdf.js needs the browser (canvas + worker); keep it out of the server bundle.
const PdfViewer = dynamic(() => import('@/components/library/PdfViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#FF4801]" />
        </div>
    ),
});

type Status =
    | { kind: 'loading' }
    | { kind: 'ready'; url: string; title: string }
    | { kind: 'locked'; message: string }
    | { kind: 'missing' }
    | { kind: 'error'; message: string };

export default function ReadBookPage({ params }: { params: { bookId: string } }) {
    const { bookId } = params;
    const { activeChild, isLoading: childLoading } = useChildProfile();
    const childId = activeChild?.id || activeChild?._id || '';
    const [status, setStatus] = useState<Status>({ kind: 'loading' });
    const retried = useRef(false);

    // Signed URLs last ~5 minutes, so always ask for a fresh one when opening the book.
    const openBook = useCallback(async () => {
        if (!childId) return;
        setStatus({ kind: 'loading' });
        try {
            const res = await libraryApi.read(childId, bookId);
            if (!res?.read?.url) throw new Error('missing read url');
            setStatus({ kind: 'ready', url: res.read.url, title: res.item?.title || 'Book' });
        } catch (err: any) {
            const code = err?.response?.status;
            if (code === 403) setStatus({ kind: 'locked', message: libraryErrorMessage(err, 'This book is locked for this child.') });
            else if (code === 404) setStatus({ kind: 'missing' });
            else setStatus({ kind: 'error', message: libraryErrorMessage(err, 'Could not open this book. Please try again.') });
        }
    }, [childId, bookId]);

    useEffect(() => {
        retried.current = false;
        if (childId) openBook();
        else if (!childLoading) setStatus({ kind: 'error', message: 'Select a child to read this book.' });
    }, [childId, childLoading, openBook]);

    // If the PDF fails to load (e.g. the link expired before it was fetched), get a new link once.
    const handleLoadError = useCallback(() => {
        if (retried.current) {
            setStatus({ kind: 'error', message: 'This book couldn’t be opened. Please try again.' });
            return;
        }
        retried.current = true;
        openBook();
    }, [openBook]);

    const back = (
        <Link href="/dashboard/library" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-[#FF4801]">
            <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
    );

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {back}
                {status.kind === 'ready' && (
                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{status.title}</h1>
                )}
            </div>

            {status.kind === 'loading' && (
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-500">
                    <Loader2 className="h-7 w-7 animate-spin text-[#FF4801]" />
                    Getting your book ready…
                </div>
            )}

            {status.kind === 'ready' && <PdfViewer url={status.url} onLoadError={handleLoadError} />}

            {status.kind === 'locked' && (
                <div className="py-12 px-6 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-bold text-gray-700">{status.message}</p>
                    <Link href="/dashboard/library" className="inline-block rounded-xl bg-[#FF4801] px-4 py-2.5 text-sm font-black text-white hover:bg-[#E03F00]">
                        See how to unlock it
                    </Link>
                </div>
            )}

            {status.kind === 'missing' && (
                <div className="py-12 px-6 bg-white rounded-2xl border border-gray-200 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-bold text-gray-700">Book unavailable — it may have been removed from the library.</p>
                    {back}
                </div>
            )}

            {status.kind === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{status.message}</span>
                    {childId && (
                        <button type="button" onClick={() => { retried.current = false; openBook(); }} className="ml-auto text-xs font-black underline cursor-pointer">
                            Retry
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
