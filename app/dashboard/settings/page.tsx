"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/auth/login");
        return;
      }

      setEmail(authData.user.email || "");

      // For now, use mock data. Later replace with actual Supabase query:
      // const { data: profile, error: fetchError } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', authData.user.id)
      //   .single()
      //
      // if (fetchError && fetchError.code !== 'PGRST116') {
      //   setError('Failed to load profile')
      //   setIsLoading(false)
      //   return
      // }
      //
      // if (profile) {
      //   setFirstName(profile.first_name || '')
      //   setAvatarUrl(profile.avatar_url || '')
      // }

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

    // For now, just show success. Later replace with actual Supabase update:
    // const { error: updateError } = await supabase
    //   .from('profiles')
    //   .update({
    //     first_name: firstName || null,
    //     avatar_url: avatarUrl || null,
    //   })
    //   .eq('id', authData.user.id)
    //
    // if (updateError) {
    //   setError(updateError.message)
    //   setIsSubmitting(false)
    //   return
    // }

    setSuccess(true);
    setIsSubmitting(false);
    router.refresh();
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
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarUrl || undefined}
                  alt={firstName || email}
                />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  type="url"
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL to your avatar image
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled className="bg-muted" />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed from here
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                Profile updated successfully!
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
