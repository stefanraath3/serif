import { SignUpForm } from "@/components/sign-up-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-svh bg-white text-stone-900 selection:bg-stone-200">
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left side - Form */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="inline-block mb-12">
              <span className="font-serif text-2xl font-medium tracking-tight">
                Serif
              </span>
            </Link>

            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-2">
              Start writing
            </h1>
            <p className="text-stone-500 mb-8">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-stone-900 font-medium hover:underline underline-offset-4"
              >
                Log in →
              </Link>
            </p>

            <SignUpForm />
          </div>
        </div>

        {/* Right side - Image/Decorative */}
        <div className="hidden lg:block relative bg-stone-100">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-full max-w-lg">
              {/* Decorative quote card */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-stone-200/50 p-8 md:p-10">
                <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-stone-800 mb-6">
                  "Writing is the painting of the voice."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-200" />
                  <div>
                    <p className="font-medium text-stone-900">Voltaire</p>
                    <p className="text-sm text-stone-500">
                      Philosopher & Writer
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-stone-200/50 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-stone-300/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
