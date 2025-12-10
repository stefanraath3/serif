import { AboutNav } from "@/components/about/about-nav";
import { ManifestoContent } from "@/components/about/manifesto-content";

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-200 font-sans">
      <AboutNav />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="font-serif text-5xl md:text-7xl mb-12 text-stone-900">
          The Manifesto.
        </h1>

        <ManifestoContent />
      </main>
    </div>
  );
}
