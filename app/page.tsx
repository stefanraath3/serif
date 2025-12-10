import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-200">
      <SiteHeader />
      <main className="pt-32 pb-16">
        <HeroSection />
        <FeaturesSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
