import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="max-w-2xl mx-auto px-6 text-center pb-20">
      <h2 className="font-serif text-4xl mb-6 text-stone-900">
        Ready to tell your story?
      </h2>
      <p className="text-stone-600 mb-8 text-lg">
        Join thousands of writers who have found their home on Serif.
      </p>
      <Link href="/auth/sign-up">
        <Button
          size="lg"
          className="h-14 px-10 rounded-full text-lg bg-stone-900 text-stone-50 hover:bg-stone-800"
        >
          Create your account
        </Button>
      </Link>
    </section>
  );
}
