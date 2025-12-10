import { Feather, Type, Zap } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Type,
      title: "Typography First",
      desc: "Every pixel is optimized for reading. We use classic typographic principles to ensure your words look beautiful on any device.",
    },
    {
      icon: Feather,
      title: "Distraction Free",
      desc: "No sidebars, no ads, no clutter. Just you and the cursor. A pure environment that respects your attention.",
    },
    {
      icon: Zap,
      title: "Instant Publishing",
      desc: "Share your thoughts with the world in a single click. Fast, SEO-optimized, and ready for your audience.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 mb-32">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {features.map((feature, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <feature.icon
              className="w-8 h-8 text-stone-800 mb-6"
              strokeWidth={1.5}
            />
            <h3 className="font-serif text-2xl font-medium mb-3 text-stone-900">
              {feature.title}
            </h3>
            <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
