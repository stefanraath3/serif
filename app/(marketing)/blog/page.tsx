import { createClient } from "@/lib/supabase/server";
import { BlogCard } from "@/components/blog/blog-card";
import type { PublicPost } from "@/lib/types";

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("public_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<PublicPost[]>();

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container mx-auto px-6 pt-32 pb-24 max-w-6xl">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4 text-stone-900">
              Blog
            </h1>
            <p className="text-stone-600 text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 pt-32 pb-24 max-w-6xl">
        <header className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4 text-stone-900">
            Blog
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Stories, thoughts, and ideas from our writers.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              summary={post.summary}
              image={post.image}
              authorName={post.author_name}
              authorAvatar={post.author_avatar}
              createdAt={post.created_at}
              readTime={post.read_time}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
