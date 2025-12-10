import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText, Settings } from "lucide-react";
import { mockPosts } from "@/lib/data/mock-posts";

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

  // For now, use mock data. Later replace with actual Supabase query:
  // const { data: posts } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false })
  //   .limit(5)

  const recentPosts = mockPosts.slice(0, 3);
  const displayName = profile?.first_name || email?.split("@")[0] || "there";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts and settings from here.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No posts yet
                </p>
                <Button asChild size="sm">
                  <Link href="/dashboard/blogs/new">
                    Create your first post
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 space-y-1">
                      <Link
                        href={`/dashboard/blogs/${post.id}`}
                        className="font-medium hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content || "No content"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {post.status}
                        </span>
                        <span>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/dashboard/blogs">View all posts</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/blogs/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/blogs">
                <FileText className="mr-2 h-4 w-4" />
                Manage Posts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
