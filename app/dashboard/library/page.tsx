'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookOpen, Search } from 'lucide-react';
import { useChildProfile } from '@/lib/context/ChildProfileContext';
import { LibraryAccessType, LibraryBook, libraryApi, libraryErrorMessage } from '@/lib/api/library';
import { BookCover } from '@/components/library/BookCover';
import { BookBadge, BookDetailsModal } from '@/components/library/BookDetailsModal';

type Filter = 'all' | LibraryAccessType;

const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All books' },
    { key: 'free', label: 'Free' },
    { key: 'subscriber', label: 'Subscription' },
    { key: 'paid', label: 'Paid' },
];

export default function DigitalLibraryPage() {
    const { activeChild } = useChildProfile();
    const childId = activeChild?.id || activeChild?._id || '';
    const childName = activeChild?.name || activeChild?.childName;

    const [books, setBooks] = useState<LibraryBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notice, setNotice] = useState('');
    const [filter, setFilter] = useState<Filter>('all');
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<LibraryBook | null>(null);

    const loadBooks = useCallback(async (showSpinner: boolean) => {
        if (!childId) return;
        if (showSpinner) setIsLoading(true);
        setErrorMessage('');
        try {
            const { items } = await libraryApi.listBooks(childId);
            // The API shouldn't return these, but never show another class's book as available.
            setBooks(items.filter(b => b.access?.reason !== 'not_for_child_class'));
        } catch (err: any) {
            setErrorMessage(libraryErrorMessage(err, 'Could not load the library. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    }, [childId]);

    // Reload (and drop the previous child's books) whenever the selected child changes.
    useEffect(() => {
        setBooks([]);
        setSelected(null);
        if (childId) loadBooks(true);
        else setIsLoading(false);
    }, [childId, loadBooks]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return books.filter(b =>
            (filter === 'all' || b.accessType === filter) &&
            (!q || b.title.toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q)));
    }, [books, filter, query]);

    const counts = useMemo(() => {
        const c: Record<Filter, number> = { all: books.length, free: 0, subscriber: 0, paid: 0 };
        books.forEach(b => { c[b.accessType] = (c[b.accessType] || 0) + 1; });
        return c;
    }, [books]);

    const handleStale = (message: string) => {
        setSelected(null);
        setNotice(message);
        loadBooks(false);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FF4801] tracking-tight">Digital Library</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Storybooks, textbooks and revision guides{childName ? ` for ${childName}` : ''}.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full items-center gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xs sm:w-fit">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => setFilter(f.key)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === f.key ? 'bg-[#FF4801] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {f.label} ({counts[f.key] || 0})
                        </button>
                    ))}
                </div>
                <label className="relative block w-full sm:w-72">
                    <span className="sr-only">Search books</span>
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by title or author"
                        className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                </label>
            </div>

            {notice && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{notice}</span>
                    <button type="button" onClick={() => setNotice('')} className="ml-auto text-xs font-black underline cursor-pointer">Dismiss</button>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                    <button type="button" onClick={() => loadBooks(true)} className="ml-auto text-xs font-black underline cursor-pointer">Retry</button>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-2.5 animate-pulse">
                            <div className="aspect-[3/4] rounded-2xl bg-gray-200" />
                            <div className="h-4 w-3/4 rounded-full bg-gray-200" />
                            <div className="h-3 w-1/2 rounded-full bg-gray-100" />
                        </div>
                    ))}
                </div>
            ) : !childId ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center text-sm font-bold text-gray-600">
                    Add or select a child to see their library.
                </div>
            ) : visible.length === 0 && !errorMessage ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center space-y-2">
                    <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-bold text-gray-700">
                        {books.length === 0 ? 'No books in the library yet — check back soon.' : 'No books match your search.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                    {visible.map(book => (
                        <button
                            key={book.id}
                            type="button"
                            onClick={() => { setNotice(''); setSelected(book); }}
                            className="group flex flex-col gap-2.5 text-left cursor-pointer focus:outline-none"
                        >
                            <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-orange-300 transition-all group-hover:-translate-y-1 group-hover:shadow-md group-focus-visible:ring-4">
                                <BookCover book={book} />
                            </div>
                            <div className="space-y-1.5 px-0.5">
                                <BookBadge book={book} />
                                <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-gray-900">{book.title}</h3>
                                {book.author && <p className="truncate text-xs font-semibold text-gray-500">{book.author}</p>}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <BookDetailsModal
                    book={selected}
                    childId={childId}
                    childName={childName}
                    onClose={() => setSelected(null)}
                    onStale={handleStale}
                />
            )}
        </div>
    );
}
