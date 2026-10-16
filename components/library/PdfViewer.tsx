'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, Maximize2 } from 'lucide-react';

// Served from /public rather than bundled: Next 14's production minifier can't
// process pdf.js's ES-module worker. The filename carries the version, so after
// upgrading react-pdf/pdfjs-dist, copy the matching worker:
//   cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdfjs/pdf.worker-<version>.min.mjs
pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/pdf.worker-${pdfjs.version}.min.mjs`;

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.25, 1.5, 1.75, 2];

interface PdfViewerProps {
    /** Short-lived signed URL. Loaded once, in full, so it can't expire mid-read. */
    url: string;
    onLoadError: (err: Error) => void;
}

/**
 * Read-only PDF reader: one page at a time, fitted to the available width,
 * with page navigation and zoom. No download button or selectable text layer.
 */
export default function PdfViewer({ url, onLoadError }: PdfViewerProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(1);
    const [pageInput, setPageInput] = useState('1');
    const [zoom, setZoom] = useState(1);
    const [progress, setProgress] = useState<number | null>(null);

    // Fetch the whole file in one request (no range/stream requests that would
    // fail once the signed URL expires).
    const file = useMemo(() => ({ url }), [url]);
    const options = useMemo(() => ({ disableRange: true, disableStream: true, disableAutoFetch: true }), []);

    useEffect(() => {
        const el = frameRef.current;
        if (!el) return;
        setWidth(el.clientWidth); // don't wait for the first observer callback
        const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const goTo = useCallback((n: number) => {
        const next = Math.min(Math.max(1, n), numPages || 1);
        setPage(next);
        setPageInput(String(next));
        frameRef.current?.scrollTo({ top: 0 });
    }, [numPages]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
            if (e.key === 'ArrowRight') goTo(page + 1);
            if (e.key === 'ArrowLeft') goTo(page - 1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [goTo, page]);

    const zoomIdx = ZOOM_STEPS.indexOf(zoom);
    const pageWidth = width ? Math.max(200, Math.floor((width - 16) * zoom)) : undefined;
    const btn = 'inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default';

    return (
        <div className="flex flex-col gap-3">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white/95 px-2 py-1.5 shadow-xs backdrop-blur">
                <div className="flex items-center gap-1">
                    <button type="button" className={btn} onClick={() => goTo(page - 1)} disabled={page <= 1} aria-label="Previous page">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <form
                        onSubmit={e => { e.preventDefault(); goTo(parseInt(pageInput, 10) || page); }}
                        className="flex items-center gap-1.5 text-sm font-bold text-gray-700"
                    >
                        <label htmlFor="pdf-page" className="sr-only">Page number</label>
                        <input
                            id="pdf-page"
                            inputMode="numeric"
                            value={pageInput}
                            onChange={e => setPageInput(e.target.value.replace(/\D/g, ''))}
                            onBlur={() => goTo(parseInt(pageInput, 10) || page)}
                            className="h-9 w-12 rounded-lg border border-gray-200 text-center outline-none focus:border-orange-400"
                        />
                        <span className="text-gray-400">/ {numPages || '–'}</span>
                    </form>
                    <button type="button" className={btn} onClick={() => goTo(page + 1)} disabled={!numPages || page >= numPages} aria-label="Next page">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" className={btn} onClick={() => setZoom(ZOOM_STEPS[Math.max(0, zoomIdx - 1)])} disabled={zoomIdx <= 0} aria-label="Zoom out">
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-xs font-bold text-gray-600">{Math.round(zoom * 100)}%</span>
                    <button type="button" className={btn} onClick={() => setZoom(ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, zoomIdx + 1)])} disabled={zoomIdx >= ZOOM_STEPS.length - 1} aria-label="Zoom in">
                        <Plus className="h-4 w-4" />
                    </button>
                    <button type="button" className={btn} onClick={() => setZoom(1)} disabled={zoom === 1} aria-label="Fit to width">
                        <Maximize2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Page */}
            <div
                ref={frameRef}
                onContextMenu={e => e.preventDefault()}
                className="min-h-[60vh] overflow-auto rounded-2xl border border-gray-200 bg-gray-100 p-2"
            >
                <Document
                    file={file}
                    options={options}
                    onLoadProgress={({ loaded, total }) => total && setProgress(Math.round((loaded / total) * 100))}
                    onLoadSuccess={({ numPages: n }) => { setNumPages(n); setProgress(null); }}
                    onLoadError={onLoadError}
                    loading={
                        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm font-bold text-gray-500">
                            <Loader2 className="h-7 w-7 animate-spin text-[#FF4801]" />
                            <span>Opening book{progress != null ? `… ${progress}%` : '…'}</span>
                            {progress != null && (
                                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200">
                                    <div className="h-full rounded-full bg-[#FF4801] transition-[width]" style={{ width: `${progress}%` }} />
                                </div>
                            )}
                        </div>
                    }
                    error={<div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-gray-500">This book couldn’t be opened.</div>}
                    className="flex justify-center"
                >
                    {pageWidth && (
                        <Page
                            key={page}
                            pageNumber={page}
                            width={pageWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="overflow-hidden rounded-lg bg-white shadow-md"
                            loading={<div className="min-h-[60vh]" style={{ width: pageWidth }} />}
                        />
                    )}
                </Document>
            </div>

            {numPages > 1 && (
                <div className="flex items-center justify-between gap-3">
                    <button type="button" onClick={() => goTo(page - 1)} disabled={page <= 1}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-default">
                        ← Previous
                    </button>
                    <span className="text-xs font-bold text-gray-500">Page {page} of {numPages}</span>
                    <button type="button" onClick={() => goTo(page + 1)} disabled={page >= numPages}
                        className="rounded-xl bg-[#FF4801] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#E03F00] disabled:opacity-40 cursor-pointer disabled:cursor-default">
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
