export function TestimonialSection() {
  return (
    <section className="bg-stone-900 text-stone-50 py-32 mb-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
          "The most elegant writing experience I've ever encountered. It feels
          like a breath of fresh air."
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-stone-700"></div>
          <div className="text-left">
            <p className="font-medium text-lg">Elena Rostova</p>
            <p className="text-stone-400">Editor in Chief, The Minimalist</p>
          </div>
        </div>
      </div>
    </section>
  );
}
