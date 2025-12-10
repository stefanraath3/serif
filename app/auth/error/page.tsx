import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  const errorMessages: Record<string, string> = {
    auth_callback_error: "Authentication failed. Please try again.",
    default: "An unexpected error occurred.",
  };
  const displayError =
    params?.error && errorMessages[params.error]
      ? errorMessages[params.error]
      : errorMessages.default;

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
              <div className="rounded-full bg-red-50 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <h1 className="font-serif text-4xl font-medium tracking-tight mb-3">
              Something went wrong
            </h1>
            <p className="text-stone-600 mb-2">
              We couldn&apos;t complete your request.
            </p>
            <p className="text-sm text-stone-500 mb-8">{displayError}</p>

            <Link href="/auth/login">
              <Button className="h-11 px-8 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
