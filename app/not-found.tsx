import Link from 'next/link';
import { Compass, Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans px-4">
            <div className="w-full max-w-lg text-center bg-white rounded-3xl border border-gray-100 shadow-md p-8 sm:p-12 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-brand-peach text-brand-orange-deep flex items-center justify-center">
                    <Compass className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-extrabold text-brand-orange-deep uppercase tracking-wider">
                        Error 404
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        Lost In Class?
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">
                        We couldn&apos;t find the page you&apos;re looking for. It may have been moved, renamed, or never existed.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-extrabold text-xs shadow-xs hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span>Go To Homepage</span>
                    </Link>

                    <Link
                        href="/dashboard/video-library"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-xs shadow-md transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Go To Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
