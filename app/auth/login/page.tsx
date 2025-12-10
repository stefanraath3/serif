import { LoginForm } from "@/components/login-form";
import Image from "next/image";
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
              Welcome back
            </h1>
            <p className="text-stone-500 mb-8">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-stone-900 font-medium hover:underline underline-offset-4"
              >
                Sign up →
              </Link>
            </p>

            <LoginForm />
          </div>
        </div>

        {/* Right side - Image/Decorative */}
        <div className="hidden lg:block relative bg-stone-100">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-full max-w-lg">
              {/* Decorative quote card */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-stone-200/50 p-8 md:p-10">
                <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-stone-800 mb-6">
                  "There is nothing to writing. All you do is sit down at a
                  typewriter and bleed."
                </blockquote>
                <div className="flex items-center gap-4">
                  <Image
                    src="/auth-images/hemingway.jpg"
                    alt="Ernest Hemingway"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-stone-900">
                      Ernest Hemingway
                    </p>
                    <p className="text-sm text-stone-500">
                      Author & Journalist
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
