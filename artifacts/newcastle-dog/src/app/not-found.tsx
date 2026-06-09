import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🐾</div>
        <h1 className="text-4xl font-bold text-charcoal mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like this page has gone walkies. Let&apos;s get you back on the right trail.
        </p>
        <Link href="/" className="btn-primary px-8 py-3 rounded-xl text-base">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
