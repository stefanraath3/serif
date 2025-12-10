import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-svh bg-stone-50 text-stone-900 selection:bg-stone-200">
      <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block mb-8">
              <span className="font-serif text-2xl font-medium tracking-tight">
                Serif
              </span>
            </Link>
            <h1 className="font-serif text-4xl font-medium tracking-tight mb-3">
              Welcome back
            </h1>
            <p className="text-stone-600">Sign in to continue writing</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
