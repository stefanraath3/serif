import { ArrowDownRight } from "lucide-react";

export function ManifestoContent() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-between px-6 md:px-12 py-12 border-b border-stone-200">
        <div className="w-full border-b border-stone-200 pb-6 mb-auto pt-24">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500">
            001 — The Mission
          </span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter text-stone-900 max-w-7xl animate-in slide-in-from-bottom-10 fade-in duration-1000">
          The internet <br />
          <span className="italic text-stone-400">has become</span> <br />
          noisy.
        </h1>

        <div className="flex justify-end mt-12">
          <div className="max-w-md">
            <p className="text-lg md:text-xl leading-relaxed text-stone-600 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300">
              Algorithms dictate what we read. Ads clutter our thoughts. We are
              here to reclaim the silence.
            </p>
          </div>
        </div>
      </section>

      {/* The Pivot */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-stone-200">
        <div className="col-span-1 md:col-span-4 p-6 md:p-12 border-b md:border-b-0 md:border-r border-stone-200">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500 sticky top-24">
            002 — Origin
          </span>
        </div>
        <div className="col-span-1 md:col-span-8 p-6 md:p-12 md:py-32">
          <p className="font-serif text-4xl md:text-6xl leading-tight text-stone-900">
            Serif was born from a desire to return to the essence of the web:{" "}
            <span className="block mt-4 text-stone-400 italic">
              connection through words.
            </span>
          </p>
        </div>
      </section>

      {/* The Principles - Grid Layout */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-stone-200">
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-stone-200 min-h-[400px] flex flex-col justify-between group hover:bg-stone-100 transition-colors duration-500">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
            Principle I
          </span>
          <div>
            <h3 className="font-serif text-3xl mb-4">Clarity over Clicks</h3>
            <p className="text-stone-600">
              We optimize for the reading experience, not the retention metric.
              Respect for the reader&apos;s attention is our currency.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-stone-200 min-h-[400px] flex flex-col justify-between group hover:bg-stone-100 transition-colors duration-500">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
            Principle II
          </span>
          <div>
            <h3 className="font-serif text-3xl mb-4">Design as Kindness</h3>
            <p className="text-stone-600">
              Good typography is an act of service. Legibility is the baseline;
              elegance is the goal.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-between group hover:bg-stone-100 transition-colors duration-500">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">
            Principle III
          </span>
          <div>
            <h3 className="font-serif text-3xl mb-4">Slow Thoughts</h3>
            <p className="text-stone-600">
              A sanctuary for deep thinking in a fast world. We build tools for
              the patient.
            </p>
          </div>
        </div>
      </section>

      {/* The Footer / Sign-off */}
      <section className="px-6 md:px-12 py-32 md:py-48 bg-stone-900 text-stone-50">
        <div className="max-w-4xl">
          <ArrowDownRight className="w-12 h-12 mb-8 text-stone-400" />
          <p className="font-serif text-5xl md:text-8xl leading-none tracking-tight">
            This is Serif. <br />
            <span className="text-stone-500 italic">Welcome home.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
