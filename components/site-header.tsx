"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-stone-100 bg-stone-50/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
        {/* Left: Logo */}
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

        {/* Center: Navigation Links - Hidden on mobile */}
        <div className="flex-1 hidden md:flex items-center justify-center gap-8">
          <Link
            href="/#pricing"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Manifesto
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Blog
          </Link>
        </div>

        {/* Right: Auth Buttons - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Mobile Menu Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <button
              className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
            <SheetHeader className="px-8 pt-8 pb-4">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-8 pb-8">
              <Link
                href="/#pricing"
                onClick={() => setOpen(false)}
                className="text-base font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="text-base font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Manifesto
              </Link>
              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="text-base font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Blog
              </Link>
              <div className="pt-4 border-t border-stone-200 flex flex-col gap-4">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
