import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fdf6dd] to-[#fbeeb0] px-4 py-12">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 text-center shadow-xl sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-orange">
          Temporarily Unavailable
        </p>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Login is disabled for now
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We are still preparing public account access. For updates and launch
          announcements, follow Lesson360 on Instagram.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://www.instagram.com/lesson_360/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-brand-orange px-8 py-3 font-semibold text-white hover:bg-brand-orange-deep"
          >
            Open Instagram
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-brand-orange px-8 py-3 font-semibold text-gray-900 hover:bg-brand-orange/5"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
