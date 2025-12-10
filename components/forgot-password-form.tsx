"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-stone-100 p-4">
              <Mail className="h-8 w-8 text-stone-600" />
            </div>
          </div>
          <h2 className="font-serif text-2xl font-medium tracking-tight mb-3">
            Check your email
          </h2>
          <p className="text-stone-600 mb-6">
            If an account exists with that email, we&apos;ve sent password reset
            instructions.
          </p>
          <Link
            href="/auth/login"
            className="text-stone-900 font-medium hover:underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleForgotPassword}>
        <div className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-stone-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg border-stone-200 bg-white placeholder:text-stone-400 focus-visible:ring-stone-400"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full h-11 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </div>
        <div className="mt-6 text-center text-sm text-stone-600">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-stone-900 font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
