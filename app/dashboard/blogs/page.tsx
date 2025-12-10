import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeletePostButton } from "@/components/dashboard/delete-post-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlogsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const status = params.status || "all";

  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  // Build query
  let query = supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Fetch posts
  const { data: posts } = await query;

  return (
    <div className="flex flex-1 flex-col gap-8 max-w-5xl mx-auto w-full pt-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-4xl font-serif font-medium tracking-tight">
            Your Stories
          </h1>
          <p className="text-muted-foreground mt-2 font-light text-lg">
            Manage your drafts and published works.
          </p>
        </div>
        <Button
          asChild
          className="rounded-full px-6 shadow-sm"
          variant="default"
        >
          <Link href="/dashboard/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Story
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
          <Button
            asChild
            variant={status === "all" ? "secondary" : "ghost"}
            size="sm"
            className={`rounded-md px-4 h-8 text-sm font-medium ${
              status === "all"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link href="/dashboard/blogs">All</Link>
          </Button>
          <Button
            asChild
            variant={status === "draft" ? "secondary" : "ghost"}
            size="sm"
            className={`rounded-md px-4 h-8 text-sm font-medium ${
              status === "draft"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link href="/dashboard/blogs?status=draft">Drafts</Link>
          </Button>
          <Button
            asChild
            variant={status === "published" ? "secondary" : "ghost"}
            size="sm"
            className={`rounded-md px-4 h-8 text-sm font-medium ${
              status === "published"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link href="/dashboard/blogs?status=published">Published</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        {!posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-muted/5">
            <p className="text-muted-foreground mb-4 font-light">
              No stories found.
            </p>
            {status !== "all" && (
              <Button asChild variant="link">
                <Link href="/dashboard/blogs">Clear filter</Link>
              </Button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="group relative flex items-center justify-between p-5 -mx-5 rounded-xl hover:bg-muted/40 transition-all duration-200"
            >
              <Link
                href={`/dashboard/blogs/${post.id}`}
                className="absolute inset-0 z-0"
              />

              <div className="flex flex-col gap-1.5 z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      post.status === "published"
                        ? "bg-green-500/60"
                        : post.status === "scheduled"
                        ? "bg-blue-500/60"
                        : "bg-stone-300"
                    }`}
                  />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    {post.status}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-medium group-hover:text-primary transition-colors">
                  {post.title || "Untitled"}
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                  <span>
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {post.read_time && (
                    <>
                      <span>•</span>
                      <span>{post.read_time} min read</span>
                    </>
                  )}
                </div>
              </div>

              <div className="z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeletePostButton postId={post.id} variant="ghost" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
