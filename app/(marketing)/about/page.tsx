import { ManifestoContent } from "@/components/about/manifesto-content";

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-stone-50">
      <main className="w-full">
        <ManifestoContent />
      </main>
    </div>
  );
}
