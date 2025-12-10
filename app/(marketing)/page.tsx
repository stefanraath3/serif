import Link from "next/link";
import { ArrowRight, Feather, Type, Zap, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-stone-50 overflow-x-hidden">
      {/* 
        HERO SECTION
        - Massive Scale
        - Swiss/International Style Layout
      */}
      <section className="relative min-h-screen flex flex-col pt-32 px-6 md:px-12 border-b border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full flex-1">
          {/* Left Column - The Brand */}
          <div className="md:col-span-8 flex flex-col justify-between pb-12">
            <h1 className="font-serif text-[18vw] leading-[0.8] tracking-tighter text-stone-900 -ml-2 md:-ml-4 animate-in slide-in-from-bottom-20 fade-in duration-1000">
              Serif.
            </h1>
            <div className="max-w-2xl mt-12 md:mt-0">
              <p className="text-xl md:text-3xl leading-snug text-stone-800 font-serif animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
                A digital sanctuary for the written word. <br />
                <span className="text-stone-400 italic">
                  Designed for the purist.
                </span>
              </p>
            </div>
          </div>

          {/* Right Column - Technical Details & CTA */}
          <div className="md:col-span-4 flex flex-col justify-between pb-12 md:items-end md:text-right">
            <div className="hidden md:block space-y-2 font-mono text-xs uppercase tracking-widest text-stone-400 animate-in slide-in-from-right-10 fade-in duration-1000 delay-300">
              <p>Est. 2025</p>
              <p>San Francisco, CA</p>
              <p>Ver. 1.0.0</p>
            </div>

            <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500">
              <p className="text-sm text-stone-500 max-w-xs md:ml-auto">
                Join 10,000+ writers reclaiming their focus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link
                  href="/auth/sign-up"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-stone-50 text-lg overflow-hidden transition-all hover:bg-stone-800"
                >
                  <span className="relative z-10 flex items-center">
                    Start Writing
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Scroll Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-stone-200">
          <div className="absolute top-0 left-0 h-full w-32 bg-stone-900 animate-pulse" />
        </div>
      </section>

      {/* 
        FEATURE SHOWCASE
        - Editorial Layout
        - Sticky headers
      */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Feature 01 */}
          <div className="min-h-[80vh] border-b md:border-b-0 md:border-r border-stone-200 p-8 md:p-16 flex flex-col justify-between group hover:bg-stone-100 transition-colors duration-700">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
                (001) Typography
              </span>
              <Type className="w-12 h-12 text-stone-300 group-hover:text-stone-900 transition-colors duration-500" />
            </div>
            <div className="space-y-6 mt-12">
              <h2 className="font-serif text-5xl md:text-6xl text-stone-900">
                Type as <br /> <span className="italic">Texture</span>.
              </h2>
              <p className="text-lg text-stone-600 max-w-md">
                Every pixel is optimized for reading. We use classic typographic
                principles to ensure your words look beautiful on any device.
              </p>
            </div>
          </div>

          {/* Feature 02 */}
          <div className="min-h-[80vh] border-b border-stone-200 p-8 md:p-16 flex flex-col justify-between group hover:bg-stone-100 transition-colors duration-700">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
                (002) Focus
              </span>
              <Feather className="w-12 h-12 text-stone-300 group-hover:text-stone-900 transition-colors duration-500" />
            </div>
            <div className="space-y-6 mt-12">
              <h2 className="font-serif text-5xl md:text-6xl text-stone-900">
                Radical <br /> <span className="italic">Simplicity</span>.
              </h2>
              <p className="text-lg text-stone-600 max-w-md">
                No sidebars, no ads, no clutter. Just you and the cursor. A pure
                environment that respects your attention.
              </p>
            </div>
          </div>

          {/* Feature 03 */}
          <div className="min-h-[80vh] md:border-r border-stone-200 p-8 md:p-16 flex flex-col justify-between group hover:bg-stone-100 transition-colors duration-700">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
                (003) Speed
              </span>
              <Zap className="w-12 h-12 text-stone-300 group-hover:text-stone-900 transition-colors duration-500" />
            </div>
            <div className="space-y-6 mt-12">
              <h2 className="font-serif text-5xl md:text-6xl text-stone-900">
                Thought <br /> <span className="italic">Velocity</span>.
              </h2>
              <p className="text-lg text-stone-600 max-w-md">
                Share your thoughts with the world in a single click. Fast,
                SEO-optimized, and ready for your audience.
              </p>
            </div>
          </div>

          {/* CTA Block */}
          <div className="min-h-[80vh] p-8 md:p-16 flex flex-col justify-center items-center text-center bg-stone-900 text-stone-50">
            <Star className="w-16 h-16 mb-8 text-stone-700 animate-spin-slow" />
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
              Begin your <br />
              <span className="italic text-stone-500">masterpiece.</span>
            </h2>
            <Link
              href="/auth/sign-up"
              className="inline-block border-b-2 border-stone-50 pb-1 text-2xl hover:text-stone-400 hover:border-stone-400 transition-all"
            >
              Start Writing Now &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 
        TESTIMONIAL SCROLL
        - Horizontal ticker style (simplified for CSS)
      */}
      <section className="py-24 border-t border-stone-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center px-6">
          <p className="font-serif text-3xl md:text-5xl text-stone-400 max-w-4xl mx-auto leading-tight">
            "Serif isn&apos;t just a tool; it&apos;s a state of mind. It forced
            me to write better, clearer, and more honestly."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden">
              {/* Avatar placeholder */}
              <div className="w-full h-full bg-stone-300" />
            </div>
            <div className="text-left">
              <p className="font-medium text-stone-900">Elena R.</p>
              <p className="text-sm text-stone-500">Editor in Chief</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
