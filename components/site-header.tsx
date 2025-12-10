import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-stone-100 bg-stone-50/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="Serif Logo"
            width={48}
            height={48}
            className="group-hover:opacity-80 transition-opacity"
          />
          <span className="font-serif text-2xl font-bold tracking-tight group-hover:opacity-80 transition-opacity">
            Serif.
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Sign In
          </Link>
          <Link href="/auth/sign-up">
            <Button className="bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
