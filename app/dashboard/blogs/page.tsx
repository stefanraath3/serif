import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DeletePostButton } from "@/components/dashboard/delete-post-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function BlogsPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  // Fetch posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col gap-12 max-w-5xl mx-auto w-full pt-8">
      <div className="flex items-end justify-between border-b border-border/40 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-medium tracking-tight">
            Your Writing
          </h1>
          <p className="text-muted-foreground mt-2 font-light">
            Focus on what matters.
          </p>
        </div>
        <Button asChild className="rounded-full px-6" variant="default">
          <Link href="/dashboard/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Story
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {!posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No stories yet.</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/blogs/new">Create your first story</Link>
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="group relative flex items-center justify-between p-6 -mx-6 rounded-xl hover:bg-muted/50 transition-colors duration-200"
            >
              <Link
                href={`/dashboard/blogs/${post.id}`}
                className="absolute inset-0 z-0"
              />

              <div className="flex flex-col gap-2 z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      post.status === "published"
                        ? "bg-green-500/50"
                        : post.status === "scheduled"
                        ? "bg-blue-500/50"
                        : "bg-stone-300"
                    }`}
                  />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {post.status}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-medium group-hover:text-primary transition-colors">
                  {post.title || "Untitled"}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
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
