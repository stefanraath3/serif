import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-100 py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-stone-500 text-sm">
          © 2024 Serif Inc. All rights reserved.
        </p>
        <div className="flex gap-8">
          <Link
            href="#"
            className="text-stone-500 hover:text-stone-900 text-sm transition-colors"
          >
            Twitter
          </Link>
          <Link
            href="#"
            className="text-stone-500 hover:text-stone-900 text-sm transition-colors"
          >
            Instagram
          </Link>
          <Link
            href="#"
            className="text-stone-500 hover:text-stone-900 text-sm transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
