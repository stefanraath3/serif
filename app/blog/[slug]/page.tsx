import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, summary, image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary || undefined,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (
        first_name,
        avatar_url
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    notFound();
  }

  const profile = post.profiles as {
    first_name: string | null;
    avatar_url: string | null;
  } | null;
  const authorName = profile?.first_name || post.author || "Anonymous";
  const authorAvatar = profile?.avatar_url || null;
  const authorInitials = authorName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        {post.image && (
          <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>
        {post.summary && (
          <p className="text-xl text-muted-foreground mb-4">{post.summary}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {authorAvatar && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback className="text-xs">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <span>By {authorName}</span>
          </div>
          {post.read_time && (
            <>
              <span>•</span>
              <span>{post.read_time} min read</span>
            </>
          )}
          <span>•</span>
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      <div
        className="max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-4 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-primary [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-6"
        dangerouslySetInnerHTML={{ __html: post.body || "" }}
      />
    </article>
  );
}
