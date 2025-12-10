import Link from "next/link";
import { Mail } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-svh bg-stone-50 text-stone-900 selection:bg-stone-200">
      <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <span className="font-serif text-2xl font-medium tracking-tight">
                Serif
              </span>
            </Link>

            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-stone-100 p-4">
                <Mail className="h-8 w-8 text-stone-600" />
              </div>
            </div>

            <h1 className="font-serif text-4xl font-medium tracking-tight mb-3">
              Check your email
            </h1>
            <p className="text-stone-600 mb-8">
              We&apos;ve sent you a confirmation link. Please check your inbox
              to verify your account.
            </p>

            <p className="text-sm text-stone-500">
              Didn&apos;t receive an email?{" "}
              <Link
                href="/auth/sign-up"
                className="text-stone-900 font-medium hover:underline underline-offset-4"
              >
                Try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
