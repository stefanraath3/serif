"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar } from "@/lib/upload";
import { Loader2, Upload } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/auth/login");
        return;
      }

      setEmail(authData.user.email || "");

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        setError("Failed to load profile");
        setIsLoading(false);
        return;
      }

      if (profile) {
        setFirstName(profile.first_name || "");
        setAvatarUrl(profile.avatar_url || "");
      }

      setIsLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setError("You must be logged in to update your profile");
      setIsSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName || null,
        avatar_url: avatarUrl || null,
      })
      .eq("id", authData.user.id);

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setIsSubmitting(false);
    router.refresh();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setIsUploadingAvatar(true);
    setError(null);
    const result = await uploadAvatar(file);
    setIsUploadingAvatar(false);

    if (result.success) {
      setAvatarUrl(result.url);
    } else {
      setError(result.error);
    }
  };

  const initials = firstName
    ? firstName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email.split("@")[0].slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full pt-12 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-3xl font-serif font-medium tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 font-light text-lg">
          Manage your profile and account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Profile Section */}
        <section className="space-y-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-b pb-2">
            Profile
          </h2>

          <div className="flex items-start gap-8">
            <div
              className="relative group cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-transparent group-hover:ring-stone-200 transition-all dark:group-hover:ring-stone-800">
                <AvatarImage
                  src={avatarUrl || undefined}
                  alt={firstName || email}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl bg-stone-100 dark:bg-stone-800">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploadingAvatar ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your name"
                  className="max-w-sm bg-transparent border-stone-200 focus:border-stone-400 dark:border-stone-800 dark:focus:border-stone-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="max-w-sm bg-stone-50/50 text-muted-foreground border-transparent dark:bg-stone-900/50"
                />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/10 dark:text-green-400">
            Profile updated successfully.
          </div>
        )}

        <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full px-8"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
