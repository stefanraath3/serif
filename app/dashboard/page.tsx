import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;
  const email = authData?.claims?.email as string | null;

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // Fetch recent posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  const recentPosts = posts || [];
  const firstName = profile?.first_name || "Writer";

  return (
    <div className="flex flex-1 flex-col gap-12 max-w-2xl mx-auto w-full pt-12 animate-in fade-in duration-700">
      {/* 1. The Greeting & Quick Capture */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground/90">
            Good morning, {firstName}.
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            What is on your mind today?
          </p>
        </div>

        {/* Quick Capture Input - Acts as a button to new post */}
        <Link href="/dashboard/blogs/new" className="block group">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Plus className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
            </div>
            <div className="h-14 w-full rounded-xl border border-stone-200 bg-white pl-12 pr-4 flex items-center text-muted-foreground/60 shadow-sm transition-all group-hover:border-stone-300 group-hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50">
              <span className="font-serif italic text-lg">
                Start a new story...
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* 2. Recent Work - The Desk Surface */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Recent Work
          </h2>
          <Link
            href="/dashboard/blogs"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
          >
            View all{" "}
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-3">
          {recentPosts.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
              <p className="text-muted-foreground font-light">
                Your desk is clear.
              </p>
            </div>
          ) : (
            recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/dashboard/blogs/${post.id}`}
                className="group block p-5 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all dark:bg-stone-900/40 dark:border-stone-800 dark:hover:border-stone-700"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-xl font-medium text-foreground/90 group-hover:text-primary transition-colors">
                      {post.title || "Untitled Draft"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 font-light">
                      {post.summary || "No summary..."}
                    </p>
                  </div>

                  {post.status === "published" && (
                    <div
                      className="h-2 w-2 rounded-full bg-green-500/50 mt-2"
                      title="Published"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground/60 font-mono">
                  <span>
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {post.read_time && <span>• {post.read_time} min read</span>}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
