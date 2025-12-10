import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 text-center mb-32">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="w-2 h-2 rounded-full bg-stone-400"></span>
        <span className="text-xs font-medium text-stone-600 uppercase tracking-wide">
          The new standard for writing
        </span>
      </div>

      <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tight leading-[1.1] mb-8 text-stone-900 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
        Writing, <span className="italic text-stone-500">clarified.</span>
      </h1>

      <p className="text-xl md:text-2xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
        Serif is a sanctuary for your thoughts. minimal, distraction-free, and
        designed for the purity of the written word.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
        <Link href="/auth/sign-up">
          <Button
            size="lg"
            className="h-12 px-8 rounded-full text-base bg-stone-900 text-stone-50 hover:bg-stone-800"
          >
            Start Writing
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        <Link href="/about">
          <Button
            variant="ghost"
            size="lg"
            className="h-12 px-8 rounded-full text-base text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            Our Manifesto
          </Button>
        </Link>
      </div>
    </section>
  );
}
